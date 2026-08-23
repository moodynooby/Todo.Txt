// @ts-expect-error — Kotlin/JS compiled module (no TypeScript declarations)
import * as core from "@todotxt/core";
import type { Habit, HabitColor } from "@/types/habits";
import type { ParsedTodoContent, Task } from "@/types/todo";
import { getToday, getTomorrow } from "@/utils/dateUtils";

/**
 * Typed bridge to the shared Kotlin core (`@todotxt/core`).
 *
 * The core speaks JSON strings (Kotlinx serialization over JsExport); this
 * module converts to and from the web's plain objects so feature code never
 * sees raw JSON. Parsing, streak math, scheduling grammar, dependency
 * metadata, and habit merging are single-sourced here — the deleted
 * `todoParser.ts` / `advancedParser.ts` / `habitUtils.ts` copies lived in
 * these files and drifted.
 */

type CoreModule = {
	parseTodoContentJs: (raw: string) => string;
	parseTodoLineJs: (raw: string, id: number) => string;
	parseSchedulingPhraseJs: (text: string) => string;
	parseTaskMetadataJs: (text: string) => string;
	streakForHabitJs: (habitJson: string) => string;
	bestStreakForHabitJs: (habitJson: string) => string;
	completionRateForHabitJs: (habitJson: string, days: number) => string;
	mergeHabitsJs: (localJson: string, remoteJson: string) => string;
};

const c = core as CoreModule;

// ---------------------------------------------------------------------------
// Habit color mapping — web stores hex, the Kotlin enum serializes by name.
// Order matches HABIT_COLORS / core HabitColor exactly.
// ---------------------------------------------------------------------------

const HEX_TO_CORE: Record<HabitColor, string> = {
	"#2f6f61": "EVERGREEN",
	"#d9784f": "TERRACOTTA",
	"#748f6c": "MOSS",
	"#9f6a4d": "CLAY",
	"#536d8d": "SLATE",
	"#9a7fbd": "LILAC",
};

const CORE_TO_HEX: Record<string, HabitColor> = Object.fromEntries(
	Object.entries(HEX_TO_CORE).map(([hex, name]) => [name, hex as HabitColor]),
);

/** Web habit -> JSON the Kotlin decoder accepts (color as enum name). */
export const toCoreHabit = (h: Habit): Record<string, unknown> => ({
	...h,
	color: HEX_TO_CORE[h.color],
});

/** Core habit JSON -> web habit (color back to hex; keep valid entries only). */
export const fromCoreHabit = (raw: unknown): Habit | null => {
	if (typeof raw !== "object" || raw === null) return null;
	const h = raw as Record<string, unknown>;
	const isHex = typeof h.color === "string" && h.color.startsWith("#");
	const hex =
		CORE_TO_HEX[String(h.color)] ?? (isHex ? (h.color as HabitColor) : null);
	if (!hex || typeof h.id !== "string") return null;
	return { ...(h as unknown as Habit), color: hex };
};

// ---------------------------------------------------------------------------
// Todo.txt parsing
// ---------------------------------------------------------------------------

/** Core Task JSON -> web Task (nulls become absent optional props). */
function adaptTask(raw: unknown): Task {
	const t = raw as {
		id: number;
		text: string;
		raw: string;
		completed: boolean;
		priority: string | null;
		projects: string[];
		contexts: string[];
		due: string | null;
		dueTime: string | null;
	};
	return {
		id: t.id,
		text: t.text,
		raw: t.raw,
		completed: t.completed,
		priority: t.priority ?? undefined,
		projects: t.projects.length > 0 ? t.projects : undefined,
		contexts: t.contexts.length > 0 ? t.contexts : undefined,
		due: t.due ?? undefined,
		dueTime: t.dueTime ?? undefined,
	};
}

export const parseTodoLine = (trimmed: string, id = 0): Task =>
	adaptTask(JSON.parse(c.parseTodoLineJs(trimmed, id)));

/**
 * Parse a whole document. Aggregation follows the web presentation contract:
 * every task lands in its priority/project/context buckets (completed tasks
 * included, so filters stay reachable for finished work), while due dates are
 * bucketed relative to the viewing device's clock.
 */
