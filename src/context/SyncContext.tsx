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
import { useNotesContext } from "@/context/NotesContext";
import { useTodoContext } from "@/context/TodoContext";
import type { ExcalidrawData } from "@/lib/excalidrawSync";
import { getFirestoreDb, signOutUser } from "@/lib/firebase";
import type { Note } from "@/types/notes";
import type { SyncStatus } from "@/types/sync";

const BACKUP_KEY = "todo_content_backup";
const WRITE_DEBOUNCE_MS = 1000;
const RETRY_BASE_MS = 500;
const RETRY_MAX_MS = 30000;

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
	notes: Note[] | undefined;
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

const readBackup = (): string | null => {
	try {
		return localStorage.getItem(BACKUP_KEY);
	} catch {
		return null;
	}
};

const writeBackup = (content: string): void => {
	try {
		localStorage.setItem(BACKUP_KEY, content);
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
	const { state: notesState, dispatchNotes } = useNotesContext();
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

	const readFieldsFromDoc = useCallback(
		(data: Record<string, unknown>, isRemote = false) => {
			if (isRemote) {
				const remoteTs = (data.updatedAt as Timestamp)?.toMillis?.() ?? 0;
				if (remoteTs <= lastRemoteTimestampRef.current) return;
				lastRemoteTimestampRef.current = remoteTs;
			}

			const stores = storesRef.current;
			if (data.content !== undefined) {
				dispatchTodo({
					type: "SET_CONTENT",
					payload: {
						content: data.content as string,
						timestamp: Date.now(),
					},
				});
			}
			if (data.notes !== undefined) {
				dispatchNotes({ type: "SET_NOTES", payload: data.notes as Note[] });
			}
			if (data.excalidraw !== undefined) {
				stores.onExcalidrawChange(data.excalidraw as ExcalidrawData);
			}
			if (data.groqApiKey !== undefined) {
				stores.onGroqApiKeyChange(data.groqApiKey as string);
			}
		},
		[dispatchNotes, dispatchTodo],
	);

	const processSaveQueue = useCallback(async () => {
		if (saveQueueRef.current.length === 0 || isProcessingRef.current) return;

		isProcessingRef.current = true;

		const batch = saveQueueRef.current.shift();
		if (!batch) {
			isProcessingRef.current = false;
			return;
		}

		const data: Record<string, unknown> = {
			content: batch.content,
			updatedAt: serverTimestamp(),
		};
		if (batch.notes !== undefined) data.notes = batch.notes;
		if (batch.excalidraw !== undefined) data.excalidraw = batch.excalidraw;
		if (batch.groqApiKey !== undefined) data.groqApiKey = batch.groqApiKey;

		const db = getFirestoreDb();
		const docRef = doc(db, "todos", `todo_${authState.user?.uid ?? ""}`);

		setSyncStatus("syncing");

		try {
			await setDoc(docRef, data, { merge: true });
			setSyncStatus("synced");
		} catch (e) {
			console.error("Firestore write error:", e);
			setSyncStatus("error");
		}

		if (saveQueueRef.current.length > 0) {
			setTimeout(processSaveQueue, 50);
		} else {
			isProcessingRef.current = false;
		}
	}, [authState.user?.uid]);

	const writeDoc = useCallback(() => {
		const pendingWrite: SaveQueueItem = {
			content,
			notes: notesState.notes,
			excalidraw: excalidrawData ?? null,
			groqApiKey,
		};

		saveQueueRef.current.push(pendingWrite);

		if (!isProcessingRef.current) {
			processSaveQueue();
		}
	}, [content, notesState.notes, excalidrawData, groqApiKey, processSaveQueue]);

	const setupFirestore = useCallback(
		async (uid: string) => {
			const db = getFirestoreDb();
			const docRef = doc(db, "todos", `todo_${uid}`);

			try {
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					const data = docSnap.data();
					lastRemoteTimestampRef.current =
						(data.updatedAt as Timestamp)?.toMillis?.() ?? 0;
					readFieldsFromDoc(data as Record<string, unknown>);
				} else {
					const backup = readBackup();
					const initialData: Record<string, unknown> = {
						content: backup ?? "",
						createdAt: serverTimestamp(),
						updatedAt: serverTimestamp(),
					};
					await setDoc(docRef, initialData);
				}

				unsubFirestoreRef.current = onSnapshot(
					docRef,
					(snap) => {
						if (!snap.exists()) return;
						if (snap.metadata.hasPendingWrites) return;
						readFieldsFromDoc(snap.data() as Record<string, unknown>, true);
						setSyncStatus("synced");
						cancelDisconnectGrace();
					},
					(err) => {
						console.error("Firestore snapshot error:", err);
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
				console.error("Firestore setup error:", e);
				setSyncStatus("error");
			}
		},
		[readFieldsFromDoc, cancelDisconnectGrace],
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
	}, [isConnected, dispatchAuth]);

	useEffect(() => {
		dispatchAuth({ type: "SET_SYNC_STATUS", payload: syncStatus });
	}, [syncStatus, dispatchAuth]);

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
