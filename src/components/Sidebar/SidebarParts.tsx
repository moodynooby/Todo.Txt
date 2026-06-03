import {
	ActionIcon,
	Badge,
	Button,
	Collapse,
	NavLink,
	Stack,
	Switch,
	Text,
	TextInput,
	ThemeIcon,
} from "@mantine/core";
import { ChevronRight, Search, X } from "lucide-react";
import type { ReactNode } from "react";

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
	label?: string;
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
	const displayLabel = label ?? value;

	return (
		<NavLink
			label={displayLabel}
			description={prefix ? `${prefix}${value}` : undefined}
			rightSection={
				<Badge size="sm" variant="light">
					{count}
				</Badge>
			}
			active={isActive}
			onClick={onClick}
			color={priorityColor || "primary"}
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
	isEmpty?: boolean;
	emptyMessage?: string;
}

export const SidebarSection = ({
	title,
	id,
	expandedSections,
	onToggle,
	children,
	isEmpty,
	emptyMessage,
}: SidebarSectionProps) => {
	const isExpanded = expandedSections.has(id);
	return (
		<Stack gap="xs">
			<Button
				variant="subtle"
				color="gray"
				fullWidth
				justify="space-between"
				rightSection={
					<ChevronRight
						size={14}
						style={{ transform: isExpanded ? "rotate(90deg)" : "none" }}
					/>
				}
				onClick={() => onToggle(id)}
				tt="uppercase"
				size="xs"
				fw={700}
				style={{ letterSpacing: "0.05em" }}
			>
				{title}
			</Button>
			<Collapse expanded={isExpanded}>
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
};

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
		>
			<Text fw={700} size="sm">
				{priority}
			</Text>
		</ThemeIcon>
	);
};

interface SearchInputProps {
	value: string;
	onChange: (value: string) => void;
}

export const SearchInput = ({ value, onChange }: SearchInputProps) => (
	<TextInput
		placeholder="Search tasks..."
		leftSection={<Search size={14} />}
		rightSection={
			value ? (
				<ActionIcon variant="subtle" size="xs" onClick={() => onChange("")}>
					<X size={14} />
				</ActionIcon>
			) : null
		}
		value={value}
		onChange={(e) => onChange(e.currentTarget.value)}
		size="xs"
		mb="xs"
	/>
);

interface CompletionToggleProps {
	showCompleted: boolean;
	onToggle: () => void;
}

export const CompletionToggle = ({
	showCompleted,
	onToggle,
}: CompletionToggleProps) => (
	<Switch
		label="Show completed"
		size="xs"
		checked={showCompleted}
		onChange={onToggle}
		px="md"
		mb="xs"
	/>
);
