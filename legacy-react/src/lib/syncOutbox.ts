/** Field Notes Ritual: durable write outbox for the sync engine.
 *
 * Previously every pending write lived only in memory (`SyncEngineImpl.queue`):
 * a sign-out, page unload, or mobile app termination while the write timer
 * was pending silently dropped those edits until the user typed again. This
 * module persists the pending document merges to localStorage (the same
 * best-effort tier the todo backup already uses) so they survive teardown and
 * flush the moment the engine is ready to write again.
 *
 * Shape on disk: `{ v: 1, updates: [{ collection, id, data }] }` keyed per
 * authenticated uid, so logging in as a different user can never replay
 * another account's pending writes.
 */
import type { DocUpdate, UserDocPath } from "@/lib/firestoreClient";

export const OUTBOX_KEY = (uid: string): string => `sync_outbox_${uid}`;

export interface OutboxRecord {
	v: 1;
	updates: Array<{
		collection: string;
		id: string;
		data: Record<string, unknown>;
	}>;
}

/** Load pending writes for a user; unknown shape degrades to empty rather
 *  than replaying garbage. */
export function readOutbox(uid: string): DocUpdate[] {
	try {
		const raw = localStorage.getItem(OUTBOX_KEY(uid));
		if (!raw) return [];
		const parsed = JSON.parse(raw) as Partial<OutboxRecord> | null;
		if (!parsed || parsed.v !== 1 || !Array.isArray(parsed.updates)) return [];
		return parsed.updates
			.map((u) => {
				if (
					!u ||
					typeof u.collection !== "string" ||
					typeof u.id !== "string" ||
					!u.data ||
					typeof u.data !== "object"
				) {
					return null;
				}
				return {
					path: { collection: u.collection, id: u.id } as UserDocPath,
					data: u.data as Record<string, unknown>,
				};
			})
			.filter((u): u is DocUpdate => u !== null);
	} catch {
		return [];
	}
}

/** Replace the persisted outbox for a user. */
export function writeOutbox(uid: string, updates: DocUpdate[]): void {
	const record: OutboxRecord = {
		v: 1,
		updates: updates.map((u) => ({
			collection: u.path.collection,
			id: u.path.id,
			data: u.data,
		})),
	};
	try {
		localStorage.setItem(OUTBOX_KEY(uid), JSON.stringify(record));
	} catch {
		// Quota full / blocked — pending writes keep going over the network;
		// the only loss is persistence, matching the pre-outbox behavior.
	}
}

/** Drop this user's outbox (sign-out / migration / testing). */
export function clearOutbox(uid: string): void {
	try {
		localStorage.removeItem(OUTBOX_KEY(uid));
	} catch {
		// Best-effort; a leftover entry can never be replayed under another uid.
	}
}
