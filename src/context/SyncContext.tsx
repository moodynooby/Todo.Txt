import { serverTimestamp } from "firebase/firestore";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useNotesContext } from "@/context/NotesContext";
import type { TimerState } from "@/context/TimerContext";
import { useTimerContext } from "@/context/TimerContext";
import { useTodoContext } from "@/context/TodoContext";
import { getFirestoreDb, signOutUser } from "@/lib/firebase";
import {
	type DocUpdate,
	getDocWithRetry,
	subscribeDoc,
	writeDocs,
} from "@/lib/firestoreClient";
import { writeNotesBackup } from "@/lib/notesBackup";
import {
	EXCALIDRAW_DOC,
	GROQ_SETTINGS_DOC,
	NOTES_DOC,
	TIMERS_DOC,
	TODO_DOC,
} from "@/lib/syncPaths";
import type { Note } from "@/types/notes";
import type { BackupData, ExcalidrawData, SyncStatus } from "@/types/sync";

const BACKUP_KEY = "todo_content_backup";
const WRITE_DEBOUNCE_MS = 1000;
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
	notes: Note[] | null;
	timers: TimerState[] | null;
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

/** BUG FIX: startup read previously used the raw localStorage string, which
 *  disagrees with the JSON `{ content, updatedAt }` format written here
 *  (see readContentBackup in App.tsx). Expose one canonical reader so both
 *  sides parse the same shape. */
export const readContentBackupJson = (): string | null => {
	const backup = readBackup();
	return backup?.content ?? null;
};

