import type {
	DocumentData,
	Firestore,
	Timestamp,
	Unsubscribe,
} from "firebase/firestore";

/**
 * Minimal typed client around Firestore user documents.
 *
 * Purpose:
 * - Centralizes path construction (`users/{uid}/{collection}/{id}`) so every
 *   feature (todos, excalidraw, settings, habits, ...) builds doc references
 *   the same way.
 * - Wraps reads/writes in a strongly-typed `get` / `set` / `subscribe`
 *   surface, so callers never touch raw `doc(db, ...)` strings directly.
 * - Adds a small retry layer on the initial read, mirroring the previous
 *   behavior that lived inside SyncContext.
 *
 * The Firestore SDK itself is imported lazily (see firebase.ts): only these
 * function bodies touch it, and they all run long after first paint.
 */

type FirestoreModule = typeof import("firebase/firestore");
let fsModulePromise: Promise<FirestoreModule> | null = null;
const loadFirestore = (): Promise<FirestoreModule> =>
	(fsModulePromise ??= import("firebase/firestore"));

export const RETRY_BASE_MS = 500;
export const RETRY_MAX_MS = 30000;
export const USER_COLLECTION_ROOT = "users";

export interface UserDocPath {
	/** Sub-collection under the user, e.g. "todos", "habits" */
	collection: string;
	/** Document id inside the collection, e.g. "main", "groq" */
	id: string;
}

export interface DocSnapshot<T> {
	exists: boolean;
	data: T | undefined;
	updatedAt: number;
}

const userDocRef = async (db: Firestore, uid: string, path: UserDocPath) => {
	const { doc } = await loadFirestore();
	return doc(db, USER_COLLECTION_ROOT, uid, path.collection, path.id);
};

async function backoff(
	fn: () => Promise<unknown>,
	maxAttempts = 6,
): Promise<void> {
	let attempt = 0;
	while (true) {
		try {
			await fn();
			return;
		} catch (error) {
			attempt++;
			if (attempt >= maxAttempts) throw error;
			const delay = Math.min(RETRY_BASE_MS * 2 ** (attempt - 1), RETRY_MAX_MS);
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}
}

/**
 * Reads the latest document snapshot (or an empty placeholder) with retry.
 */
export async function getDocWithRetry<T extends DocumentData>(
	db: Firestore,
	uid: string,
	path: UserDocPath,
): Promise<DocSnapshot<T>> {
	let snapshot: DocSnapshot<T> = {
		exists: false,
		data: undefined,
		updatedAt: 0,
	};
	await backoff(async () => {
		const { getDoc } = await loadFirestore();
		const snap = await getDoc(await userDocRef(db, uid, path));
		if (snap.exists()) {
			const data = snap.data() as T & { updatedAt?: Timestamp | number };
			const updatedAt =
				(data.updatedAt as Timestamp)?.toMillis?.() ??
				(typeof data.updatedAt === "number" ? data.updatedAt : 0);
			snapshot = { exists: true, data: data as T, updatedAt };
		}
	});
	return snapshot;
}

/**
 * Watches a single user document. `onUpdate` fires only for newer versions
 * than `initialLastSeen` (same contract the previous inline snapshot used).
 */
export function subscribeDoc<T extends DocumentData>(
	db: Firestore,
	uid: string,
	path: UserDocPath,
	onUpdate: (data: T, updatedAt: number) => void,
	initialLastSeen: number,
	onError?: (error: unknown) => void,
): Unsubscribe {
	let lastSeen = initialLastSeen;
	// The SDK loads asynchronously, but callers hold the returned function as
	// the unsubscribe handle — proxy it so the signature stays synchronous.
	let active = true;
	let unsub: Unsubscribe | null = null;
	void loadFirestore().then(async ({ onSnapshot }) => {
		if (!active) return;
		unsub = onSnapshot(
			await userDocRef(db, uid, path),
			(snap) => {
				if (!snap.exists()) return;
				if (snap.metadata.hasPendingWrites) return;
				const data = snap.data() as T & { updatedAt?: Timestamp | number };
				const updatedAt =
					(data.updatedAt as Timestamp)?.toMillis?.() ??
					(typeof data.updatedAt === "number" ? data.updatedAt : 0);
				if (updatedAt <= lastSeen) return;
				lastSeen = updatedAt;
				onUpdate(data as T, updatedAt);
			},
			(err) => {
				onError?.(err);
			},
		);
	});
	return () => {
		active = false;
		unsub?.();
	};
}

/**
 * Batch-writes arbitrary user documents. Pass field maps to merge into each
 * document. Useful when one feature needs to persist several documents in a
 * single atomic round trip (e.g. habits + todo content together later on).
 */
export interface DocUpdate {
	path: UserDocPath;
	data: Record<string, unknown>;
}

export async function writeDocs(
	db: Firestore,
	uid: string,
	updates: Array<DocUpdate>,
): Promise<void> {
	const { writeBatch } = await loadFirestore();
	const batch = writeBatch(db);
	for (const { path, data } of updates) {
		batch.set(await userDocRef(db, uid, path), data, { merge: true });
	}
	return batch.commit();
}

/**
 * Reads many user documents in one request. Good for a future habits page:
 * one round trip instead of N.
 */
export async function getDocsForCollection<T extends DocumentData>(
	db: Firestore,
	uid: string,
	collectionName: string,
): Promise<Array<{ id: string; data: T; updatedAt: number }>> {
	const { collection, getDocs } = await loadFirestore();
	const snap = await getDocs(
		collection(db, USER_COLLECTION_ROOT, uid, collectionName),
	);
	return snap.docs
		.filter((d) => !d.metadata.hasPendingWrites)
		.map((d) => {
			const data = d.data() as T & { updatedAt?: Timestamp | number };
			const updatedAt =
				(data.updatedAt as Timestamp)?.toMillis?.() ??
				(typeof data.updatedAt === "number" ? data.updatedAt : 0);
			return { id: d.id, data: data as T, updatedAt };
		});
}
