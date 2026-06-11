import {
	doc,
	getDoc,
	onSnapshot,
	serverTimestamp,
	setDoc,
	type Timestamp,
} from "firebase/firestore";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useTodoContext } from "@/context/TodoContext";
import { getFirestoreDb, signOutUser } from "@/lib/firebase";
import type { BackupData, ExcalidrawData, SyncStatus } from "@/types/sync";

const BACKUP_KEY = "todo_content_backup";
const WRITE_DEBOUNCE_MS = 1000;
const RETRY_BASE_MS = 500;
const RETRY_MAX_MS = 30000;
const MIGRATED_KEY = "migration_completed";

interface SyncContextValue {
	connect: () => void;
	disconnect: () => void;
}

const SyncContext = createContext<SyncContextValue | null>(null);

export const useSyncContext = (): SyncContextValue => {
	const ctx = useContext(SyncContext);
	if (!ctx) {
		throw new Error("useSyncContext must be used within SyncContext.Provider");
	}
	return ctx;
};

interface SaveQueueItem {
	content: string;
	excalidraw: ExcalidrawData | null;
	groqApiKey: string | undefined;
}

interface SyncProviderProps {
	children: ReactNode;
	excalidrawData: ExcalidrawData | null;
	groqApiKey: string;
	onExcalidrawChange: (data: ExcalidrawData | null) => void;
	onGroqApiKeyChange: (key: string) => void;
}

const readBackup = (): BackupData | null => {
	try {
		const raw = localStorage.getItem(BACKUP_KEY);
		if (!raw) return null;
		try {
			const parsed = JSON.parse(raw);
			if (parsed && typeof parsed === "object" && "content" in parsed) {
				return parsed as BackupData;
			}
		} catch {
			// Legacy format: plain string
		}
		return { content: raw, updatedAt: 0 };
	} catch {
		return null;
	}
};

const writeBackup = (content: string): void => {
	try {
		const data: BackupData = { content, updatedAt: Date.now() };
		localStorage.setItem(BACKUP_KEY, JSON.stringify(data));
	} catch {}
};

