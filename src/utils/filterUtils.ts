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
 * Returns a predicate function for filtering tasks based on the active filter.
 * Hoists common values like today's date to avoid redundant calculations.
 */
export const getFilterPredicate = (
	activeFilter: Filter | null,
	today: string = getToday(),
): ((t: Task) => boolean) => {
	if (!activeFilter) return () => true;

	const { type, value } = activeFilter;

	switch (type) {
		case "priority":
			return (t) => t.priority === value;
		case "project":
			return (t) => t.projects?.includes(value) ?? false;
		case "context":
			return (t) => t.contexts?.includes(value) ?? false;
		case "due":
			if (value === "overdue") {
				return (t) => !!t.due && t.due < today;
			}
			return (t) => t.due === value;
		case "completion":
			return (t) => (value === "done" ? t.completed : !t.completed);
		default:
			return () => true;
	}
};

export const applyFilter = (
	tasks: Task[],
	activeFilter: Filter | null,
): Task[] => {
	if (!activeFilter) return tasks;
	const predicate = getFilterPredicate(activeFilter);
	return tasks.filter(predicate);
};
