/** Field Notes Ritual: Habits joins Todo, Notes, and Drawing as a first-class workspace. */

import { Image, SegmentedControl, Tooltip } from "@mantine/core";
import BroomIcon from "@/assets/3dicons-broom-dynamic-color.webp";
import NotebookIcon from "@/assets/3dicons-notebook-dynamic-color.webp";
import DrawingIcon from "@/assets/3dicons-painting-kit-dynamic-color.webp";
import TicIcon from "@/assets/3dicons-tick-dynamic-color.webp";
import { useViewContext } from "@/context/ViewContext";

const TABS = [
	{ value: "todo", label: "Todo", src: TicIcon, tooltip: "Todo List" },
	{ value: "habits", label: "Habits", src: BroomIcon, tooltip: "Habits" },
	{ value: "notes", label: "Notes", src: NotebookIcon, tooltip: "Notes" },
	{
		value: "excalidraw",
		label: "Draw",
		src: DrawingIcon,
		tooltip: "Drawing Canvas",
	},
];

const ViewSwitcher = () => {
	const { state: viewState, dispatchView } = useViewContext();
	const viewMode = viewState.viewMode;
	const setViewMode = (mode: string) =>
		dispatchView({ type: "SET_VIEW_MODE", payload: mode });

	return (
		<SegmentedControl
			value={viewMode}
			onChange={setViewMode}
			style={{ minWidth: 320, flexShrink: 0 }}
			size="sm"
			data={TABS.map((tab) => ({
				value: tab.value,
				label: (
					<Tooltip key={tab.value} label={tab.tooltip} position="bottom">
						<div
							style={{
								display: "inline-flex",
								alignItems: "center",
								justifyContent: "center",
								gap: 6,
								whiteSpace: "nowrap",
							}}
						>
							<Image src={tab.src} w={18} h={18} alt={tab.label} />
							<span style={{ lineHeight: 1 }}>{tab.label}</span>
						</div>
					</Tooltip>
				),
			}))}
		/>
	);
};

export default ViewSwitcher;
