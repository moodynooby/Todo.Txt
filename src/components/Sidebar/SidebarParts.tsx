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
	const displayLabel = label ?? value;

	/* M3 Expressive "bubble" filter chip: a fully rounded pill whose
	 * tonal level rises when active — active chips sit on an elevated
	 * filled surface, quiet chips are flat with a soft outline. */
	const bubbleStyle: React.CSSProperties = {
		borderRadius: "var(--m3-radius-pill)",
		border: isActive
			? "1px solid var(--m3-chip-border-active, transparent)"
			: "1px solid var(--app-border)",
		transition:
			"background-color 140ms var(--m3-ease-effects), border-color 140ms var(--m3-ease-effects), transform 120ms var(--m3-ease-spatial-fast)",
		minHeight: 36,
	};

	return (
		<NavLink
			label={displayLabel}
			description={prefix ? `${prefix}${value}` : undefined}
			className="sidebar-filter-bubble"
			rightSection={
				<Badge
					size="sm"
					variant="light"
					radius="xl"
					style={{
						borderRadius: "var(--m3-radius-pill)",
						minWidth: 22,
						border: isActive ? "none" : "1px solid var(--app-border)",
					}}
				>
					{count}
				</Badge>
			}
			active={isActive}
			onClick={onClick}
			color={priorityColor || "primary"}
			variant={isActive ? "light" : "subtle"}
			styles={{
				root: bubbleStyle,
				label: { fontSize: 13 },
				description: { fontSize: 11, fontFamily: "monospace" },
			}}
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
	/** When true the section hides itself entirely (used while the document
	 *  is empty, so guidance concentrates in the smart TipsPanel). */
	hideWhenEmpty?: boolean;
}

export const SidebarSection = ({
	title,
	id,
	expandedSections,
	onToggle,
	children,
	isEmpty,
	emptyMessage,
	hideWhenEmpty,
}: SidebarSectionProps) => {
	const isExpanded = expandedSections.has(id);

	if (isEmpty && hideWhenEmpty) return null;

	return (
		<Stack gap="xs">
			<Button
				variant="subtle"
				color="gray"
				fullWidth
				justify="space-between"
				className="sidebar-section-button"
				rightSection={
					<ChevronRight
						size={14}
						style={{
							transform: isExpanded ? "rotate(90deg)" : "none",
							transition: "transform 140ms var(--m3-ease-effects)",
						}}
					/>
				}
				onClick={() => onToggle(id)}
				size="xs"
				fw={700}
			>
				{title}
			</Button>
			<Collapse expanded={isExpanded}>
				<Stack gap={4}>
					{isEmpty ? (
						<Text size="xs" c="dimmed" px="sm" py="xs">
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
		radius="xl"
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
