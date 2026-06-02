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

/**
 * Returns a predicate function for the given filter.
 */
export const getFilterPredicate = (
	filter: Filter | null,
	today: string = getToday(),
): ((t: Task) => boolean) => {
	if (!filter) return () => true;
	const { type, value } = filter;
	switch (type) {
		case "priority":
			return (t) => t.priority === value;
		case "project":
			return (t) => t.projects?.includes(value) ?? false;
		case "context":
			return (t) => t.contexts?.includes(value) ?? false;
		case "due":
			if (value === "overdue") return (t) => !!t.due && t.due < today;
			return (t) => t.due === value;
		case "completion":
			return (t) => (value === "done" ? t.completed : !t.completed);
		default:
			return () => true;
	}
};

/**
 * Applies a filter to a list of tasks.
 * Optimized to avoid repeated object creation and hoist date calls.
 */
export const applyFilter = (
	tasks: Task[],
	activeFilter: Filter | null,
	today: string = getToday(),
): Task[] => {
	if (!activeFilter) return [];
	return tasks.filter(getFilterPredicate(activeFilter, today));
};
