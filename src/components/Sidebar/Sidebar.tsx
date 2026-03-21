import {
	ActionIcon,
	Divider,
	Group,
	Paper,
	ScrollArea,
	Stack,
	Text,
	useMantineColorScheme,
} from "@mantine/core";
import {
	ChevronLeft,
	ChevronRight,
	Filter as FilterIcon,
	X,
} from "lucide-react";
import type { Filter, ParsedTodoContent } from "../../types/todo";
import {
	CollapsedPriorityButton,
	FilterButton,
	FilteredTasks,
	PRIORITY_CONFIG,
	SidebarSection,
} from "./SidebarParts";
import { useSidebarState } from "./useSidebarState";

interface SidebarProps {
	isCollapsed: boolean;
	onToggle: () => void;
	taskData: ParsedTodoContent;
	activeFilter: Filter | null;
	onFilterChange: (filter: Filter | null) => void;
}

const Sidebar = ({
	isCollapsed,
	onToggle,
	taskData,
	activeFilter,
	onFilterChange,
}: SidebarProps) => {
	const { tasks, priorities, projects, contexts } = taskData;
	const { colorScheme } = useMantineColorScheme();
	const isDark = colorScheme === "dark";
	const {
		expandedSections,
		toggleSection,
		handleFilterClick,
		clearFilter,
		completedCount,
		filteredTasks,
	} = useSidebarState({
		tasks,
		activeFilter,
		onFilterChange,
	});

	const borderColor = isDark ? "dark.4" : "gray.3";

	if (isCollapsed) {
		return (
			<Paper
				component="aside"
				shadow="sm"
				radius={0}
				style={{
					height: "100%",
				}}
			>
				<Group justify="center" py="sm">
					<ActionIcon variant="subtle" size="sm" onClick={onToggle}>
						<ChevronRight size={16} />
					</ActionIcon>
				</Group>
				<Stack align="center" gap="xs" p="xs">
					{Object.keys(priorities)
						.filter((p) => priorities[p]?.length)
						.map((p) => (
							<CollapsedPriorityButton
								key={p}
								priority={p}
								isActive={
									activeFilter?.type === "priority" && activeFilter?.value === p
								}
								onClick={() => handleFilterClick("priority", p)}
							/>
						))}
				</Stack>
			</Paper>
		);
	}

	return (
		<Paper
			component="aside"
			shadow="sm"
			radius={0}
			style={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Group justify="space-between" px="md" py="sm">
				<Group gap="xs">
					<FilterIcon size={14} />
					<Text
						size="xs"
						fw={700}
						tt="uppercase"
						style={{ letterSpacing: "0.05em" }}
					>
						Filters
					</Text>
				</Group>
				<ActionIcon variant="subtle" size="sm" onClick={onToggle}>
					<ChevronLeft size={16} />
				</ActionIcon>
			</Group>
			<Divider color={borderColor} />

			{activeFilter && (
				<Paper px="md" py="xs" bg="violet.0">
					<Group justify="space-between">
						<Text size="sm">
							{activeFilter.type === "priority" &&
								`Priority ${activeFilter.value}`}
							{activeFilter.type === "project" && `+${activeFilter.value}`}
							{activeFilter.type === "context" && `@${activeFilter.value}`}
						</Text>
						<ActionIcon variant="subtle" size="xs" onClick={clearFilter}>
							<X size={14} />
						</ActionIcon>
					</Group>
				</Paper>
			)}

			<Group justify="space-between" px="md" py="xs">
				<Text size="xs" c="dimmed">
					{tasks.length} tasks
				</Text>
				<Text size="xs" c="dimmed">
					{completedCount} done
				</Text>
			</Group>
			<Divider color={borderColor} />

			<ScrollArea style={{ flex: 1 }} p="sm">
				{activeFilter ? (
					<FilteredTasks
						filteredTasks={filteredTasks}
						onClearFilter={clearFilter}
					/>
				) : (
					<>
						<SidebarSection
							title="Priorities"
							id="priorities"
							expandedSections={expandedSections}
							onToggle={toggleSection}
							isEmpty={Object.values(priorities).every((arr) => !arr?.length)}
							emptyMessage="No prioritized tasks"
						>
							{Object.entries(priorities).map(
								([priority, items]) =>
									items?.length > 0 && (
										<FilterButton
											key={priority}
											type="priority"
											value={priority}
											label={PRIORITY_CONFIG[priority]?.label || priority}
											count={items.length}
											isActive={
												activeFilter?.type === "priority" &&
												activeFilter?.value === priority
											}
											onClick={() => handleFilterClick("priority", priority)}
										/>
									),
							)}
						</SidebarSection>

						<SidebarSection
							title="Projects"
							id="projects"
							expandedSections={expandedSections}
							onToggle={toggleSection}
							isEmpty={Object.keys(projects).length === 0}
							emptyMessage="No projects found"
						>
							{Object.entries(projects).map(([project, items]) => (
								<FilterButton
									key={project}
									type="project"
									value={project}
									label={project}
									count={items.length}
									isActive={
										activeFilter?.type === "project" &&
										activeFilter?.value === project
									}
									onClick={() => handleFilterClick("project", project)}
									prefix="+"
								/>
							))}
						</SidebarSection>

						<SidebarSection
							title="Contexts"
							id="contexts"
							expandedSections={expandedSections}
							onToggle={toggleSection}
							isEmpty={Object.keys(contexts).length === 0}
							emptyMessage="No contexts found"
						>
							{Object.entries(contexts).map(([context, items]) => (
								<FilterButton
									key={context}
									type="context"
									value={context}
									count={items.length}
									isActive={
										activeFilter?.type === "context" &&
										activeFilter?.value === context
									}
									onClick={() => handleFilterClick("context", context)}
									prefix="@"
									label={context}
								/>
							))}
						</SidebarSection>
					</>
				)}
			</ScrollArea>
		</Paper>
	);
};

export default Sidebar;
