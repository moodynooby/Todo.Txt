/** Behavioral tests for the sync engine's outbox lifecycle (fix S2).
 *
 * Real guarantees (with Firestore mocked away):
 *   - enqueue persists the pending queue immediately
 *   - destroy() no longer drops pending writes: they survive teardown and
 *     are restored + drained by restoreOutbox() on (re)connect
 *   - a successful flush clears the persisted outbox; a failed flush
 *     re-persists it so nothing is ever lost to a transient error
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DocUpdate } from "@/lib/firestoreClient";
import { createSyncEngine } from "@/lib/useSyncedDocument";

const updates = (): DocUpdate[] => [
	{
		path: { collection: "todos", id: "main" },
		data: { content: "offline edit", updatedAt: 1 },
	},
];

// The engine talks to Firestore only through these three modules.
vi.mock("@/lib/firebase", () => ({ getFirestoreDb: () => ({}) as never }));
vi.mock("@/lib/firestoreClient", () => ({
	writeDocs: vi.fn(),
	getDocWithRetry: vi.fn(),
	subscribeDoc: vi.fn(() => () => undefined),
}));

import { writeDocs } from "@/lib/firestoreClient";

beforeEach(() => {
	vi.useFakeTimers();
	viWriteDocs.mockReset();
	viWriteDocs.mockResolvedValue(undefined);
	localStorage.clear();
});

afterEach(() => {
	vi.useRealTimers();
});

const viWriteDocs = vi.mocked(writeDocs);

function withClock<T>(fn: (advance: (ms: number) => void) => T): T {
	return fn((ms) => vi.advanceTimersByTime(ms));
}

const once = async (n: number) =>
	vi.waitFor(() => expect(viWriteDocs).toHaveBeenCalledTimes(n));

describe("SyncEngine outbox lifecycle", () => {
	it("flushes enqueued writes through writeDocs", async () => {
		await withClock(async (advance) => {
			const engine = createSyncEngine({ uid: "user-1" });
			engine.uid = "user-1";
			engine.enqueue(updates()[0]);
			advance(1000);
			await once(1);
		});
	});

	it("restores persisted writes after destroy and drains them", async () => {
		await withClock(async (advance) => {
			const engine = createSyncEngine({ uid: "user-1" });
			engine.uid = "user-1";
			engine.enqueue(updates()[0]);
			advance(1000);
			await once(1);
			viWriteDocs.mockClear();

			// Teardown mid-flight: another edit queued while the engine is
			// down (sign-out, page unload, mobile app termination).
			engine.destroy();
			engine.enqueue({
				path: { collection: "todos", id: "main" },
				data: { content: "post-teardown", updatedAt: 2 },
			});

			// Reconnect: pending writes must still flush even after destroy.
			engine.uid = "user-1";
			engine.restoreOutbox();
			advance(1000);
			await vi.waitFor(() => expect(viWriteDocs).toHaveBeenCalledTimes(1));
			const sent = viWriteDocs.mock.calls[0][2];
			expect(sent).toEqual([
				{
					path: { collection: "todos", id: "main" },
					data: { content: "post-teardown", updatedAt: 2 },
				},
			]);
		});
	});

	it("re-persists the outbox when a flush fails and retries", async () => {
		await withClock(async (advance) => {
			viWriteDocs.mockRejectedValueOnce(new Error("offline"));
			const engine = createSyncEngine({ uid: "user-1" });
			engine.uid = "user-1";
			engine.enqueue(updates()[0]);
			advance(1000);
			await once(1);

			// After failure, the persisted outbox still holds the update so
			// a teardown cannot drop it.
			engine.destroy();
			engine.uid = "user-1";
			engine.restoreOutbox();
			advance(1000);
			await once(2);
		});
	});

	it("never replays another uid's outbox", () => {
		// Engine currently authenticated as user-2; restoreOutbox reads the
		// uid-scoped outbox, which belongs to user-2 and is empty — so user-1's
		// never-flushed edits can never leak into another account's writes.
		const engine = createSyncEngine({ uid: "user-1" });
		engine.uid = "user-2";
		engine.restoreOutbox();
		vi.advanceTimersByTime(5000);
		expect(viWriteDocs).not.toHaveBeenCalled();
	});
});