export const parseTodoContent = (content: string): ParsedTodoContent => {
	if (!content) {
		return {
			tasks: [],
			priorities: {},
			projects: {},
			contexts: {},
			dueDates: {},
			completedCount: 0,
		};
	}

	const parsed = JSON.parse(c.parseTodoContentJs(content)) as {
		tasks: unknown[];
	};
	const tasks = parsed.tasks.map(adaptTask);

	const priorities: Record<string, Task[]> = {};
	const projects: Record<string, Task[]> = {};
	const contexts: Record<string, Task[]> = {};
	const dueDates: Record<string, Task[]> = {};
	let completedCount = 0;

	const today = getToday();
	const tomorrow = getTomorrow();
	const categorizeDueDate = (due: string): string => {
		if (/^\d{4}-\d{2}-\d{2}$/.test(due)) {
			if (due < today) return "overdue";
			if (due === today) return "today";
			if (due === tomorrow) return "tomorrow";
		}
		return due;
	};

	for (const task of tasks) {
		if (task.completed) completedCount++;
		if (task.priority) {
			if (!priorities[task.priority]) priorities[task.priority] = [];
			priorities[task.priority].push(task);
		}
		for (const p of task.projects ?? []) {
			if (!projects[p]) projects[p] = [];
			projects[p].push(task);
		}
		for (const ctx of task.contexts ?? []) {
			if (!contexts[ctx]) contexts[ctx] = [];
			contexts[ctx].push(task);
		}
		if (task.due) {
			const category = categorizeDueDate(task.due);
			if (!dueDates[category]) dueDates[category] = [];
			dueDates[category].push(task);
		}
	}

	return { tasks, priorities, projects, contexts, dueDates, completedCount };
};

// ---------------------------------------------------------------------------
// Habit stats
// ---------------------------------------------------------------------------

export const getHabitStreak = (habit: Habit): number =>
	Number.parseInt(c.streakForHabitJs(JSON.stringify(toCoreHabit(habit))), 10);

export const getBestStreak = (habit: Habit): number =>
	Number.parseInt(
		c.bestStreakForHabitJs(JSON.stringify(toCoreHabit(habit))),
		10,
	);

export const getCompletionRate = (habit: Habit, days = 28): number =>
	Number.parseInt(
		c.completionRateForHabitJs(JSON.stringify(toCoreHabit(habit)), days),
		10,
	);

/** LWW habit merge through the canonical core rules (newer wins + date union). */
export const mergeHabits = (local: Habit[], remote: Habit[]): Habit[] => {
	const merged: unknown[] = JSON.parse(
		c.mergeHabitsJs(
			JSON.stringify(local.map(toCoreHabit)),
			JSON.stringify(remote.map(toCoreHabit)),
		),
	);
	return merged.map(fromCoreHabit).filter((h): h is Habit => h !== null);
};

// ---------------------------------------------------------------------------
// Scheduling phrases + dependency metadata
// ---------------------------------------------------------------------------

export interface RecurrenceRule {
	freq: "daily" | "weekly" | "monthly" | "yearly";
	interval: number;
	byDay?: number[];
	nthWeekday?: { n: number; day: number };
	time?: string;
	mode: "strict" | "workdays" | "completion";
}

export interface ParsedTaskMetadata {
	id?: string;
	after: string[];
	blocks: string[];
	recurrence?: RecurrenceRule;
}

export type SchedulingPhrase =
	| { kind: "relative"; date: string; amount: number; unit: string }
	| { kind: "recurrence"; rule: RecurrenceRule }
	| { kind: "error"; message: string };

export const parseSchedulingPhrase = (text: string): SchedulingPhrase => {
	const result = JSON.parse(
		c.parseSchedulingPhraseJs(text),
	) as SchedulingPhrase;
	return result;
};

export const parseTaskMetadata = (text: string): ParsedTaskMetadata =>
	JSON.parse(c.parseTaskMetadataJs(text)) as ParsedTaskMetadata;
