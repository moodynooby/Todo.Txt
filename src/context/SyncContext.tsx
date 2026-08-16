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
import { useHabitsContext } from "@/context/HabitsContext";
import { useNotesContext } from "@/context/NotesContext";
import { useTodoContext } from "@/context/TodoContext";
import { getFirestoreDb, signOutUser } from "@/lib/firebase";
import { getDocWithRetry } from "@/lib/firestoreClient";
import { readHabitsBackupWithTs } from "@/lib/habitsBackup";
import { readNotesBackupWithTs } from "@/lib/notesBackup";
import { SyncFeatures } from "@/lib/syncAdapters";
import { clearOutbox } from "@/lib/syncOutbox";
import { HABITS_DOC, NOTES_DOC, TODO_DOC } from "@/lib/syncPaths";
import { decideReconcile } from "@/lib/syncReconcile";
import { readTodoBackup, writeTodoBackup } from "@/lib/todoBackup";
import { createSyncEngine, SyncEngineContext } from "@/lib/useSyncedDocument";
import type { BackupData, ExcalidrawData, SyncStatus } from "@/types/sync";

/**
 * SyncProvider — owns the *connection lifecycle only*.
 *
 * Feature syncing (notes, timers, excalidraw, groq, future habits) lives in
 * `useSyncedDocument` calls — this component no longer knows what features
 * exist. The two legacy special cases (content backup + migration) remain
 * here because they are about the auth/migration flow, not about features.
 */

// Fix F1: all todo-backup access now routes through `src/lib/todoBackup.ts`
// (single reader/writer pair) instead of ad-hoc localStorage calls, so the
// mirror can never again be read once and deleted.
const MIGRATED_KEY = "migration_completed";

const BACKUP_KEY_LEGACY_NOTE = "notes_backup";

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

interface SyncProviderProps {
	children: ReactNode;
	excalidrawData: ExcalidrawData | null;
	groqApiKey: string;
	onExcalidrawChange: (data: ExcalidrawData | null) => void;
	onGroqApiKeyChange: (key: string) => void;
}

// ---------------------------------------------------------------------------
// Legacy todo-content backup helpers (migration + startup conflict resolution).
// Kept here because they belong to the auth/migration flow, not to features.
// Reading now delegates to the canonical todo-backup module; the local mirror
// is NEVER deleted after migration so offline sessions keep a durable seed.
// ---------------------------------------------------------------------------

const readBackup = (): BackupData | null => readTodoBackup();

export const readContentBackupJson = (): string | null => {
	const backup = readBackup();
	return backup?.content ?? null;
};

export function readNotesBackupJson(): unknown[] | null {
	try {
		const raw = localStorage.getItem(BACKUP_KEY_LEGACY_NOTE);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (
			parsed &&
			typeof parsed === "object" &&
			Array.isArray((parsed as { data?: unknown }).data)
		) {
			return (parsed as { data: unknown[] }).data;
		}
		if (Array.isArray(parsed)) return parsed;
		return null;
	} catch {
		return null;
	}
}

const performMigration = async (
	engine: import("@/lib/useSyncedDocument").SyncEngine,
	uid: string,
): Promise<void> => {
	const backup = readBackup();
	// BUG FIX (old): `!backup?.content && !backup?.updatedAt` was always true
	// when a backup existed with empty-string content (falsy `0` updatedAt),
	// skipping migration and losing local data. Check for a real object.
	if (!backup) return;

	await engine.enqueue({
		path: TODO_DOC,
		data: {
			content: backup.content ?? "",
			updatedAt: Date.now(),
		},
	});
	// Fix F1: migration no longer deletes the local backup. The mirror stays
	// current because the new `useSyncedTodo` adapter rewrites it on every
	// change; deleting it here was the root cause of post-migration data loss.
	localStorage.setItem(`${MIGRATED_KEY}_${uid}`, "true");
};

// ---------------------------------------------------------------------------

