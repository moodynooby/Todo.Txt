import type { Filter, FilterType, Task } from "@/types/todo";
import { getToday } from "./dateUtils";

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
		project: (t) => t.projects?.includes(activeFilter.value) ?? false,
		context: (t) => t.contexts?.includes(activeFilter.value) ?? false,
		due: (t) => {
			if (activeFilter.value === "overdue")
				return !!t.due && t.due < getToday();
			return t.due === activeFilter.value;
		},
		completion: (t) =>
			activeFilter.value === "done" ? t.completed : !t.completed,
	};
	return tasks.filter(filters[activeFilter.type] || (() => true));
};