const performMigration = (uid: string): Promise<void> => {
	const backup = readBackup();
	// BUG FIX (old): `!backup?.content && !backup?.updatedAt` was always true
	// when backup existed with an empty string content (falsy `0` for
	// updatedAt), skipping migration and losing local data. Check for a real
	// BackupData object instead.
	if (!backup) return Promise.resolve();

	const db = getFirestoreDb();
	return writeDocs(db, uid, [
		{
			path: TODO_DOC,
			data: {
				content: backup.content ?? "",
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			},
		},
	]).then(() => {
		localStorage.removeItem(BACKUP_KEY);
		localStorage.setItem(`${MIGRATED_KEY}_${uid}`, "true");
	});
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
	const { dispatchNotes } = useNotesContext();
	const { state: timersState, dispatchTimer } = useTimerContext();

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
	const uidRef = useRef<string | null>(null);
	uidRef.current = authState.user?.uid ?? null;

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

	/** All synced documents in one place. Adding a new feature (habits, ...)
	 *  means appending an entry here instead of editing the sync loop itself. */
	interface SyncStore {
		path: import("@/lib/firestoreClient").UserDocPath;
		setLocal: (data: unknown) => void;
		fromQueue: (item: SaveQueueItem) => unknown;
		toFields: (data: unknown) => Record<string, unknown>;
		fromFields: (data: Record<string, unknown>) => unknown;
	}

	const syncStores = useMemo<SyncStore[]>(
		() => [
			{
				path: TODO_DOC,
				setLocal: (data) => {
					dispatchTodo({
						type: "SET_CONTENT",
						payload: {
							content: (data as { content: string }).content,
							timestamp: Date.now(),
						},
					});
				},
				fromQueue: (item: SaveQueueItem) => ({ content: item.content }),
				toFields: (data) => ({
					content: (data as { content: string }).content,
				}),
				fromFields: (data: Record<string, unknown>) =>
					data.content !== undefined
						? { content: data.content as string }
						: undefined,
			},
			{
				path: EXCALIDRAW_DOC,
				setLocal: (data) =>
					storesRef.current.onExcalidrawChange(data as ExcalidrawData),
				fromQueue: (item: SaveQueueItem) =>
					item.excalidraw !== undefined
						? (item.excalidraw ?? undefined)
						: undefined,
				toFields: (data) => ({ data }),
				fromFields: (data) =>
					data.data !== undefined ? (data.data as ExcalidrawData) : undefined,
			},
			{
				path: GROQ_SETTINGS_DOC,
				setLocal: (data) =>
					storesRef.current.onGroqApiKeyChange(data as string),
				fromQueue: (item: SaveQueueItem) => item.groqApiKey,
				toFields: (data) => ({ apiKey: data }),
				fromFields: (data) =>
					data.apiKey !== undefined ? (data.apiKey as string) : undefined,
			},
			{
				path: NOTES_DOC,
				setLocal: (data) =>
					dispatchNotes({
						type: "SET_NOTES",
						payload: data as unknown as Note[],
					}),
				fromQueue: (item: SaveQueueItem) =>
					item.notes !== null ? item.notes : undefined,
				toFields: (data) => ({ notes: data }),
				fromFields: (data) =>
					Array.isArray(data.notes)
						? (data.notes as unknown as Note[])
						: undefined,
			},
			{
				path: TIMERS_DOC,
				setLocal: (data) =>
					dispatchTimer({
						type: "SET_TIMERS",
						payload: data as unknown as TimerState[],
					}),
				// Only sync idle timers: active/running timer state is
				// per-device runtime data and resuming it on another device
				// would show wrong elapsed times.
				fromQueue: (item: SaveQueueItem) => {
					if (item.timers === null) return undefined;
					return item.timers.filter((t) => !t.isActive && !t.startTime);
				},
				toFields: (data) => ({ timers: data }),
				fromFields: (data) => {
					if (!Array.isArray(data.timers)) return undefined;
					return (data.timers as unknown as TimerState[]).map((t) => ({
						...t,
						isActive: false,
						startTime: null,
					}));
				},
			},
		],
		[dispatchTodo, dispatchNotes, dispatchTimer],
	);

	const processSaveQueueRef = useRef<() => Promise<void>>(async () => {});

	const processSaveQueue = useCallback(async () => {
		if (saveQueueRef.current.length === 0 || isProcessingRef.current) return;

		isProcessingRef.current = true;

		const batch = saveQueueRef.current.shift();
		if (!batch) {
			isProcessingRef.current = false;
			return;
		}

		const db = getFirestoreDb();
		const uid = uidRef.current;
		if (!uid) {
			isProcessingRef.current = false;
			return;
		}

		setSyncStatus("syncing");

		try {
			// Write every synced store in one atomic batch instead of N
			// sequential setDoc calls (previously 1-3 round trips per save).
			await writeDocs(
				db,
				uid,
				syncStores
					.map((store) => {
						const value = store.fromQueue(batch);
						if (value === undefined) return null;
						return { path: store.path, data: store.toFields(value) };
					})
					.filter((item): item is DocUpdate => item !== null),
			);
			setSyncStatus("synced");
		} catch (e) {
			console.error("Firestore write error:", e);
			setSyncStatus("error");
		}

		if (saveQueueRef.current.length > 0) {
			setTimeout(() => processSaveQueueRef.current(), 50);
		} else {
			isProcessingRef.current = false;
		}
	}, [syncStores]);

	processSaveQueueRef.current = processSaveQueue;

	const writeDoc = useCallback(() => {
		saveQueueRef.current.push({
			content: todoState.content,
			excalidraw: excalidrawData ?? null,
			groqApiKey,
			notes: null,
			timers: null,
		});

		if (!isProcessingRef.current) {
			processSaveQueue();
		}
	}, [todoState.content, excalidrawData, groqApiKey, processSaveQueue]);

	const setupFirestore = useCallback(
		async (uid: string) => {
			const db = getFirestoreDb();

			try {
				// Initial fetch of every synced document in one go instead of
				// three sequential getDoc calls.
				const snapshots = await Promise.all(
					syncStores.map((store) => getDocWithRetry(db, uid, store.path)),
				);

				const todoSnapshot = snapshots[0];

				if (todoSnapshot.exists && todoSnapshot.data) {
					lastRemoteTimestampRef.current = todoSnapshot.updatedAt;

					const localBackup = readBackup();
					const localTs = localBackup?.updatedAt ?? 0;
					const remoteContent = (todoSnapshot.data as { content?: string })
						.content;

					if (localBackup?.content && localTs > todoSnapshot.updatedAt) {
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
					// Migration just wrote the remote doc; re-read it to seed
					// the timestamp instead of fetching twice (old path).
					const afterMigration = await getDocWithRetry(db, uid, TODO_DOC);
					if (afterMigration.exists) {
						lastRemoteTimestampRef.current = afterMigration.updatedAt;
					}
				}

				// Push initial remote values down for every store.
				snapshots.forEach((snap, index) => {
					if (snap.exists && snap.data) {
						const value = syncStores[index].fromFields(
							snap.data as Record<string, unknown>,
						);
						if (value !== undefined) syncStores[index].setLocal(value);
					}
				});

				// BUG FIX (old): reconnecting after a snapshot error called
				// setupFirestore again while the previous onSnapshot listener
				// was still subscribed, so two listeners fought over state.
				// Tear down any existing subscription first.
				unsubFirestoreRef.current?.();
				unsubFirestoreRef.current = null;

				unsubFirestoreRef.current = subscribeDoc(
					db,
					uid,
					TODO_DOC,
					(data, updatedAt) => {
						lastRemoteTimestampRef.current = updatedAt;
						const todoData = data as { content?: string };
						if (todoData.content !== undefined) {
							dispatchTodo({
								type: "SET_CONTENT",
								payload: {
									content: todoData.content,
									timestamp: Date.now(),
								},
							});
						}
						setSyncStatus("synced");
						cancelDisconnectGrace();
					},
					lastRemoteTimestampRef.current,
					(err) => {
						console.error("Firestore snapshot error:", err);
						setSyncStatus("error");
						const delay = Math.min(500 * 2 ** retryCountRef.current, 30000);
						retryCountRef.current++;
						retryTimerRef.current = setTimeout(() => {
							setupFirestore(uidRef.current ?? uid);
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
				// Auto-retry initial connection failures (previously they
				// failed silently and left the app disconnected).
				const delay = Math.min(500 * 2 ** retryCountRef.current, 30000);
				retryCountRef.current++;
				retryTimerRef.current = setTimeout(() => {
					setupFirestore(uidRef.current ?? uid);
				}, delay);
			}
		},
		[dispatchTodo, cancelDisconnectGrace, syncStores],
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
			writeBackup(todoState.content);

			if (!isConnected || !authState.user) return;

			writeDoc();
		}, WRITE_DEBOUNCE_MS);

		return () => {
			if (writeTimerRef.current) {
				clearTimeout(writeTimerRef.current);
				writeTimerRef.current = null;
			}
		};
	}, [todoState.content, isConnected, authState.user, writeDoc]);

	// Notes are local-first: back up on every change, then enqueue a remote
	// save so both local and cloud stay consistent.
	const { state: notesState } = useNotesContext();
	useEffect(() => {
		writeNotesBackup(notesState.notes);

		if (!isConnected || !authState.user) return;

		saveQueueRef.current.push({
			content: todoState.content,
			excalidraw: excalidrawData ?? null,
			groqApiKey,
			notes: notesState.notes,
			timers: null,
		});

		if (!isProcessingRef.current) {
			processSaveQueue();
		}
	}, [
		notesState.notes,
		isConnected,
		authState.user,
		excalidrawData,
		processSaveQueue,
		groqApiKey,
		todoState.content,
	]);

	// Timers sync the idle snapshot whenever the list changes.
	useEffect(() => {
		if (!isConnected || !authState.user) return;

		saveQueueRef.current.push({
			content: todoState.content,
			excalidraw: excalidrawData ?? null,
			groqApiKey,
			notes: null,
			timers: timersState.timers,
		});

		if (!isProcessingRef.current) {
			processSaveQueue();
		}
	}, [
		timersState.timers,
		isConnected,
		authState.user,
		todoState.content,
		groqApiKey,
		processSaveQueue,
		excalidrawData,
	]);

	useEffect(() => {
		dispatchAuth({ type: "SET_CONNECTED", payload: isConnected });
		dispatchAuth({ type: "SET_SYNC_STATUS", payload: syncStatus });
	}, [isConnected, syncStatus, dispatchAuth]);

	const connect = useCallback(async () => {
		cancelDisconnectGrace();
		const uid = uidRef.current;
		if (uid) {
			teardownFirestore();
			setSyncStatus("connecting");
			await setupFirestore(uid);
		}
	}, [teardownFirestore, setupFirestore, cancelDisconnectGrace]);

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
