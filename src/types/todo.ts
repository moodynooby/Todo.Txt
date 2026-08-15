export type FilterType =
	| "priority"
	| "project"
	| "context"
	| "due"
	| "completion";

export interface Filter {
	type: FilterType;
	value: string;
}

export interface Task {
	id: number;
	text: string;
	raw: string;
	completed: boolean;
	priority?: string;
	projects?: string[];
	contexts?: string[];
	due?: string;
	/* Optional clock time paired with `due:`, e.g. `due:2026-08-16T14:30`
	 * or `due:today@17:00`. Enables exact reminder timers. */
	dueTime?: string;
}

export interface ParsedTodoContent {
	tasks: Task[];
	priorities: Record<string, Task[]>;
	projects: Record<string, Task[]>;
	contexts: Record<string, Task[]>;
	dueDates: Record<string, Task[]>;
	completedCount: number;
}
