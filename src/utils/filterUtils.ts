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
	if (!activeFilter) return tasks;

	const { type, value } = activeFilter;
	// Optimize: hoist today's date calculation outside the filter loop
	const today = type === "due" && value === "overdue" ? getToday() : "";

	const filters: Record<FilterType, (t: Task) => boolean> = {
		priority: (t) => t.priority === value,
		project: (t) => t.projects?.includes(value) ?? false,
		context: (t) => t.contexts?.includes(value) ?? false,
		due: (t) => {
			if (value === "overdue") return !!t.due && t.due < today;
			return t.due === value;
		},
		completion: (t) => (value === "done" ? t.completed : !t.completed),
	};

	const filterFn = filters[type];
	return filterFn ? tasks.filter(filterFn) : tasks;
};
