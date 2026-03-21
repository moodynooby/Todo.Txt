import {
	Badge,
	Button,
	Collapse,
	Group,
	NavLink,
	Paper,
	Stack,
	Text,
	ThemeIcon,
} from "@mantine/core";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import type { Task } from "../../types/todo";

interface PriorityConfig {
	label: string;
	color: string;
}

export const PRIORITY_CONFIG: Record<string, PriorityConfig> = {
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

export const FilterButton = ({
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
	children: ReactNode;
	isEmpty: boolean;
	emptyMessage: string;
}

export const SidebarSection = ({
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

export const CollapsedPriorityButton = ({
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

export const FilteredTasks = ({
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
