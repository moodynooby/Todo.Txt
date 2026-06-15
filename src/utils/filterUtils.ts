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

	const today = getToday();
	const value = activeFilter.value;

	const matchesFilter = (t: Task): boolean => {
		switch (activeFilter.type) {
			case "priority":
				return t.priority === value;
			case "project":
				return t.projects?.includes(value) ?? false;
			case "context":
				return t.contexts?.includes(value) ?? false;
			case "due":
				if (value === "overdue") return !!t.due && t.due < today;
				return t.due === value;
			case "completion":
				return value === "done" ? t.completed : !t.completed;
			default:
				return true;
		}
	};

	return tasks.filter(matchesFilter);
};
