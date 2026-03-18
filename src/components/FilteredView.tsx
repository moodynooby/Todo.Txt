import type { Filter, Task } from "../utils/filterUtils";

interface FilteredViewProps {
	activeFilter: Filter | null;
	filteredTasks: Task[];
	onClearFilter: () => void;
}

const FilteredView = ({
	activeFilter,
	filteredTasks,
	onClearFilter,
}: FilteredViewProps) => {
	if (!activeFilter) return null;

	const filterName =
		activeFilter.type === "priority"
			? `Priority ${activeFilter.value}`
			: activeFilter.type === "project"
				? `+${activeFilter.value}`
				: `@${activeFilter.value}`;

	return (
		<div className="p-4">
			<div className="alert alert-info mb-4">
				<span>Filtered: {filterName}</span>
				<button
					type="button"
					onClick={onClearFilter}
					className="btn btn-ghost btn-xs"
				>
					Clear
				</button>
			</div>

			<div className="flex flex-col gap-2">
				{filteredTasks.map((task) => (
					<div
						key={task.id}
						className="card bg-base-200 border border-base-300"
					>
						<div className="card-body p-3">
							<p className="font-mono text-sm">{task.raw}</p>
						</div>
					</div>
				))}
			</div>

			{filteredTasks.length === 0 && (
				<div className="alert alert-warning mt-4">
					<span>No tasks match this filter</span>
				</div>
			)}

			<button
				type="button"
				className="btn btn-outline btn-sm mt-4"
				onClick={onClearFilter}
			>
				Clear Filter to Edit
			</button>
		</div>
	);
};

export default FilteredView;
