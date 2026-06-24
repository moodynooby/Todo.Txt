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

export const getFilterPredicate = (
	activeFilter: Filter | null,
	today: string,
): ((t: Task) => boolean) => {
	if (!activeFilter) return () => true;

	const val = activeFilter.value;
	switch (activeFilter.type) {
		case "priority":
			return (t) => t.priority === val;
		case "project":
			return (t) => t.projects?.includes(val) ?? false;
		case "context":
			return (t) => t.contexts?.includes(val) ?? false;
		case "due":
			if (val === "overdue") return (t) => !!t.due && t.due < today;
			return (t) => t.due === val;
		case "completion":
			return val === "done" ? (t) => t.completed : (t) => !t.completed;
		default:
			return () => true;
	}
};

export const applyFilter = (
	tasks: Task[],
	activeFilter: Filter | null,
): Task[] => {
	if (!activeFilter) return tasks;
	const today = getToday();
	const predicate = getFilterPredicate(activeFilter, today);
	return tasks.filter(predicate);
};
