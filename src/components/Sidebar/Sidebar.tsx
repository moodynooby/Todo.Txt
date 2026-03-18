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

	return (
		<li>
			<button
				type="button"
				onClick={onClick}
				className={`flex items-center gap-2 w-full px-3 py-2 rounded-md transition-colors ${
					isActive ? "bg-primary/10" : "hover:bg-base-300"
				}`}
				style={
					isActive && type === "priority"
						? { backgroundColor: `${priorityColor}20` }
						: {}
				}
			>
				{type === "priority" ? (
					<span
						className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
						style={{
							backgroundColor: `${priorityColor}30`,
							color: priorityColor,
						}}
					>
						{value}
					</span>
				) : (
					<span
						className={`${type === "project" ? "text-primary" : type === "context" ? "text-context" : ""} font-medium`}
					>
						{prefix}
					</span>
				)}
				<span className="flex-1 text-left text-sm">{label}</span>
				<span className="text-xs opacity-50">{count}</span>
			</button>
		</li>
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
	<div className="mb-2">
		<button
			type="button"
			onClick={() => onToggle(id)}
			className="w-full flex justify-between items-center px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-base-300 rounded-md transition-colors"
		>
			<span>
				{title} {expandedSections.has(id) ? "▼" : "▶"}
			</span>
		</button>
		{expandedSections.has(id) && (
			<ul className="menu w-full mt-1">
				{isEmpty ? (
					<li className="text-sm italic opacity-50 px-3 py-2">
						{emptyMessage}
					</li>
				) : (
					children
				)}
			</ul>
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
		className={`w-9 h-9 rounded-md flex items-center justify-center font-bold text-sm transition-colors ${
			isActive ? "bg-opacity-30" : "bg-base-300"
		}`}
		style={{
			color: getPriorityColor(priority),
			backgroundColor: isActive ? `${getPriorityColor(priority)}30` : undefined,
		}}
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

	const clearFilter = (): void => {
		onFilterChange(null);
	};

	if (isCollapsed) {
		return (
			<aside className="sidebar collapsed bg-base-200 border-r border-base-300 fixed top-12 left-0 bottom-7 z-50 w-[60px] min-w-[60px] shadow-sidebar">
				<div className="sidebar-header collapsed p-2 flex justify-center border-b border-base-300">
					<button
						type="button"
						onClick={onToggle}
						className="btn btn-ghost btn-xs"
					>
						<ChevronRight size={16} />
					</button>
				</div>
				<div className="collapsed-priority-container p-2 flex flex-col gap-2">
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
		<aside className="sidebar expanded bg-base-200 border-r border-base-300 fixed top-12 left-0 bottom-7 z-50 w-[280px] min-w-[280px] shadow-sidebar overflow-hidden">
			<div className="sidebar-header p-3 flex justify-between items-center border-b border-base-300">
				<div className="flex items-center gap-2">
					<Filter size={14} />
					<span className="text-xs font-bold uppercase tracking-wider">
						Filters
					</span>
				</div>
				<button
					type="button"
					onClick={onToggle}
					className="btn btn-ghost btn-xs"
				>
					<ChevronLeft size={16} />
				</button>
			</div>

			{activeFilter && (
				<div className="alert alert-primary py-2 px-4 rounded-none border-none">
					<span className="text-sm">
						{activeFilter.type === "priority" &&
							`Priority ${activeFilter.value}`}
						{activeFilter.type === "project" && `+${activeFilter.value}`}
						{activeFilter.type === "context" && `@${activeFilter.value}`}
					</span>
					<button
						onClick={clearFilter}
						type="button"
						className="btn btn-ghost btn-xs"
					>
						<X size={14} />
					</button>
				</div>
			)}

			<div className="text-xs px-3 py-2 border-b border-base-300 flex justify-between opacity-70">
				<span>{tasks.length} tasks</span>
				<span>{tasks.filter((t) => t.text.startsWith("x ")).length} done</span>
			</div>

			<div className="sidebar-content overflow-auto p-2">
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
