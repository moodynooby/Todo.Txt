import { useLocalStorage } from "@mantine/hooks";
import { useMemo } from "react";
import {
	defaults,
	type PersistedState,
	STORAGE_KEY,
} from "@/lib/persistedState";
import type { Filter, FilterType, Task } from "@/types/todo";
import { getToday } from "@/utils/dateUtils";
import { matchesFilter, toggleFilter } from "@/utils/filterUtils";

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
	const { tasks } = taskData;
	const [persisted, setPersisted] = useLocalStorage<PersistedState>({
		key: STORAGE_KEY,
		defaultValue: defaults,
	});

	const expandedSectionsArray = persisted.sidebar.expandedSections;
	const expandedSections = useMemo(
		() => new Set(expandedSectionsArray),
		[expandedSectionsArray],
	);

	const searchQuery = persisted.sidebar.search;
	const showCompleted = persisted.sidebar.showCompleted;

	const setSearchQuery = (val: string) =>
		setPersisted((p) => ({
			...p,
			sidebar: { ...p.sidebar, search: val },
		}));

	const toggleSection = (section: string): void => {
		setPersisted((prev) => {
			const current = prev.sidebar.expandedSections;
			const next = current.includes(section)
				? current.filter((s) => s !== section)
				: [...current, section];
			return {
				...prev,
				sidebar: { ...prev.sidebar, expandedSections: next },
			};
		});
	};

	const handleFilterClick = (type: FilterType, value: string): void => {
		onFilterChange(toggleFilter(activeFilter, type, value));
	};

	const clearFilter = (): void => {
		onFilterChange(null);
	};

	const { filteredTasks, completedCount } = useMemo(() => {
		const filtered: Task[] = [];
		let completed = 0;
		const today = getToday();
		const lowerQuery = searchQuery.toLowerCase();

		for (const task of tasks) {
			if (!showCompleted && task.completed) continue;

			if (lowerQuery && !task.text.toLowerCase().includes(lowerQuery)) continue;

			if (activeFilter && !matchesFilter(task, activeFilter, today)) continue;

			filtered.push(task);
			if (task.completed) completed++;
		}

		return { filteredTasks: filtered, completedCount: completed };
	}, [tasks, showCompleted, searchQuery, activeFilter]);

	const toggleShowCompleted = (): void => {
		setPersisted((prev) => ({
			...prev,
			sidebar: { ...prev.sidebar, showCompleted: !prev.sidebar.showCompleted },
		}));
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
