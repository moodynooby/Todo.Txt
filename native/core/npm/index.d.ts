// TypeScript declarations for todotxt-core — the shared Kotlin Multiplatform
// (JVM + JS) core. All exports live under `core.$_$` with mangled Kotlin/JS
// symbol names; the helper constants below map friendly names to them.
//
// Usage:
//   import "todotxt-core";            // side-effect: exposes globalThis.todotxtCore
//   const core = globalThis.todotxtCore;
//   const parser = core.TodoParser();  // Kotlin object factory
//   const habitUtils = core.HabitUtils();

export interface CoreNamespace {
	$_$: CoreExports;
}

export interface CoreExports {
	/** Habit data class constructor */
	a: HabitConstructor;
	/** free function addDaysString */
	e: (base: string, days: number) => string;
	/** HabitColor EVERGREEN singleton */
	f: number;
	/** HabitUtils_getInstance factory */
	g: () => HabitUtils;
	/** SchedulingParser_getInstance factory (Tier 2 addition) */
	h: () => SchedulingParser;
	/** TodoParser_getInstance factory */
	i: () => TodoParser;
	/** Kotlin object instances for deserialized types */
	SchedulingParser: SchedulingParser;
	ScheduleResult: unknown;
}

export interface TodoParser {
	parseTodoLine(line: string, ...rest: unknown[]): ParsedTodoLine;
	parseTodoContent(text: string): ParsedTodoContent;
	setLineCompleted(content: string, index: number, completed: boolean): string;
	/** Robust completion: rewrites the matching raw line in the current content. */
	setTaskCompleted(content: string, task: unknown, completed: boolean): string;
	today(): string;
	tomorrow(): string;
	yesterday(): string;
}

export interface HabitUtils {
	today(): string;
	getLastDays(days: number): unknown[];
	isHabitCompleteOn(habit: Habit, date: string): boolean;
	getHabitStreak(habit: Habit): number;
	getBestStreak(habit: Habit): number;
	getCompletionRate(habit: Habit, ...rest: unknown[]): number;
	getMomentum(habit: Habit): number;
	getHeatmap(habit: Habit, ...rest: unknown[]): unknown;
	toggleDate(habit: Habit, date: string): Habit;
	formatLocalDate(date: string): string;
}

export interface ParsedTodoLine {
	text_1: string;
	raw_1: string;
	completed_1: boolean;
	priority_1: string | null;
	projects_1: string[];
	contexts_1: string[];
	due_1: string | null;
	dueTime_1: string | null;
}

export interface ParsedTodoContent {
	tasks_1: { get_size_woubt6_k$(): number; get_c1px32_k$(index: number): ParsedTodoLine };
	priorities_1: unknown;
	projects_1: unknown;
	contexts_1: unknown;
	dueDates_1: unknown;
	completedCount_1: number;
}

export interface HabitConstructor {
	new (
		id: string,
		name: string,
		color: number,
		reminderEnabled: boolean,
		reminderTime: { serialVersionUID: { low: number; high: number } },
		completedDates: unknown, // Kotlin ArrayList (pass a plain JS array wrapped via ArrayList ctor)
		archived: boolean,
		createdAt: unknown,
		updatedAt: unknown,
	): Habit;
}

export interface Habit {
	id_1: string;
	name_1: string;
	color_1: number;
	reminderEnabled_1: boolean;
	reminderTime_1: unknown;
	completedDates_1: unknown; // Kotlin ArrayList<string>
	archived_1: boolean;
	createdAt_1: unknown;
	updatedAt_1: unknown;
}

declare global {
	interface Window {
		todotxtCore?: CoreNamespace;
	}
	var todotxtCore: CoreNamespace | undefined;
}

export interface SchedulingParser {
	/** Parse a natural-language scheduling phrase (e.g. "in 3 days", "every Monday at 9:00").
	 * JS IR mangles the method name; use `parseSchedulingPhrase_vuneq5_k$(phrase)`.
	 * Returns ScheduleResult { rule_1 } | { relative_1 } | { message_1 } (Error). */
	parseSchedulingPhrase(phrase: string, today?: string): unknown;
	parseSchedulingPhrase_vuneq5_k$(phrase: string, today?: string): unknown;
}

export interface RelativeDate {
	relative: { days: number };
	at?: string;
}

export interface RecurrenceResult {
	recurrence: {
		frequency: string;
		interval: number;
		time?: string;
		nthWeekdays?: unknown[];
		relativeDays?: number[];
	};
}

declare const _default: CoreNamespace;
export default _default;
