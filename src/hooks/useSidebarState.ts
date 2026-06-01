import { useLocalStorage } from "@mantine/hooks";
import { useMemo } from "react";
import type { Filter, FilterType, Task } from "@/types/todo";
import { applyFilter, toggleFilter } from "@/utils/filterUtils";

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
