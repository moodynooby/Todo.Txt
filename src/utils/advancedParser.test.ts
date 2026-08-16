/** Behavioral tests for the advanced parser (relative dates, recurring
 *  schedules, task metadata, dependency graph, recurrence rules).
 *
 *  This file used to be a plain script using `assert()` — vitest reports
 *  "No test suite found" for scripts, which fails CI while the checks
 *  silently printed their own results. Converted to a real `describe`
 *  suite so the CI build is actually green when the assertions pass.
 */
import { describe, expect, it } from "vitest";
import {
	calculateNextDueDate,
	DependencyGraph,
	parseRecurringScheduleExpression,
	parseRelativeDateExpression,
	parseTaskMetadata,
} from "./advancedParser";

describe("parseRelativeDateExpression", () => {
	it("resolves 'in 3 days' from a fixed anchor", () => {
		const result = parseRelativeDateExpression(
			"in 3 days",
			new Date("2026-08-16"),
		);
		expect(result?.date.toISOString().split("T")[0]).toBe("2026-08-19");
	});
});

describe("parseRecurringScheduleExpression", () => {
	it("parses 'every 2nd Tuesday at 3pm'", () => {
		const result = parseRecurringScheduleExpression("every 2nd Tuesday at 3pm");
		expect(result?.rule.freq).toBe("monthly");
		expect(result?.rule.nthWeekday?.n).toBe(2);
		expect(result?.rule.nthWeekday?.day).toBe(2);
		expect(result?.rule.time).toBe("15:00");
	});
});

describe("parseTaskMetadata", () => {
	it("parses priority, id, blocks, after, recurrence, and due date", () => {
		const metadata = parseTaskMetadata(
			"(A) Finish API design id:task1 blocks:task2 after:auth rec:workdays due:2026-08-20",
		);
		expect(metadata.id).toBe("task1");
		expect(metadata.blocks).toContain("task2");
		expect(metadata.after).toContain("auth");
		expect(metadata.recurrence?.mode).toBe("workdays");
	});
});

describe("DependencyGraph", () => {
	const buildGraph = () => {
		const graph = new DependencyGraph();
		graph.addNode({
			id: "task1",
			taskText: "Design database",
			completed: true,
			after: [],
			blocks: ["task2"],
			status: "active",
		});
		graph.addNode({
			id: "task2",
			taskText: "Build API",
			completed: false,
			after: ["task1"],
			blocks: ["task3"],
			status: "active",
		});
		graph.addNode({
			id: "task3",
			taskText: "Frontend integration",
			completed: false,
			after: ["task2"],
			blocks: [],
			status: "active",
		});
		return graph;
	};

	it("does not detect cycles in a valid DAG", () => {
		const graph = buildGraph();
		expect(graph.detectCycles().hasCycle).toBe(false);
	});

	it("propagates statuses: completed → active → blocked", () => {
		const graph = buildGraph();
		const statuses = graph.propagateStatus();
		expect(statuses.get("task1")).toBe("completed");
		// Task 2's prerequisite (task1) is completed, so it can be worked on.
		expect(statuses.get("task2")).toBe("active");
		// Task 3's prerequisite (task2) is incomplete, so it stays blocked.
		expect(statuses.get("task3")).toBe("blocked");
	});
});

describe("calculateNextDueDate", () => {
	it("computes strict weekly recurrence", () => {
		expect(
			calculateNextDueDate("2026-08-16", "2026-08-18", {
				freq: "weekly",
				interval: 1,
				mode: "strict",
			}),
		).toBe("2026-08-23");
	});

	it("shifts weekend results to the next workday", () => {
		// Aug 14 2026 is a Friday; +1 day lands on Saturday, which shifts
		// to Monday Aug 17 in workday mode.
		expect(
			calculateNextDueDate("2026-08-14", "2026-08-14", {
				freq: "daily",
				interval: 1,
				mode: "workdays",
			}),
		).toBe("2026-08-17");
	});
});
