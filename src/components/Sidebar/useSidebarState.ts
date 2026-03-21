import { useMemo, useState } from "react";
import type { Filter, FilterType, Task } from "../../types/todo";
import { applyFilter, toggleFilter } from "../../utils/filterUtils";

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
		new Set(["priorities", "projects", "contexts"]),
	);

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

	const completedCount = useMemo(
		() => tasks.filter((task) => task.text.startsWith("x ")).length,
		[tasks],
	);
	const filteredTasks = useMemo(
		() => applyFilter(tasks, activeFilter),
		[tasks, activeFilter],
	);

	return {
		expandedSections,
		toggleSection,
		handleFilterClick,
		clearFilter,
		completedCount,
		filteredTasks,
	};
};
