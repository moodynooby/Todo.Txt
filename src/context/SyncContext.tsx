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
import {
	HABITS_CODEC,
	NOTES_CODEC,
	normalizeFieldValue,
	SyncFeatures,
	TODO_CODEC,
} from "@/lib/syncAdapters";
import { clearOutbox } from "@/lib/syncOutbox";
import { HABITS_DOC, NOTES_DOC, TODO_DOC } from "@/lib/syncPaths";
import { decideReconcile } from "@/lib/syncReconcile";
import { readTodoBackup, writeTodoBackup } from "@/lib/todoBackup";
import { createSyncEngine, SyncEngineContext } from "@/lib/useSyncedDocument";
import type { BackupData, ExcalidrawData, SyncStatus } from "@/types/sync";

/**
 * SyncProvider — owns the *connection lifecycle only*.
 *
 * Feature syncing (notes, timers, excalidraw, groq) lives in
 * `useSyncedDocument` calls; the wire shapes and normalization rules for
 * every document live in that module's codecs and are reused here verbatim,
 * so a startup-pulled snapshot follows exactly the same rules as a live
 * update. The two legacy special cases (content backup + migration) remain
 * because they are about the auth/migration flow, not about features.
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

// ---------------------------------------------------------------------------
// Connect-time value normalization (regression fixes).
//
// The startup reconciliation used to dispatch whatever Firestore returned
// straight into feature state, bypassing the per-feature adapter rules — raw
// habits missing `completedDates`/`archived` crashed the habits view; a
// non-string todo value could have reached the editor. Reconciliation now
// runs through the SAME codecs as live sync (normalizeFieldValue), so there
// is exactly one set of rules per document.
// ---------------------------------------------------------------------------

/** Decide + apply a reconciliation for one document without blocking the
 *  others. A single document read failure must never hold up the whole
 *  connect flow (regression: sequential `await` reads multiplied network
 *  latency and made one bad read stall the app). */
async function reconcileDocument(
	uid: string,
	path: import("@/lib/firestoreClient").UserDocPath,
	opts: {
		valueKey: string;
		seed: import("@/lib/syncReconcile").ReconcileSeed | null;
		onPush: (value: unknown) => void;
		onPull: (
			value: unknown,
			snapshot: import("@/lib/firestoreClient").DocSnapshot<
				Record<string, unknown>
			>,
		) => void;
		onMissingRemote: (backupPresent: boolean) => Promise<void> | void;
		hasLocal: boolean;
	},
): Promise<void> {
	let snap: import("@/lib/firestoreClient").DocSnapshot<
		Record<string, unknown>
	>;
	try {
		snap = await getDocWithRetry(getFirestoreDb(), uid, path);
	} catch (e) {
		console.error(`Connect read failed for ${path.collection}/${path.id}:`, e);
		// No snapshot to reconcile against — fall back to the push-path seed so
		// local offline edits are still re-queued rather than dropped.
		snap = { exists: false, data: undefined, updatedAt: 0 };
	}
	const decision = decideReconcile(snap, {
		valueKey: opts.valueKey,
		seed: opts.seed,
	});
	if (decision.action === "push") {
		opts.onPush(decision.value);
	} else if (decision.action === "pull") {
		opts.onPull(decision.value, snap);
	} else if (!snap.exists && opts.hasLocal && opts.onMissingRemote) {
		await opts.onMissingRemote(opts.hasLocal);
	}
}

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
			//
			//    Fix (regression): the three reads used to run sequentially,
			//    each wrapped in retry backoff — on slow or flaky networks
			//    connect stalled for tens of seconds. They now run in
			//    parallel, and a failure on one document cannot block the
			//    others or leave the app stuck in "connecting".
			const localBackup = readBackup();
			const notesSeed = readNotesBackupWithTs();
			const habitsSeed = readHabitsBackupWithTs();
			await Promise.all([
				reconcileDocument(uid, TODO_DOC, {
					valueKey: TODO_CODEC.valueKey,
					hasLocal: Boolean(localBackup),
					seed: localBackup
						? {
								localSeed: {
									value: localBackup.content,
									updatedAt: localBackup.updatedAt,
								},
							}
						: null,
					onPush: (value) => {
						const content = normalizeFieldValue(TODO_CODEC, value);
						if (content === undefined) return;
						dispatchTodo({
							type: "SET_CONTENT",
							payload: { content, timestamp: Date.now() },
						});
						engine.enqueue({
							path: TODO_DOC,
							data: { ...TODO_CODEC.encode(content), updatedAt: Date.now() },
						});
					},
					onPull: (value, snap) => {
						const content = normalizeFieldValue(TODO_CODEC, value);
						if (content === undefined) return;
						dispatchTodo({
							type: "SET_CONTENT",
							payload: { content, timestamp: Date.now() },
						});
						writeTodoBackup(content, snap.updatedAt);
					},
					onMissingRemote: () => {
						if (
							localBackup &&
							localStorage.getItem(`${MIGRATED_KEY}_${uid}`) !== "true"
						) {
							return performMigration(engine, uid);
						}
					},
				}),
				reconcileDocument(uid, NOTES_DOC, {
					valueKey: NOTES_CODEC.valueKey,
					hasLocal: Boolean(notesSeed),
					seed: notesSeed
						? {
								localSeed: {
									value: notesSeed.notes,
									updatedAt: notesSeed.updatedAt,
								},
							}
						: null,
					onPush: (value) => {
						const notes = normalizeFieldValue(NOTES_CODEC, value);
						if (notes === undefined) return;
						dispatchNotes({ type: "SET_NOTES", payload: notes });
						engine.enqueue({
							path: NOTES_DOC,
							data: { ...NOTES_CODEC.encode(notes), updatedAt: Date.now() },
						});
					},
					onPull: (value) => {
						const notes = normalizeFieldValue(NOTES_CODEC, value);
						if (notes === undefined) return;
						dispatchNotes({ type: "SET_NOTES", payload: notes });
					},
					onMissingRemote: () => undefined,
				}),
				reconcileDocument(uid, HABITS_DOC, {
					valueKey: HABITS_CODEC.valueKey,
					hasLocal: Boolean(habitsSeed),
					seed: habitsSeed
						? {
								localSeed: {
									value: habitsSeed.data,
									updatedAt: habitsSeed.updatedAt,
								},
							}
						: null,
					onPush: (value) => {
						const habits = normalizeFieldValue(HABITS_CODEC, value);
						if (habits === undefined) return;
						dispatchHabits({ type: "SET_HABITS", payload: habits });
						engine.enqueue({
							path: HABITS_DOC,
							data: { ...HABITS_CODEC.encode(habits), updatedAt: Date.now() },
						});
					},
					onPull: (value) => {
						const habits = normalizeFieldValue(HABITS_CODEC, value);
						if (habits === undefined) return;
						dispatchHabits({ type: "SET_HABITS", payload: habits });
					},
					onMissingRemote: () => undefined,
				}),
			]);

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
