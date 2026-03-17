import PropTypes from "prop-types";

const FilteredView = ({ activeFilter, filteredTasks, onClearFilter }) => {
	if (!activeFilter) return null;

	return (
		<div className="filtered-view p-4">
			<h2 className="text-xl font-bold mb-4">
				Filtered Results:{" "}
				{activeFilter.type === "priority"
					? `Priority ${activeFilter.value}`
					: activeFilter.value}
			</h2>
			<div className="flex flex-col gap-2">
				{filteredTasks.map((task) => (
					<div
						key={task.id}
						className="p-2 bg-base-200 rounded border border-base-300"
					>
						{task.raw}
					</div>
				))}
				{filteredTasks.length === 0 && (
					<p className="italic opacity-50">No tasks match this filter.</p>
				)}
			</div>
			<button
				className="btn btn-sm btn-outline mt-4"
				onClick={onClearFilter}
			>
				Clear Filter to Edit
			</button>
		</div>
	);
};

FilteredView.propTypes = {
	activeFilter: PropTypes.shape({
		type: PropTypes.string,
		value: PropTypes.string,
	}),
	filteredTasks: PropTypes.array.isRequired,
	onClearFilter: PropTypes.func.isRequired,
};

export default FilteredView;
