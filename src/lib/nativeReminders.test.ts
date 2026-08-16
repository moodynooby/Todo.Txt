import { describe, expect, it } from "vitest";
import { parseActionPayload, parseActionQueue } from "./nativeReminders";

describe("notification payload contract — F2", () => {
	it("routes habit reminder extras as `mark-done-habit` (not bare `habit`)", () => {
		// Scheduled extras must be recognizable by the action handler — this
		// is the exact mismatch that made the notification buttons dead code.
		const scheduledExtra = {
			kind: "mark-done-habit",
			id: "abc123",
			subject: "habit",
		};
		expect(parseActionPayload(scheduledExtra)?.kind).toBe("mark-done-habit");
	});

	it("routes due-todo extras as `mark-done-todo` (not bare `todo`)", () => {
		const scheduledExtra = {
			kind: "mark-done-todo",
			line: 3,
			subject: "todo",
		};
		expect(parseActionPayload(scheduledExtra)?.kind).toBe("mark-done-todo");
	});

	it("rejects the old bare kinds that made buttons unrouteable", () => {
		expect(parseActionPayload({ kind: "habit", id: "x" })).toBeNull();
		expect(parseActionPayload({ kind: "todo", line: 0 })).toBeNull();
	});

	it("keeps snooze payloads routable so the handler can derive minutes", () => {
		const snooze = parseActionPayload({
			kind: "snooze-habit",
			id: "x",
		} as never);
		expect(snooze?.kind).toBe("snooze-habit");
	});
});

describe("pending-action queue codec — F3", () => {
	it("round-trips a live payload into the persisted queue format", () => {
		const payload = { kind: "mark-done-habit", id: "h1" } as const;
		const queue = JSON.stringify([payload]);
		// `parseActionQueue` is the only reader for the persisted format.
		const drained = parseActionQueue(queue);
		expect(drained).toEqual([payload]);
	});

	it("drains EVERY queued action, not just the first", () => {
		const queue = JSON.stringify([
			{ kind: "mark-done-habit", id: "h1" },
			{ kind: "snooze-todo", date: "2026-08-17" },
			{ kind: "mark-done-todo", line: 2 },
		]);
		expect(parseActionQueue(queue)).toHaveLength(3);
	});

	it("reads a persisted queue string as the last queued action", () => {
		// The persisted value is a JSON **array**. `parseActionPayload` is
		// permissive — a raw queue string yields the *last* entry rather than
		// null — so stale single-entry queues still replay after the F3 fix.
		const arrayString = JSON.stringify([
			{ kind: "mark-done-habit", id: "h1" },
			{ kind: "snooze-todo", date: "2026-08-17" },
		]);
		expect(parseActionPayload(arrayString)?.kind).toBe("snooze-todo");
	});

	it("rejects empty arrays without throwing", () => {
		expect(parseActionPayload("[]")).toBeNull();
	});

	it("tolerates a corrupted queue without throwing", () => {
		expect(parseActionQueue("not-json-at-all")).toEqual([]);
		expect(parseActionPayload("{")).toBeNull();
		expect(parseActionPayload(null)).toBeNull();
	});
});
