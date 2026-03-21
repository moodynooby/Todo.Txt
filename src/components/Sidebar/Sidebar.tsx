import {
	ActionIcon,
	Badge,
	Button,
	Collapse,
	Divider,
	Group,
	NavLink,
	Paper,
	ScrollArea,
	Stack,
	Text,
	ThemeIcon,
	useMantineColorScheme,
} from "@mantine/core";
import { ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import { useState } from "react";
import {
	type Filter as FilterType,
	toggleFilter,
} from "../../utils/filterUtils";
import type { ParsedTodoContent, Task } from "../../utils/todoParser";

interface PriorityConfig {
	label: string;
	color: string;
}

const PRIORITY_CONFIG: Record<string, PriorityConfig> = {
	A: { label: "High", color: "red" },
	B: { label: "Medium", color: "yellow" },
	C: { label: "Low", color: "blue" },
};

interface FilterButtonProps {
	type: string;
	value: string;
	label: string;
	count: number;
	isActive: boolean;
	onClick: () => void;
	prefix?: string;
}

const FilterButton = ({
	type,
	value,
	label,
	count,
	isActive,
	onClick,
	prefix,
}: FilterButtonProps) => {
	const priorityColor =
		type === "priority" ? PRIORITY_CONFIG[value]?.color : null;
	const variant = isActive ? "light" : "subtle";

	return (
		<NavLink
			label={label}
			description={prefix ? `${prefix}${value}` : undefined}
			rightSection={
				<Badge size="sm" variant="light">
					{count}
				</Badge>
			}
			active={isActive}
			onClick={onClick}
			color={priorityColor || "violet"}
			variant={variant}
		/>
	);
};

interface SidebarSectionProps {
	title: string;
	id: string;
	expandedSections: Set<string>;
	onToggle: (id: string) => void;
	children: React.ReactNode;
	isEmpty: boolean;
	emptyMessage: string;
}

const SidebarSection = ({
	title,
	id,
	expandedSections,
	onToggle,
	children,
	isEmpty,
	emptyMessage,
}: SidebarSectionProps) => (
	<Stack gap="xs">
		<Button
			variant="subtle"
			color="gray"
			fullWidth
			justify="space-between"
			rightSection={<ChevronRight size={14} />}
			onClick={() => onToggle(id)}
			styles={{
				root: {
					textTransform: "uppercase",
					fontSize: "var(--mantine-font-size-xs)",
					fontWeight: 700,
					letterSpacing: "0.05em",
				},
			}}
		>
			{title}
		</Button>
		<Collapse in={expandedSections.has(id)}>
			<Stack gap={4}>
				{isEmpty ? (
					<Text size="xs" c="dimmed" fs="italic" px="sm" py="xs">
						{emptyMessage}
					</Text>
				) : (
					children
				)}
			</Stack>
		</Collapse>
	</Stack>
);

interface CollapsedPriorityButtonProps {
	priority: string;
	isActive: boolean;
	onClick: () => void;
}

const CollapsedPriorityButton = ({
	priority,
	isActive,
	onClick,
}: CollapsedPriorityButtonProps) => {
	const config = PRIORITY_CONFIG[priority] || {
		label: priority,
		color: "gray",
	};
	return (
		<ThemeIcon
			variant={isActive ? "filled" : "light"}
			color={config.color}
			size="lg"
			radius="md"
			onClick={onClick}
			style={{ cursor: "pointer" }}
		>
			<Text fw={700} size="sm">
				{priority}
			</Text>
		</ThemeIcon>
	);
};

interface FilteredTasksProps {
	filteredTasks: Task[];
	onClearFilter: () => void;
}

const FilteredTasks = ({
	filteredTasks,
	onClearFilter,
}: FilteredTasksProps) => (
	<Stack gap="xs" p="md">
		<Group justify="space-between">
			<Text size="sm" fw={600}>
				{filteredTasks.length} matching tasks
			</Text>
			<Button variant="subtle" size="xs" onClick={onClearFilter}>
				Clear Filter
			</Button>
		</Group>
		{filteredTasks.map((task) => (
			<Paper key={task.id} p="xs" withBorder>
				<Text size="xs" ff="monospace">
					{task.raw}
				</Text>
			</Paper>
		))}
	</Stack>
);

interface SidebarProps {
	isCollapsed: boolean;
	onToggle: () => void;
	taskData: ParsedTodoContent;
	activeFilter: FilterType | null;
	onFilterChange: (filter: FilterType | null) => void;
}

const Sidebar = ({
	isCollapsed,
	onToggle,
	taskData,
	activeFilter,
	onFilterChange,
}: SidebarProps) => {
	const { tasks, priorities, projects, contexts } = taskData;
	const [expandedSections, setExpandedSections] = useState<Set<string>>(
		new Set(["priorities", "projects", "contexts"]),
	);
	const { colorScheme } = useMantineColorScheme();
	const isDark = colorScheme === "dark";

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

	const handleFilterClick = (type: string, value: string): void => {
		onFilterChange(toggleFilter(activeFilter, type, value));
	};

	const clearFilter = (): void => {
		onFilterChange(null);
	};

	const completedCount = tasks.filter((t) => t.text.startsWith("x ")).length;
	const filteredTasks = activeFilter
		? tasks.filter((t) => {
				if (activeFilter.type === "priority") {
					return t.priority === activeFilter.value;
				}
				if (activeFilter.type === "project") {
					return t.projects?.includes(activeFilter.value);
				}
				if (activeFilter.type === "context") {
					return t.contexts?.includes(activeFilter.value);
				}
				return true;
			})
		: [];

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
					<Filter size={14} />
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
