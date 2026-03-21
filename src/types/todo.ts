export type FilterType = "priority" | "project" | "context";

export interface Filter {
	type: FilterType;
	value: string;
}

export interface Task {
	id: number;
	text: string;
	raw: string;
	priority?: string;
	projects?: string[];
	contexts?: string[];
	due?: string;
}

export interface ParsedTodoContent {
	tasks: Task[];
	priorities: Record<string, Task[]>;
	projects: Record<string, Task[]>;
	contexts: Record<string, Task[]>;
}
