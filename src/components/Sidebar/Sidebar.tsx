import { ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import { useState } from "react";
import "./Sidebar.css";
import {
	type Filter as FilterType,
	toggleFilter,
} from "../../utils/filterUtils";
import type { ParsedTodoContent } from "../../utils/todoParser";

interface PriorityConfig {
	label: string;
	color: string;
}

const PRIORITY_CONFIG: Record<string, PriorityConfig> = {
	A: { label: "High", color: "#ef4444" },
	B: { label: "Medium", color: "#f59e0b" },
	C: { label: "Low", color: "#3b82f6" },
};

const getPriorityColor = (level: string): string =>
	PRIORITY_CONFIG[level]?.color || "#6b7280";
const getPriorityLabel = (level: string): string =>
	PRIORITY_CONFIG[level]?.label || "Unknown";

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
	const priorityColor = type === "priority" ? getPriorityColor(value) : null;
	const activeBg =
		type === "priority" ? `${priorityColor}20` : "var(--color-primary)20";

	return (
		<button
			type="button"
			onClick={onClick}
			className={`filter-btn ${isActive ? "active" : ""}`}
			style={{ "--active-bg-color": activeBg } as React.CSSProperties}
		>
			{type === "priority" ? (
				<span
					className="priority-indicator"
					style={{ "--priority-color": priorityColor } as React.CSSProperties}
				>
					{value}
				</span>
			) : (
				<span className={`${type}-prefix`}>{prefix}</span>
			)}
			<span className="filter-text">{label}</span>
			<span className="filter-count">{count}</span>
		</button>
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
	<div className="section-wrapper">
		<button
			type="button"
			onClick={() => onToggle(id)}
			className="section-header"
		>
			<span>
				{title} {expandedSections.has(id) ? "▼" : "▶"}
			</span>
		</button>
		{expandedSections.has(id) && (
			<div className="section-content">
				{isEmpty ? <div className="empty-state">{emptyMessage}</div> : children}
			</div>
		)}
	</div>
);

interface CollapsedPriorityButtonProps {
	priority: string;
	count: number;
	isActive: boolean;
	onClick: () => void;
}

const CollapsedPriorityButton = ({
	priority,
	count,
	isActive,
	onClick,
}: CollapsedPriorityButtonProps) => (
	<button
		type="button"
		onClick={onClick}
		className={`collapsed-priority-btn ${isActive ? "active" : ""}`}
		style={
			{
				color: getPriorityColor(priority),
				"--priority-color": getPriorityColor(priority),
			} as React.CSSProperties
		}
		title={`Priority ${priority} (${count})`}
	>
		{priority}
	</button>
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

	const clearFilter = (e: React.MouseEvent): void => {
		e.stopPropagation();
		onFilterChange(null);
	};

	if (isCollapsed) {
		return (
			<aside className={`sidebar ${isCollapsed ? "collapsed" : "expanded"}`}>
				<div className="sidebar-header collapsed">
					<button
						type="button"
						onClick={onToggle}
						className="btn btn-ghost btn-xs"
						style={{ padding: "2px" }}
					>
						<ChevronRight size={16} />
					</button>
				</div>
				<div className="collapsed-priority-container">
					{Object.keys(priorities)
						.filter((p) => priorities[p]?.length)
						.map((p) => (
							<CollapsedPriorityButton
								key={p}
								priority={p}
								count={priorities[p]?.length || 0}
								isActive={
									activeFilter?.type === "priority" && activeFilter?.value === p
								}
								onClick={() => handleFilterClick("priority", p)}
							/>
						))}
				</div>
			</aside>
		);
	}

	return (
		<aside className={`sidebar ${isCollapsed ? "collapsed" : "expanded"}`}>
			<div className="sidebar-header">
				<div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
					<Filter size={14} />
					<span className="filter-title">Filters</span>
				</div>
				<button
					type="button"
					onClick={onToggle}
					className="btn btn-ghost btn-xs"
					style={{ padding: "2px" }}
				>
					<ChevronLeft size={16} />
				</button>
			</div>

			{activeFilter && (
				<div className="active-filter">
					<span>
						{activeFilter.type === "priority" &&
							`Priority ${activeFilter.value}`}
						{activeFilter.type === "project" && `+${activeFilter.value}`}
						{activeFilter.type === "context" && `@${activeFilter.value}`}
					</span>
					<button
						onClick={clearFilter}
						type="button"
						className="clear-filter-btn"
					>
						<X size={14} />
					</button>
				</div>
			)}

			<div className="task-stats">
				<span>{tasks.length} tasks</span>
				<span>{tasks.filter((t) => t.text.startsWith("x ")).length} done</span>
			</div>

			<div className="sidebar-content">
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
									label={getPriorityLabel(priority)}
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
							label={context}
							count={items.length}
							isActive={
								activeFilter?.type === "context" &&
								activeFilter?.value === context
							}
							onClick={() => handleFilterClick("context", context)}
							prefix="@"
						/>
					))}
				</SidebarSection>
			</div>
		</aside>
	);
};

export default Sidebar;
