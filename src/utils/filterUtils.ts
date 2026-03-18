import type { Task } from "./todoParser";

export type { Task };

export interface Filter {
	type: string;
	value: string;
}

export const toggleFilter = (
	activeFilter: Filter | null,
	type: string,
	value: string,
): Filter | null =>
	activeFilter?.type === type && activeFilter?.value === value
		? null
		: { type, value };

export const applyFilter = (
	tasks: Task[],
	activeFilter: Filter | null,
): Task[] => {
	if (!activeFilter) return [];
	const filters: Record<string, (t: Task) => boolean> = {
		priority: (t) => t.priority === activeFilter.value,
		project: (t) => t.projects?.includes(activeFilter.value),
		context: (t) => t.contexts?.includes(activeFilter.value),
	};
	return tasks.filter(filters[activeFilter.type] || (() => true));
};
