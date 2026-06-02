import { useLocalStorage } from "@mantine/hooks";
import { useMemo } from "react";
import type { Filter, FilterType, Task } from "@/types/todo";
import { getToday } from "@/utils/dateUtils";
import { getFilterPredicate, toggleFilter } from "@/utils/filterUtils";

interface UseSidebarStateParams {
	taskData: {
		tasks: Task[];
		completedCount: number;
	};
	activeFilter: Filter | null;
	onFilterChange: (filter: Filter | null) => void;
}

export const useSidebarState = ({
	taskData,
	activeFilter,
	onFilterChange,
}: UseSidebarStateParams) => {
	const { tasks, completedCount } = taskData;
	const [expandedSectionsArray, setExpandedSectionsArray] = useLocalStorage<
		string[]
	>({
		key: "sidebar-expanded-sections",
		defaultValue: ["priorities", "projects", "contexts", "dueDates"],
	});

	const expandedSections = useMemo(
		() => new Set(expandedSectionsArray),
		[expandedSectionsArray],
	);

	const [searchQuery, setSearchQuery] = useLocalStorage({
		key: "sidebar-search",
		defaultValue: "",
	});

	const [showCompleted, setShowCompleted] = useLocalStorage({
		key: "sidebar-show-completed",
		defaultValue: false,
	});

	const toggleSection = (section: string): void => {
		setExpandedSectionsArray((prev) => {
			if (prev.includes(section)) {
				return prev.filter((s) => s !== section);
			}
			return [...prev, section];
		});
	};

	const handleFilterClick = (type: FilterType, value: string): void => {
		onFilterChange(toggleFilter(activeFilter, type, value));
	};

	const clearFilter = (): void => {
		onFilterChange(null);
	};

	const filteredTasks = useMemo(() => {
		// Parity: The UI only shows the filtered task list when a filter is active.
		if (!activeFilter) return [];

		const today = getToday();
		const filterPredicate = getFilterPredicate(activeFilter, today);
		const normalizedSearch = searchQuery.toLowerCase();

		// Performance: Single pass over the tasks array instead of three.
		// Combines visibility (completed status), search, and active filter logic.
		return tasks.filter((task) => {
			// 1. Completion filter
			if (!showCompleted && task.completed) return false;

			// 2. Search filter
			if (
				normalizedSearch &&
				!task.text.toLowerCase().includes(normalizedSearch)
			) {
				return false;
			}

			// 3. Active UI filter (Priority, Project, Context, etc.)
			return filterPredicate(task);
		});
	}, [tasks, activeFilter, searchQuery, showCompleted]);

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
