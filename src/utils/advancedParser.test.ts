import {
	parseRelativeDateExpression,
	parseRecurringScheduleExpression,
	parseTaskMetadata,
	DependencyGraph,
	calculateNextDueDate,
} from "./advancedParser";

console.log("=== Running Advanced Parser & Dependency Tests ===");

// 1. Test Relative Date Parser
const relResult = parseRelativeDateExpression(
	"in 3 days",
	new Date("2026-08-16"),
);
console.log(
	"Relative Date ('in 3 days'):",
	relResult?.date.toISOString().split("T")[0],
);
assert(
	relResult?.date.toISOString().split("T")[0] === "2026-08-19",
	"Relative date calculation failed",
);

// 2. Test Recurring Schedule Parser
const recResult = parseRecurringScheduleExpression("every 2nd Tuesday at 3pm");
console.log(
	"Recurring Schedule ('every 2nd Tuesday at 3pm'):",
	JSON.stringify(recResult?.rule),
);
assert(
	recResult?.rule.freq === "monthly",
	"Recurring frequency should be monthly",
);
assert(recResult?.rule.nthWeekday?.n === 2, "Nth weekday should be 2");
assert(recResult?.rule.nthWeekday?.day === 2, "Weekday should be Tuesday (2)");
assert(recResult?.rule.time === "15:00", "Time should be 15:00");

// 3. Test Task Metadata Parsing with Dependencies and Recurrence
const taskText =
	"(A) Finish API design id:task1 blocks:task2 after:auth rec:workdays due:2026-08-20";
const metadata = parseTaskMetadata(taskText);
console.log("Parsed Metadata:", JSON.stringify(metadata, null, 2));
assert(metadata.id === "task1", "Task ID parsing failed");
assert(metadata.blocks.includes("task2"), "Blocks parsing failed");
assert(metadata.after.includes("auth"), "After parsing failed");
assert(
	metadata.recurrence?.mode === "workdays",
	"Recurrence mode parsing failed",
);

// 4. Test Dependency Graph Cycle Detection & Status Propagation
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

const cycleCheck = graph.detectCycles();
console.log("Cycle Detection Result:", cycleCheck);
assert(!cycleCheck.hasCycle, "Should not detect cycle in valid DAG");

const statuses = graph.propagateStatus();
console.log("Propagated Statuses:", Object.fromEntries(statuses));
assert(statuses.get("task1") === "completed", "Task 1 should be completed");
assert(
	statuses.get("task2") === "active",
	"Task 2 should be active because prerequisite task1 is completed",
);
assert(
	statuses.get("task3") === "blocked",
	"Task 3 should be blocked because prerequisite task2 is not completed",
);

// 5. Test Enhanced Recurrence Rules
const nextDueStrict = calculateNextDueDate("2026-08-16", "2026-08-18", {
	freq: "weekly",
	interval: 1,
	mode: "strict",
});
console.log("Next Due (Strict):", nextDueStrict);
assert(nextDueStrict === "2026-08-23", "Strict recurrence failed");

const nextDueWorkday = calculateNextDueDate("2026-08-14", "2026-08-14", {
	// Aug 14 2026 is Friday + 1 day = Aug 15 (Sat) -> shifts to Aug 17 (Mon)
	freq: "daily",
	interval: 1,
	mode: "workdays",
});
console.log("Next Due (Workdays from Friday):", nextDueWorkday);
assert(
	nextDueWorkday === "2026-08-17",
	"Workdays recurrence weekend shift failed",
);

console.log("=== All Tests Passed Successfully! ===");

function condition(expr: boolean, msg: string) {
	if (!expr) {
		throw new Error(`ASSERTION FAILED: ${msg}`);
	}
}
function assert(expr: boolean, msg: string) {
	condition(expr, msg);
}
