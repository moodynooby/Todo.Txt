import type { Filter, FilterType, Task } from "../types/todo";

export const toggleFilter = (
	activeFilter: Filter | null,
	type: FilterType,
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
	const filters: Record<FilterType, (t: Task) => boolean> = {
		priority: (t) => t.priority === activeFilter.value,
		project: (t) => t.projects?.includes(activeFilter.value),
		context: (t) => t.contexts?.includes(activeFilter.value),
	};
	return tasks.filter(filters[activeFilter.type] || (() => true));
};
