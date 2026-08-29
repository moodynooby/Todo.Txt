import { describe, expect, it } from "vitest";
import {
	parseSchedulingPhrase,
	parseTodoContent,
	parseTodoLine,
} from "@/lib/core";

/* Guards the bridge's export-resolution: the Kotlin/JS bundle exposes its
 * API as a nested namespace, and bundler interop quirks previously surfaced
 * as "X is not a function" crashes at runtime (e.g. parseSchedulingPhraseJs). */

describe("@todotxt/core bridge", () => {
	it("parses a whole document", () => {
		const parsed = parseTodoContent(
			"(A) pay rent +home @bank\ndue:2027-01-02 x",
		);
		expect(parsed.tasks).toHaveLength(2);
		expect(parsed.priorities.A).toBeDefined();
	});

	it("parses a single line with tokens", () => {
		const task = parseTodoLine("email bob +proj @ctx due:2026-09-01");
		expect(task.projects).toContain("proj");
		expect(task.contexts).toContain("ctx");
	});

	it("parses a scheduling phrase", () => {
		const result = parseSchedulingPhrase("every 3 days");
		expect(result.kind).toBe("recurrence");
	});
});
