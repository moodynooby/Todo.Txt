import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
} from "react";
import { getFirestoreDbAsync } from "@/lib/firebase";
import {
	type DocUpdate,
	getDocWithRetry,
	subscribeDoc,
	type UserDocPath,
	writeDocs,
} from "@/lib/firestoreClient";
import { clearOutbox, readOutbox, writeOutbox } from "@/lib/syncOutbox";

/**
 * Reusable sync primitive — the only sync API features should ever use.
 *
 * One call to `useSyncedDocument` gives a feature the complete lifecycle:
 *   - a JSON localStorage backup under its own key (instant offline startup)
 *   - debounced cloud saves, batched atomically with every other feature
 *   - version-aware live updates from other devices (older snapshots ignored)
 *   - automatic retries with backoff on connect/write failures
 *
 * Features never import Firestore, build doc paths, or touch queues. Adding
 * a feature (notes, timers, habits, ...) is a single hook call with a few
 * plain functions — no copy-paste of sync machinery means no way to drift.
 */

/** Anything that can live in a Firestore document field map. */
export type AnyRecord = Record<string, unknown>;

export interface SyncedDocumentOptions<T> {
	/** Firestore location, e.g. NOTES_DOC (`notes/main`). */
	path: UserDocPath;
	/** The feature's current local value (state). */
	value: T;
	/** Replace local state with a newer remote value. */
	applyRemote: (value: T) => void;
	/** If set, the value is also mirrored to localStorage[key] as JSON
	 *  `{ data, updatedAt }` on every change — instant startup + offline. */
	localKey?: string;
	/** Optional custom mirror writer for the local backup. When provided it
	 *  receives the fresh value on every change instead of (in addition to)
	 *  the default `localKey` JSON mirror. Fixes the class of bug where a
	 *  feature defines a backup writer that nobody ever calls (e.g. notes,
	 *  habits, todo).
	 *
	 *  Fix S3: the mirror also receives the server timestamp of the snapshot
	 *  that produced the value (undefined for locally-originated writes), so
	 *  the offline seed compares server clocks against the cloud at connect
	 *  time instead of an unsynced local clock. */
	mirror?: (value: T, syncedAt?: number) => void;
	/** Encode local value into Firestore fields. Default: `{ value }`. */
	encode?: (value: T) => AnyRecord;
	/** Decode Firestore fields into the local value, or undefined to skip.
	 *  Default reads the `value` field as `T`. */
	decode?: (record: AnyRecord) => T | undefined;
	/** Mutate the value right before it is written to the cloud. Use this to
	 *  exclude per-device runtime state (e.g. drop running timers). */
	beforeWrite?: (value: T) => T;
	/** Normalize a value arriving from the cloud before applying it locally
	 *  (e.g. force-reset timers received from another device to idle). */
	afterRead?: (value: T) => T;
}

// ---------------------------------------------------------------------------
// Shared engine — mounted exactly once by SyncProvider.
// ---------------------------------------------------------------------------

export interface SyncEngine {
	/** Enqueue a field-map merge for a document. Batches with all others. */
	enqueue: (update: DocUpdate) => void;
	/** Subscribe to live updates for one document. `updatedAt` carries the
	 *  server timestamp of the snapshot (needed to keep offline seeds
	 *  server-relative). */
	subscribe: (
		path: UserDocPath,
		onNewer: (data: AnyRecord, updatedAt?: number) => void,
	) => void;
	/** Read a document once with retry (for startup conflict resolution). */
	readOnce: (path: UserDocPath) => Promise<{
		exists: boolean;
		data: AnyRecord | undefined;
		updatedAt: number;
	}>;
	/** uid of the currently authenticated user, or null. May be reassigned
	 *  by the provider when the authenticated user changes. */
	uid: string | null;
	/** True while a Firestore connection is live. */
	connected: boolean;
	/** Status of the last remote operation. */
	status: "synced" | "syncing" | "error" | "disconnected";
}

export const SyncEngineContext = createContext<SyncEngine | null>(null);

/** Access the shared engine from within the SyncProvider tree. */
export function useSyncEngine(): SyncEngine {
	const engine = useContext(SyncEngineContext);
	if (!engine) {
		throw new Error("useSyncEngine must be used within SyncProvider");
	}
	return engine;
}

