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
import { getDocWithRetry } from "@/lib/firestoreClient";
import { SyncFeatures } from "@/lib/syncAdapters";
import { TODO_DOC } from "@/lib/syncPaths";
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
			// 1. Read the canonical todo document once (with retry) to resolve
			//    the local-backup vs. remote conflict that only legacy content
			//    needs.
			const todoSnap = await getDocWithRetry<{ content?: string }>(
				getFirestoreDb(),
				uid,
				TODO_DOC,
			);

			const localBackup = readBackup();
			if (todoSnap.exists && todoSnap.data?.content !== undefined) {
				const remoteContent = todoSnap.data.content;
				const localTs = localBackup?.updatedAt ?? 0;
				// Fix F4: the startup resolver used to replace in-session
				// work with the remote snapshot wholesale, and its
				// local-vs-remote decision mixed a client clock against a
				// server clock (clock skew could make stale data win).
				// Now the comparison is server-clock-only: the remote wins
				// only when the remote's own timestamp beats the local
				// mirror's recorded timestamp, and the local content is
				// re-queued to the engine so it is never silently dropped.
				if (
					localBackup &&
					localBackup.content !== undefined &&
					localBackup.content !== remoteContent &&
					localTs > todoSnap.updatedAt
				) {
					dispatchTodo({
						type: "SET_CONTENT",
						payload: { content: localBackup.content, timestamp: Date.now() },
					});
					// Re-queue the local content so this device's edits
					// become the outgoing write instead of vanishing.
					engine.enqueue({
						path: TODO_DOC,
						data: { content: localBackup.content, updatedAt: Date.now() },
					});
				} else {
					dispatchTodo({
						type: "SET_CONTENT",
						payload: { content: remoteContent, timestamp: Date.now() },
					});
					// Keep the local mirror aligned with the authoritative
					// remote snapshot so the offline seed never goes stale.
					writeTodoBackup(remoteContent, todoSnap.updatedAt);
				}
			} else if (
				localBackup &&
				localStorage.getItem(`${MIGRATED_KEY}_${uid}`) !== "true"
			) {
				await performMigration(engine, uid);
			}

			engine.connected = true;
			setSyncStatus("synced");

			// 2. Start live updates for every registered feature now that the
			//    connection succeeded. Pending writes in the queue flush
			//    automatically (enqueued while unauthenticated).
			engine.subscribeAll();
		} catch (e) {
			console.error("Firestore connect error:", e);
			setSyncStatus("error");
		}
	}, [uid, dispatchTodo, engine]);

	const disconnect = useCallback(async () => {
		engine.destroy();
		setSyncStatus("disconnected");
		if (authState.user) {
			try {
				await signOutUser();
			} catch (e) {
				console.error("Sign out error:", e);
			}
		}
	}, [engine, authState.user]);

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
