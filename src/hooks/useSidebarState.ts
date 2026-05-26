import { useMemo, useState } from "react";
import type { Filter, FilterType, Task } from "@/types/todo";
import { applyFilter, toggleFilter } from "@/utils/filterUtils";

interface UseSidebarStateParams {
	tasks: Task[];
	activeFilter: Filter | null;
	onFilterChange: (filter: Filter | null) => void;
}

export const useSidebarState = ({
	tasks,
	activeFilter,
	onFilterChange,
}: UseSidebarStateParams) => {
	const [expandedSections, setExpandedSections] = useState<Set<string>>(
		new Set(["priorities", "projects", "contexts", "dueDates"]),
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [showCompleted, setShowCompleted] = useState(false);

	const toggleSection = (section: string): void => {
		setExpandedSections((prev) => {
			const next = new Set(prev);
			if (next.has(section)) {
				next.delete(section);
			} else {
				next.add(section);
			}
			return next;
		});
	};

	const handleFilterClick = (type: FilterType, value: string): void => {
		onFilterChange(toggleFilter(activeFilter, type, value));
	};

	const clearFilter = (): void => {
		onFilterChange(null);
	};

	const visibleTasks = useMemo(
		() => (showCompleted ? tasks : tasks.filter((t) => !t.completed)),
		[tasks, showCompleted],
	);

	const searchedTasks = useMemo(
		() =>
			searchQuery
				? visibleTasks.filter((t) =>
						t.text.toLowerCase().includes(searchQuery.toLowerCase()),
					)
				: visibleTasks,
		[visibleTasks, searchQuery],
	);

	const completedCount = useMemo(
		() => tasks.filter((task) => task.completed).length,
		[tasks],
	);

	const filteredTasks = useMemo(
		() => applyFilter(searchedTasks, activeFilter),
		[searchedTasks, activeFilter],
	);

	const toggleShowCompleted = (): void => {
		setShowCompleted((prev) => !prev);
	};

	return {
		expandedSections,
		toggleSection,
		handleFilterClick,
		clearFilter,
		completedCount,
		filteredTasks,
		searchQuery,
		setSearchQuery,
		showCompleted,
		toggleShowCompleted,
	};
};