// ---------------------------------------------------------------------------
// The feature-facing primitive.
// ---------------------------------------------------------------------------

/**
 * The whole public API for syncing a feature. Example (notes):
 *
 *   useSyncedDocument({
 *     path: NOTES_DOC,
 *     value: notesState.notes,
 *     applyRemote: (notes) => dispatchNotes({ type: "SET_NOTES", payload: notes }),
 *     localKey: "notes_backup",
 *     decode: (r) => (Array.isArray(r.value) ? (r.value as Note[]) : undefined),
 *     afterRead: (notes) => notes.map((n) => ({ ...n, archived: !!n.archived })),
 *   });
 *
 * That is the entire feature-side integration: backup, sync, retries, and
 * live updates come along for free, and cannot be implemented wrongly
 * because the implementation lives in exactly one place.
 */
export function useSyncedDocument<T>(opts: SyncedDocumentOptions<T>): void {
	const engine = useSyncEngine();

	const optsRef = useRef(opts);
	optsRef.current = opts;

	const writeValue = useMemo(() => {
		const { value, beforeWrite } = opts;
		return beforeWrite ? beforeWrite(value) : value;
	}, [opts, opts.value]);

	// 1. Local backup (offline-first, instant startup).
	useEffect(() => {
		const { localKey, mirror } = optsRef.current;
		if (mirror) {
			try {
				mirror(opts.value);
			} catch {
				// Mirror writes are best-effort; the cloud remains authoritative.
			}
		} else if (localKey) {
			try {
				localStorage.setItem(
					localKey,
					JSON.stringify({ data: opts.value, updatedAt: Date.now() }),
				);
			} catch {
				// Storage full / blocked — keep going, cloud is the source of truth.
			}
		}
	}, [opts.value]);

	// 2. Cloud write: debounced automatically by the engine's queue; here we
	//    just announce the intent whenever the prepared value changes. The
	//    server-timestamp sentinel is injected at flush time (processQueue),
	//    because producing it requires the lazily-loaded Firestore SDK.
	const enqueue = useStableCall((update: DocUpdate) => engine.enqueue(update));
	useEffect(() => {
		const { path, encode } = optsRef.current;
		// Encode the beforeWrite-normalized value so per-device runtime state
		// (e.g. running timers) never reaches Firestore.
		const data = encode ? encode(writeValue) : { value: writeValue };
		enqueue({ path, data });
		// We intentionally depend on the ref-stable options so a changed
		// encode/decode never triggers a redundant write.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [writeValue, enqueue]);

	// 3. Live remote updates (version-aware: engine drops older snapshots).
	const apply = useCallback((data: AnyRecord) => {
		const { decode, afterRead, applyRemote } = optsRef.current;
		const decoded = decode ? decode(data) : (data.value as T | undefined);
		if (decoded === undefined) return;
		applyRemote(afterRead ? afterRead(decoded) : decoded);
	}, []);

	// 3b. Keep the offline mirror's clock server-relative. The snapshot that
	//     produced a local value carries the server `updatedAt`; locally
	//     originated writes have none, and the mirror clock stays at the last
	//     known server timestamp (never a fresh wall clock) so startup
	//     reconciliation keeps comparing server time on both sides.
	const mirrorSynced = useCallback((syncedAt?: number) => {
		const { mirror } = optsRef.current;
		if (!mirror) return;
		try {
			mirror(optsRef.current.value, syncedAt);
		} catch {
			// Mirror writes are best-effort; the cloud remains authoritative.
		}
	}, []);
	const applyWithMirror = useCallback(
		(data: AnyRecord, updatedAt?: number) => {
			apply(data);
			// Mirror the received snapshot with its server timestamp.
			if (typeof updatedAt === "number" && updatedAt > 0) {
				mirrorSynced(updatedAt);
			}
		},
		[apply, mirrorSynced],
	);
	useEffect(
		() => engine.subscribe(opts.path, applyWithMirror),
		[engine, opts.path, applyWithMirror],
	);
}

/** Wraps a plain function so a stable ref is returned; the latest closure is
 *  always invoked — this is what lets feature effects never capture stale
 *  callbacks (the classic source of sync bugs in the old code). */
function useStableCall<F extends (...args: never[]) => void>(fn: F): F {
	const fnRef = useRef(fn);
	fnRef.current = fn;
	// Reuse a single stable function across renders.
	return useMemo(() => {
		const stable = (...args: never[]) => fnRef.current(...args);
		return stable as F;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
}

// ---------------------------------------------------------------------------
// Engine internals — owned by SyncProvider (see SyncContext.tsx).
// ---------------------------------------------------------------------------

const WRITE_DEBOUNCE_MS = 1000;
const RETRY_BASE_MS = 500;
const RETRY_MAX_MS = 30000;
const documentKey = (path: UserDocPath): string =>
	`${path.collection}/${path.id}`;

export interface UseSyncEngineOptions {
	uid: string | null;
}

/** Mount the shared sync engine. Handles connection lifecycle, retries, the
 *  single batched write queue, and per-document subscriptions. */
export function createSyncEngine(opts: UseSyncEngineOptions): SyncEngineImpl {
	return new SyncEngineImpl(opts);
}

class SyncEngineImpl implements SyncEngine {
	private unsubscribes = new Map<string, () => void>();
	private subscriptions = new Map<
		string,
		{
			path: UserDocPath;
			onNewer: (data: AnyRecord, updatedAt?: number) => void;
		}
	>();
	private queue: DocUpdate[] = [];
	private processing = false;
	private retryTimer: ReturnType<typeof setTimeout> | null = null;
	private writeTimer: ReturnType<typeof setTimeout> | null = null;
	private retryCount = 0;
	/** True once the persisted outbox for the current uid has been restored; the
	 *  first flush after (re)connect drains any writes that survived a previous
	 *  teardown (sign-out, page unload, mobile app termination). */
	private outboxRestored = false;

	/** @see SyncEngine.uid */
	uid: string | null;

	connected = false;
	status: SyncEngine["status"] = "disconnected";

	onStatusChange?: () => void;

	constructor(opts: UseSyncEngineOptions) {
		this.uid = opts.uid;
	}

	enqueue = (update: DocUpdate): void => {
		// Merge with a pending update for the same document so we never flood
		// the batch with redundant merges.
		const key = documentKey(update.path);
		const existing = this.queue.findIndex((u) => documentKey(u.path) === key);
		if (existing >= 0) {
			this.queue[existing] = {
				path: update.path,
				data: { ...this.queue[existing].data, ...update.data },
			};
		} else {
			this.queue.push(update);
		}

		// Persist immediately so a sign-out, page unload, or app kill can never
		// drop in-flight edits — they flush as soon as the engine can write.
		this.persistQueue();

		if (this.writeTimer) clearTimeout(this.writeTimer);
		this.writeTimer = setTimeout(() => {
			this.writeTimer = null;
			void this.processQueue();
		}, WRITE_DEBOUNCE_MS);
	};

	subscribe = (
		path: UserDocPath,
		onNewer: (data: AnyRecord, updatedAt?: number) => void,
	): void => {
		const key = `${path.collection}/${path.id}`;
		this.subscriptions.set(key, { path, onNewer });
		const existing = this.unsubscribes.get(key);
		if (existing) existing();

		const uid = this.uid;
		if (!uid) return; // Resubscribed automatically when `connect` runs.

		// The Firestore SDK (and db instance) resolve asynchronously; proxy the
		// unsubscribe handle so callers can cancel before it even connects.
		let active = true;
		let unsub: (() => void) | null = null;
		void (async () => {
			const db = await getFirestoreDbAsync();
			if (!active) return;
			unsub = subscribeDoc(
				db,
				uid,
				path,
				(data, updatedAt) => {
					// `applyWithMirror` (the registration side) expects the server
					// timestamp as its second argument — forwarding it is what keeps
					// offline mirror seeds server-relative after live updates.
					onNewer(data as AnyRecord, updatedAt);
					this.markHealthy("synced");
				},
				0,
				(err) => {
					console.error("Firestore snapshot error:", err);
					this.markUnhealthy("error");
					this.retry(() => this.subscribe(path, onNewer));
				},
			);
			if (active) this.unsubscribes.set(key, unsub);
		})();
		this.unsubscribes.set(key, () => {
			active = false;
			unsub?.();
		});
	};

	readOnce = async (path: UserDocPath) => {
		const uid = this.uid;
		if (!uid) {
			return { exists: false, data: undefined, updatedAt: 0 };
		}
		return getDocWithRetry<AnyRecord>(await getFirestoreDbAsync(), uid, path);
	};

	/** Restore any writes that survived a previous teardown (sign-out, page
	 *  unload, app kill) so the first flush after (re)connect drains them too. */
	restoreOutbox(): void {
		const uid = this.uid;
		if (!uid || this.outboxRestored) return;
		this.outboxRestored = true;
		for (const update of readOutbox(uid)) {
			// The in-memory queue (written after the last persistence) is the
			// superset — never demote a live value to a persisted snapshot.
			if (
				this.queue.some((u) => documentKey(u.path) === documentKey(update.path))
			)
				continue;
			this.queue.push(update);
		}
		if (this.queue.length > 0) {
			if (this.writeTimer) clearTimeout(this.writeTimer);
			this.writeTimer = setTimeout(() => {
				this.writeTimer = null;
				void this.processQueue();
			}, WRITE_DEBOUNCE_MS);
		}
	}

	/** Tear down everything (sign-out / unmount). */
	destroy(): void {
		for (const stop of this.unsubscribes.values()) stop();
		this.unsubscribes.clear();
		this.subscriptions.clear();
		if (this.writeTimer) clearTimeout(this.writeTimer);
		if (this.retryTimer) clearTimeout(this.retryTimer);
		this.connected = false;
		this.status = "disconnected";
		// Persist instead of dropping pending writes: the next (re)connect
		// restores them via restoreOutbox(). On sign-out the uid flips before
		// destroy() is called, and clearOutbox is called there so a different
		// account can never replay this queue.
		this.persistQueue();
		this.outboxRestored = false;
	}

	/** Subscribe every registered path (called by the provider at connect
	 *  time and by retry logic). */
	subscribeAll(): void {
		for (const { path, onNewer } of this.subscriptions.values()) {
			this.subscribe(path, onNewer);
		}
	}

	// ------------------------------------------------------------------
	// Private helpers.
	// ------------------------------------------------------------------

	private async processQueue(): Promise<void> {
		if (this.queue.length === 0 || this.processing) return;
		if (!this.uid) {
			// Not authenticated yet — buffered writes flush once connect runs.
			return;
		}

		this.processing = true;
		const queued = [...this.queue];
		this.queue = [];
		// Optimistically clear the persisted outbox; a successful write is the
		// only path that removes it for good — failure re-persists below.
		this.clearPersistedQueue();

		this.markUnhealthy("syncing");

		try {
			// Inject the server-timestamp sentinel here rather than at enqueue
			// time — producing it requires the lazily-loaded Firestore SDK.
			// Entries that already carry an updatedAt (e.g. restored outbox
			// writes) are forwarded untouched.
			const { serverTimestamp } = await import("firebase/firestore");
			const batch = queued.map((u) => ({
				path: u.path,
				data:
					"updatedAt" in u.data
						? u.data
						: { ...u.data, updatedAt: serverTimestamp() },
			}));
			await writeDocs(await getFirestoreDbAsync(), this.uid, batch);
			this.markHealthy("synced");
		} catch (e) {
			console.error("Firestore write error:", e);
			this.markUnhealthy("error");
			// Re-queue unsaved updates and retry with backoff (capped by
			// RETRY_MAX_MS; cleared on the next successful write).
			this.queue = queued.concat(this.queue);
			this.persistQueue();
			this.retry(() => void this.processQueue());
		} finally {
			this.processing = false;
		}
	}

	private retry(fn: () => void): void {
		if (this.retryTimer) clearTimeout(this.retryTimer);
		const delay = Math.min(RETRY_BASE_MS * 2 ** this.retryCount, RETRY_MAX_MS);
		this.retryCount++;
		this.retryTimer = setTimeout(fn, delay);
	}

	/** Persist the pending queue for the current uid (best-effort localStorage). */
	private persistQueue(): void {
		const uid = this.uid;
		if (!uid) return;
		writeOutbox(uid, this.queue);
	}

	/** Clear the persisted queue for the current uid. */
	private clearPersistedQueue(): void {
		const uid = this.uid;
		if (!uid) return;
		clearOutbox(uid);
	}

	private markHealthy(status: SyncEngine["status"]): void {
		this.connected = true;
		this.status = status;
		this.retryCount = 0;
		this.onStatusChange?.();
	}

	private markUnhealthy(status: SyncEngine["status"]): void {
		this.status = status;
		this.onStatusChange?.();
	}
}