export function SyncProvider({
	children,
	excalidrawData,
	groqApiKey,
	onExcalidrawChange,
	onGroqApiKeyChange,
}: SyncProviderProps) {
	const { state: todoState, dispatchTodo } = useTodoContext();
	const { state: authState, dispatchAuth } = useAuthContext();

	const storesRef = useRef({
		onExcalidrawChange,
		onGroqApiKeyChange,
	});
	storesRef.current = {
		onExcalidrawChange,
		onGroqApiKeyChange,
	};

	const [isConnected, setIsConnected] = useState(false);
	const [syncStatus, setSyncStatus] = useState<SyncStatus>("disconnected");

	const unsubFirestoreRef = useRef<(() => void) | null>(null);
	const lastRemoteTimestampRef = useRef(0);
	const saveQueueRef = useRef<SaveQueueItem[]>([]);
	const isProcessingRef = useRef(false);
	const writeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const retryCountRef = useRef(0);
	const disconnectGraceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const { content } = todoState;

	const processSaveQueueRef = useRef<() => Promise<void>>(async () => {});

	const cancelDisconnectGrace = useCallback(() => {
		if (disconnectGraceRef.current) {
			clearTimeout(disconnectGraceRef.current);
			disconnectGraceRef.current = null;
		}
	}, []);

	const teardownFirestore = useCallback(() => {
		unsubFirestoreRef.current?.();
		unsubFirestoreRef.current = null;
		setIsConnected(false);
		setSyncStatus("disconnected");
		if (retryTimerRef.current) {
			clearTimeout(retryTimerRef.current);
			retryTimerRef.current = null;
		}
	}, []);

	const processSaveQueue = useCallback(async () => {
		if (saveQueueRef.current.length === 0 || isProcessingRef.current) return;

		isProcessingRef.current = true;

		const batch = saveQueueRef.current.shift();
		if (!batch) {
			isProcessingRef.current = false;
			return;
		}

		const db = getFirestoreDb();
		const uid = authState.user?.uid ?? "";
		const todoDocRef = doc(db, "users", uid, "todos", "main");
		const excalidrawDocRef = doc(db, "users", uid, "excalidraw", "main");
		const groqDocRef = doc(db, "users", uid, "settings", "groq");

		setSyncStatus("syncing");

		try {
			await setDoc(
				todoDocRef,
				{ content: batch.content, updatedAt: serverTimestamp() },
				{ merge: true },
			);
			if (batch.excalidraw !== undefined) {
				await setDoc(
					excalidrawDocRef,
					{ data: batch.excalidraw, updatedAt: serverTimestamp() },
					{ merge: true },
				);
			}
			if (batch.groqApiKey !== undefined) {
				await setDoc(
					groqDocRef,
					{ apiKey: batch.groqApiKey, updatedAt: serverTimestamp() },
					{ merge: true },
				);
			}
			setSyncStatus("synced");
		} catch (e) {
			if (import.meta.env.DEV) {
				console.error("Firestore write error:", e);
			}
			setSyncStatus("error");
		}

		if (saveQueueRef.current.length > 0) {
			setTimeout(() => processSaveQueueRef.current(), 50);
		} else {
			isProcessingRef.current = false;
		}
	}, [authState.user?.uid]);

	processSaveQueueRef.current = processSaveQueue;

	const writeDoc = useCallback(() => {
		const pendingWrite: SaveQueueItem = {
			content,
			excalidraw: excalidrawData ?? null,
			groqApiKey,
		};

		saveQueueRef.current.push(pendingWrite);

		if (!isProcessingRef.current) {
			processSaveQueue();
		}
	}, [content, excalidrawData, groqApiKey, processSaveQueue]);

	const performMigration = useCallback((uid: string) => {
		const db = getFirestoreDb();
		const todoDocRef = doc(db, "users", uid, "todos", "main");
		const backup = readBackup();

		if (!backup?.content && !backup?.updatedAt) {
			return Promise.resolve();
		}

		return setDoc(
			todoDocRef,
			{
				content: backup.content ?? "",
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			},
			{ merge: true },
		).then(() => {
			localStorage.removeItem(BACKUP_KEY);
			localStorage.setItem(`${MIGRATED_KEY}_${uid}`, "true");
		});
	}, []);

	const setupFirestore = useCallback(
		async (uid: string) => {
			const db = getFirestoreDb();
			const todoDocRef = doc(db, "users", uid, "todos", "main");
			const excalidrawDocRef = doc(db, "users", uid, "excalidraw", "main");
			const groqDocRef = doc(db, "users", uid, "settings", "groq");

			try {
				const [todoSnap, excalidrawSnap, groqSnap] = await Promise.all([
					getDoc(todoDocRef),
					getDoc(excalidrawDocRef),
					getDoc(groqDocRef),
				]);

				if (todoSnap.exists()) {
					const remoteData = todoSnap.data() as Record<string, unknown>;
					const remoteTs =
						(remoteData.updatedAt as Timestamp)?.toMillis?.() ?? 0;
					lastRemoteTimestampRef.current = remoteTs;

					const localBackup = readBackup();
					const localTs = localBackup?.updatedAt ?? 0;
					const remoteContent = remoteData.content as string | undefined;

					if (localBackup?.content && localTs > remoteTs) {
						dispatchTodo({
							type: "SET_CONTENT",
							payload: { content: localBackup.content, timestamp: Date.now() },
						});
					} else if (remoteContent !== undefined) {
						dispatchTodo({
							type: "SET_CONTENT",
							payload: { content: remoteContent, timestamp: Date.now() },
						});
					}
				} else if (localStorage.getItem(`${MIGRATED_KEY}_${uid}`) !== "true") {
					await performMigration(uid);
					const todoSnapAfter = await getDoc(todoDocRef);
					if (todoSnapAfter.exists()) {
						const remoteData = todoSnapAfter.data() as Record<string, unknown>;
						const remoteTs =
							(remoteData.updatedAt as Timestamp)?.toMillis?.() ?? 0;
						lastRemoteTimestampRef.current = remoteTs;
					}
				}

				if (
					excalidrawSnap.exists() &&
					excalidrawSnap.data().data !== undefined
				) {
					storesRef.current.onExcalidrawChange(
						excalidrawSnap.data().data as ExcalidrawData,
					);
				}

				if (groqSnap.exists() && groqSnap.data().apiKey !== undefined) {
					storesRef.current.onGroqApiKeyChange(
						groqSnap.data().apiKey as string,
					);
				}

				unsubFirestoreRef.current = onSnapshot(
					todoDocRef,
					(snap) => {
						if (!snap.exists()) return;
						if (snap.metadata.hasPendingWrites) return;
						const data = snap.data() as Record<string, unknown>;
						const remoteTs = (data.updatedAt as Timestamp)?.toMillis?.() ?? 0;
						if (remoteTs <= lastRemoteTimestampRef.current) return;
						lastRemoteTimestampRef.current = remoteTs;
						if (data.content !== undefined) {
							dispatchTodo({
								type: "SET_CONTENT",
								payload: {
									content: data.content as string,
									timestamp: Date.now(),
								},
							});
						}
						setSyncStatus("synced");
						cancelDisconnectGrace();
					},
					(err) => {
						if (import.meta.env.DEV) {
							console.error("Firestore snapshot error:", err);
						}
						setSyncStatus("error");
						const delay = Math.min(
							RETRY_BASE_MS * 2 ** retryCountRef.current,
							RETRY_MAX_MS,
						);
						retryCountRef.current++;
						retryTimerRef.current = setTimeout(() => {
							setupFirestore(uid);
						}, delay);
					},
				);

				setIsConnected(true);
				retryCountRef.current = 0;
				cancelDisconnectGrace();
				setSyncStatus("synced");
			} catch (e) {
				if (import.meta.env.DEV) {
					console.error("Firestore setup error:", e);
				}
				setSyncStatus("error");
			}
		},
		[dispatchTodo, cancelDisconnectGrace, performMigration],
	);

	useEffect(() => {
		const uid = authState.user?.uid;
		if (uid) {
			setSyncStatus("connecting");
			setupFirestore(uid);
		} else {
			cancelDisconnectGrace();
			teardownFirestore();
		}

		return () => {
			teardownFirestore();
			cancelDisconnectGrace();
		};
	}, [
		authState.user?.uid,
		setupFirestore,
		teardownFirestore,
		cancelDisconnectGrace,
	]);

	useEffect(() => {
		if (writeTimerRef.current) clearTimeout(writeTimerRef.current);

		writeTimerRef.current = setTimeout(() => {
			writeBackup(content);

			if (!isConnected || !authState.user) return;

			writeDoc();
		}, WRITE_DEBOUNCE_MS);

		return () => {
			if (writeTimerRef.current) {
				clearTimeout(writeTimerRef.current);
				writeTimerRef.current = null;
			}
		};
	}, [content, isConnected, authState.user, writeDoc]);

	useEffect(() => {
		dispatchAuth({ type: "SET_CONNECTED", payload: isConnected });
		dispatchAuth({ type: "SET_SYNC_STATUS", payload: syncStatus });
	}, [isConnected, syncStatus, dispatchAuth]);

	const connect = useCallback(async () => {
		cancelDisconnectGrace();
		const uid = authState.user?.uid;
		if (uid) {
			teardownFirestore();
			setSyncStatus("connecting");
			await setupFirestore(uid);
		}
	}, [
		authState.user?.uid,
		teardownFirestore,
		setupFirestore,
		cancelDisconnectGrace,
	]);

	const disconnect = useCallback(async () => {
		cancelDisconnectGrace();
		teardownFirestore();
		if (authState.user) {
			try {
				await signOutUser();
			} catch (e) {
				console.error("Sign out error:", e);
			}
		}
	}, [teardownFirestore, authState.user, cancelDisconnectGrace]);

	return (
		<SyncContext.Provider value={{ connect, disconnect }}>
			{children}
		</SyncContext.Provider>
	);
}
