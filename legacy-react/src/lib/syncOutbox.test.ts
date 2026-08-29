/** Behavioral tests for the durable write outbox (fix S2).
 *
 * Guarantees:
 *   - pending writes round-trip through localStorage under the right key
 *   - unknown/corrupted shapes degrade to an empty outbox (never replay garbage)
 *   - the outbox is uid-scoped — a different user sees nothing
 *   - clearOutbox removes the entry
 */
import { afterEach, describe, expect, it } from "vitest";
import type { DocUpdate } from "@/lib/firestoreClient";
import {
	clearOutbox,
	OUTBOX_KEY,
	readOutbox,
	writeOutbox,
} from "@/lib/syncOutbox";

afterEach(() => {
	localStorage.clear();
});

describe("syncOutbox", () => {
	it("round-trips pending writes to localStorage", () => {
		const updates: DocUpdate[] = [
			{
				path: { collection: "todos", id: "main" },
				data: { content: "a\nb", updatedAt: 1 },
			},
			{
				path: { collection: "notes", id: "main" },
				data: { value: [], updatedAt: 2 },
			},
		];
		writeOutbox("user-1", updates);
		const restored = readOutbox("user-1");
		expect(restored).toEqual(updates);
		expect(localStorage.getItem(OUTBOX_KEY("user-1"))).not.toBeNull();
	});

	it("replaces the persisted outbox on a later write", () => {
		writeOutbox("user-1", [
			{ path: { collection: "todos", id: "main" }, data: { content: "old" } },
		]);
		writeOutbox("user-1", [
			{ path: { collection: "todos", id: "main" }, data: { content: "new" } },
		]);
		expect(readOutbox("user-1")).toHaveLength(1);
		expect(readOutbox("user-1")[0].data.content).toBe("new");
	});

	it("returns an empty outbox for a different uid", () => {
		writeOutbox("user-1", [
			{
				path: { collection: "todos", id: "main" },
				data: { content: "secret" },
			},
		]);
		expect(readOutbox("user-2")).toEqual([]);
	});

	it("clears the outbox", () => {
		writeOutbox("user-1", [
			{ path: { collection: "todos", id: "main" }, data: { content: "x" } },
		]);
		clearOutbox("user-1");
		expect(readOutbox("user-1")).toEqual([]);
	});

	it("degrades on malformed JSON", () => {
		localStorage.setItem(OUTBOX_KEY("user-1"), "not-json");
		expect(readOutbox("user-1")).toEqual([]);
	});

	it("degrades on a wrong version", () => {
		localStorage.setItem(
			OUTBOX_KEY("user-1"),
			JSON.stringify({ v: 99, updates: [] }),
		);
		expect(readOutbox("user-1")).toEqual([]);
	});

	it("degrades on non-array updates", () => {
		localStorage.setItem(
			OUTBOX_KEY("user-1"),
			JSON.stringify({ v: 1, updates: "oops" }),
		);
		expect(readOutbox("user-1")).toEqual([]);
	});

	it("drops malformed individual entries but keeps good ones", () => {
		localStorage.setItem(
			OUTBOX_KEY("user-1"),
			JSON.stringify({
				v: 1,
				updates: [
					{ collection: "todos", id: "main", data: { content: "good" } },
					"garbage",
					{ collection: 5, id: "main", data: {} },
				],
			}),
		);
		const out = readOutbox("user-1");
		expect(out).toHaveLength(1);
		expect(out[0].data.content).toBe("good");
	});
});
