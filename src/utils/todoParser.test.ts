import { describe, expect, it } from "vitest";
import { parseTodoContent, parseTodoLine } from "./todoParser";

describe("todo.txt parser — F7 datetime format", () => {
	it("parses `due:YYYY-MM-DDTHH:MM` — the form the comments advertise", () => {
		const task = parseTodoLine("-[ ] Call Mom due:2026-08-16T14:30");
		expect(task.due).toBe("2026-08-16");
		expect(task.dueTime).toBe("14:30");
	});

	it("still parses the `due:today@HH:MM` relative form", () => {
		const task = parseTodoLine("-[ ] Review PR due:today@17:00", 0);
		expect(task.due).toBe("2026-08-16"); // anchored in the frozen "today"
		expect(task.dueTime).toBe("17:00");
	});

	it("drops the deprecated fallback path for invalid due values", () => {
		const task = parseTodoLine("-[ ] Task due:not-a-date");
		expect(task.due).toBeUndefined();
	});
});

describe("todo.txt parser — F8 spec compliance", () => {
	// vi.useFakeTimers isn't needed: parseTodoContent reads the module-level
	// getToday() — so we only assert relative behaviour through parseTodoLine
	// inputs that don't depend on the ambient date.

	it("rejects numeric-leading projects and contexts", () => {
		const task = parseTodoLine("-[ ] lift +2kg for @5min");
		expect(task.projects).toBeUndefined();
		expect(task.contexts).toBeUndefined();
	});

	it("accepts letter-leading projects and contexts", () => {
		const task = parseTodoLine("-[ ] gym +workout @health");
		expect(task.projects).toEqual(["workout"]);
		expect(task.contexts).toEqual(["health"]);
	});

	it("does not parse email tails as contexts (boundary check)", () => {
		const task = parseTodoLine("-[ ] email me@work.com today");
		expect(task.contexts).toBeUndefined();
	});

	it("does not parse glued `text@word` as a context", () => {
		const task = parseTodoLine("-[ ] task@context");
		expect(task.contexts).toBeUndefined();
	});

	it("treats an empty checkbox flag `-[]` as NOT a checkbox", () => {
		const unchecked = parseTodoLine("-[q] odd flag task");
		expect(unchecked.completed).toBe(false);
		// With the strict grammar `-[]` (empty flag) is not a checkbox either.
		const empty = parseTodoLine("-[] empty flag task");
		expect(empty.completed).toBe(false);
	});
});

describe("todo.txt parser — round-trip properties", () => {
	it("is idempotent: parsing twice yields the same tasks", () => {
		const content = [
			"-(A) +project @context one due:2026-08-16T09:00",
			"x completed thing",
			"-[ ] normal item",
			"plain note line",
		].join("\n");
		const first = parseTodoContent(content);
		const second = parseTodoContent(content);
		expect(second.tasks).toEqual(first.tasks);
		expect(second.completedCount).toBe(first.completedCount);
	});

	it("categorizes absolute dates against the ambient date", () => {
		const today = new Date().toISOString().slice(0, 10);
		const content = [
			"-[ ] past due:2020-01-01",
			`-[ ] today-ish due:${today}`,
			"-[ ] future due:2030-12-31",
		].join("\n");
		const parsed = parseTodoContent(content);
		expect(parsed.dueDates.overdue).toHaveLength(1);
		// Only `today`/`tomorrow` collapse into named categories; the far
		// future lands in its own date bucket.
		expect(parsed.dueDates.today).toHaveLength(1);
		expect(parsed.dueDates["2030-12-31"]).toHaveLength(1);
	});
});
