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

export const matchesFilter = (
	task: Task,
	filter: Filter | null,
	today: string,
): boolean => {
	if (!filter) return true;

	switch (filter.type) {
		case "priority":
			return task.priority === filter.value;
		case "project":
			return task.projects?.includes(filter.value) ?? false;
		case "context":
			return task.contexts?.includes(filter.value) ?? false;
		case "due":
			if (filter.value === "overdue") {
				return !!task.due && task.due < today;
			}
			return task.due === filter.value;
		case "completion":
			return filter.value === "done" ? task.completed : !task.completed;
		default:
			return true;
	}
};

export const applyFilter = (
	tasks: Task[],
	activeFilter: Filter | null,
): Task[] => {
	if (!activeFilter) return tasks;
	const today = getToday();
	return tasks.filter((t) => matchesFilter(t, activeFilter, today));
};
