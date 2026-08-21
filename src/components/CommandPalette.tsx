import { useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { Spotlight } from "@mantine/spotlight";
import {
	Brush,
	CheckSquare,
	Keyboard,
	Notebook,
	Rows3,
	Search,
	SunMoon,
	Wifi,
} from "lucide-react";
import { useMemo } from "react";
import { useViewContext } from "@/context/ViewContext";
import type { Filter, ParsedTodoContent } from "@/types/todo";

/**
 * Global command palette (Ctrl/Cmd+K).
 *
 * One surface to jump between workspaces, apply todo.txt filters
 * (projects / contexts / priorities), and flip the color scheme.
 * Actions reuse the exact state flows the UI already drives — no new
 * state is introduced (DESIGN.md guardrail 3).
 */

interface CommandPaletteProps {
	taskData: ParsedTodoContent;
	activeFilter: Filter | null;
	onFilterChange: (filter: Filter | null) => void;
}

interface PaletteAction {
	id: string;
	label: string;
	keywords: string;
	onClick: () => void;
	leftSection: React.ReactNode;
}

interface PaletteGroup {
	group: string;
	actions: PaletteAction[];
}

const CommandPalette = ({
	taskData,
	activeFilter,
	onFilterChange,
}: CommandPaletteProps) => {
	const { state: viewState, dispatchView } = useViewContext();
	const { setColorScheme } = useMantineColorScheme();
	const computedColorScheme = useComputedColorScheme("light");

	const groups = useMemo((): PaletteGroup[] => {
		const setView = (mode: string) =>
			dispatchView({ type: "SET_VIEW_MODE", payload: mode });

		const applyFilter = (filter: Filter) => {
			setView("todo");
			onFilterChange(filter);
		};

		const workspaceActions: PaletteAction[] = [
			{
				id: "view-todo",
				label: "Go to Todo",
				keywords: "tasks editor write",
				onClick: () => setView("todo"),
				leftSection: <CheckSquare size={18} />,
			},
			{
				id: "view-habits",
				label: "Go to Habits",
				keywords: "streaks routine daily",
				onClick: () => setView("habits"),
				leftSection: <Brush size={18} />,
			},
			{
				id: "view-notes",
				label: "Go to Notes",
				keywords: "notebook journal",
				onClick: () => setView("notes"),
				leftSection: <Notebook size={18} />,
			},
			{
				id: "view-draw",
				label: "Go to Draw",
				keywords: "sketch excalidraw canvas",
				onClick: () => setView("excalidraw"),
				leftSection: <Brush size={18} />,
			},
			{
				id: "view-sync",
				label: "Go to Sync",
				keywords: "p2p devices backup",
				onClick: () => setView("sync"),
				leftSection: <Wifi size={18} />,
			},
			{
				id: "theme-toggle",
				label:
					computedColorScheme === "dark"
						? "Switch to light mode"
						: "Switch to dark mode",
				keywords: "theme light dark appearance color scheme",
				onClick: () =>
					setColorScheme(computedColorScheme === "dark" ? "light" : "dark"),
				leftSection: <SunMoon size={18} />,
			},
			{
				id: "density-toggle",
				label:
					viewState.density === "compact"
						? "Comfortable density"
						: "Compact density",
				keywords: "density spacing compact comfortable layout",
				onClick: () =>
					dispatchView({
						type: "SET_DENSITY",
						payload:
							viewState.density === "compact" ? "comfortable" : "compact",
					}),
				leftSection: <Rows3 size={18} />,
			},
			{
				id: "open-shortcuts",
				label: "Keyboard shortcuts",
				keywords: "shortcuts keys help keyboard cheatsheet",
				onClick: () => window.dispatchEvent(new Event("open-shortcuts")),
				leftSection: <Keyboard size={18} />,
			},
		];

		const projectNames = Object.keys(taskData.projects).sort();
		const contextNames = Object.keys(taskData.contexts).sort();

		const groups: PaletteGroup[] = [
			{ group: "Workspaces", actions: workspaceActions },
		];

		if (projectNames.length > 0) {
			groups.push({
				group: "Filter by project",
				actions: projectNames.map(
					(project): PaletteAction => ({
						id: `filter-project-${project}`,
						label: `+${project}`,
						keywords: "project filter todo",
						onClick: () => applyFilter({ type: "project", value: project }),
						leftSection: <Search size={16} />,
					}),
				),
			});
		}

		if (contextNames.length > 0) {
			groups.push({
				group: "Filter by context",
				actions: contextNames.map(
					(context): PaletteAction => ({
						id: `filter-context-${context}`,
						label: `@${context}`,
						keywords: "context filter todo",
						onClick: () => applyFilter({ type: "context", value: context }),
						leftSection: <Search size={16} />,
					}),
				),
			});
		}

		if (activeFilter) {
			groups.push({
				group: "Filters",
				actions: [
					{
						id: "filter-clear",
						label: "Clear active filter",
						keywords: "clear reset filter show all",
						onClick: () => onFilterChange(null),
						leftSection: <Search size={16} />,
					},
				],
			});
		}

		return groups;
	}, [
		activeFilter,
		computedColorScheme,
		dispatchView,
		onFilterChange,
		setColorScheme,
		taskData.contexts,
		taskData.projects,
		viewState.density,
	]);
	/* Record identity changes every parse; keys are what matter. */

	return (
		<Spotlight
			shortcut="mod+k"
			/* The todo editor is contentEditable — without this the palette
			 * would never open from the app's primary surface. */
			triggerOnContentEditable
			scrollable
			maxHeight={420}
			nothingFound="Nothing found"
			searchProps={{
				placeholder: "Jump to a workspace or filter…",
				leftSection: <Search size={18} />,
			}}
			actions={groups}
		/>
	);
};

export default CommandPalette;