export function SyncProvider(props: SyncProviderProps) {
	const { state: authState, dispatchAuth } = useAuthContext();
	const { dispatchTodo } = useTodoContext();
	const { dispatchNotes } = useNotesContext();
	const { dispatchHabits } = useHabitsContext();
	const uid = authState.user?.uid ?? null;

	const engineRef = useRef<ReturnType<typeof createSyncEngine> | null>(null);
	if (!engineRef.current) {
		engineRef.current = createSyncEngine({ uid });
	}
	const engine = engineRef.current;
	// UID can change at runtime only on (re)auth; keep it fresh.
	engine.uid = uid;

	const [syncStatus, setSyncStatus] = useState<SyncStatus>("disconnected");
	const syncStatusRef = useRef(syncStatus);
	syncStatusRef.current = syncStatus;

	const connect = useCallback(async () => {
		if (!uid) return;
		setSyncStatus("connecting");
		try {
			// 1. Resolve the local-vs-remote conflict for every document with
			//    an offline seed. Fix S3: this used to exist for todos only —
			//    notes and habits silently lost local offline edits at connect
			//    time (the remote snapshot won by arrival). The decision is
			//    now the same pure rule for all three: server-clock-only
			//    comparison; local content that beats the remote is
			//    re-queued so it becomes the outgoing write instead of
			//    vanishing, and the engine outbox guarantees it survives
			//    teardown (syncOutbox).
			const todoSnap = await getDocWithRetry<{ content?: string }>(
				getFirestoreDb(),
				uid,
				TODO_DOC,
			);

			const localBackup = readBackup();
			const todoDecision = decideReconcile(todoSnap, {
				valueKey: "content",
				seed: localBackup
					? {
							localSeed: {
								value: localBackup.content,
								updatedAt: localBackup.updatedAt,
							},
						}
					: null,
			});
			if (todoDecision.action === "push") {
				dispatchTodo({
					type: "SET_CONTENT",
					payload: {
						content: todoDecision.value as string,
						timestamp: Date.now(),
					},
				});
				engine.enqueue({
					path: TODO_DOC,
					data: {
						content: todoDecision.value as string,
						updatedAt: Date.now(),
					},
				});
			} else if (todoDecision.action === "pull") {
				dispatchTodo({
					type: "SET_CONTENT",
					payload: {
						content: todoDecision.value as string,
						timestamp: Date.now(),
					},
				});
				writeTodoBackup(todoDecision.value as string, todoSnap.updatedAt);
			} else if (
				!todoSnap.exists &&
				localBackup &&
				localStorage.getItem(`${MIGRATED_KEY}_${uid}`) !== "true"
			) {
				await performMigration(engine, uid);
			}

			const notesSnap = await getDocWithRetry<{ value?: unknown[] }>(
				getFirestoreDb(),
				uid,
				NOTES_DOC,
			);
			const notesSeed = readNotesBackupWithTs();
			const notesDecision = decideReconcile(notesSnap, {
				valueKey: "value",
				seed: notesSeed
					? {
							localSeed: {
								value: notesSeed.notes,
								updatedAt: notesSeed.updatedAt,
							},
						}
					: null,
			});
			if (notesDecision.action === "push") {
				dispatchNotes({
					type: "SET_NOTES",
					payload: notesDecision.value as import("@/types/notes").Note[],
				});
				engine.enqueue({
					path: NOTES_DOC,
					data: { value: notesDecision.value, updatedAt: Date.now() },
				});
			} else if (notesDecision.action === "pull") {
				dispatchNotes({
					type: "SET_NOTES",
					payload: notesDecision.value as import("@/types/notes").Note[],
				});
			}

			const habitsSnap = await getDocWithRetry<{ habits?: unknown[] }>(
				getFirestoreDb(),
				uid,
				HABITS_DOC,
			);
			const habitsSeed = readHabitsBackupWithTs();
			const habitsDecision = decideReconcile(habitsSnap, {
				valueKey: "habits",
				seed: habitsSeed
					? {
							localSeed: {
								value: habitsSeed.data,
								updatedAt: habitsSeed.updatedAt,
							},
						}
					: null,
			});
			if (habitsDecision.action === "push") {
				dispatchHabits({
					type: "SET_HABITS",
					payload: habitsDecision.value as import("@/types/habits").Habit[],
				});
				engine.enqueue({
					path: HABITS_DOC,
					data: { habits: habitsDecision.value, updatedAt: Date.now() },
				});
			} else if (habitsDecision.action === "pull") {
				dispatchHabits({
					type: "SET_HABITS",
					payload: habitsDecision.value as import("@/types/habits").Habit[],
				});
			}

			engine.connected = true;
			setSyncStatus("synced");

			// 2. Start live updates for every registered feature now that the
			//    connection succeeded. Pending writes in the queue flush
			//    automatically (enqueued while unauthenticated), and any
			//    writes that survived a previous teardown (sign-out, page
			//    unload, app kill) are restored and drained too.
			engine.restoreOutbox();
			engine.subscribeAll();
		} catch (e) {
			console.error("Firestore connect error:", e);
			setSyncStatus("error");
		}
	}, [uid, dispatchTodo, dispatchNotes, dispatchHabits, engine]);

	const disconnect = useCallback(async () => {
		// Clear this account's persisted outbox before the uid flips — a
		// different user must never replay another account's pending writes
		// (syncOutbox is uid-scoped, but sign-out is the clean boundary).
		if (uid) clearOutbox(uid);
		engine.destroy();
		setSyncStatus("disconnected");
		if (authState.user) {
			try {
				await signOutUser();
			} catch (e) {
				console.error("Sign out error:", e);
			}
		}
	}, [engine, authState.user, uid]);

	useEffect(() => {
		if (uid) {
			void connect();
		} else {
			engine.destroy();
			setSyncStatus("disconnected");
		}
	}, [uid, connect, engine]);

	useEffect(() => {
		dispatchAuth({ type: "SET_CONNECTED", payload: engine.connected });
		dispatchAuth({ type: "SET_SYNC_STATUS", payload: syncStatusRef.current });
	}, [dispatchAuth, engine.connected]);

	return (
		<SyncEngineContext.Provider value={engine}>
			<SyncContext.Provider value={{ connect, disconnect }}>
				<SyncFeatures
					excalidrawData={props.excalidrawData}
					groqApiKey={props.groqApiKey}
					onExcalidrawChange={props.onExcalidrawChange}
					onGroqApiKeyChange={props.onGroqApiKeyChange}
				/>
				{props.children}
			</SyncContext.Provider>
		</SyncEngineContext.Provider>
	);
}
