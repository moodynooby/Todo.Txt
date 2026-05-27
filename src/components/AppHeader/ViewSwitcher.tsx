import { Image, SegmentedControl, Tooltip } from "@mantine/core";
import NotebookIcon from "@/assets/3dicons-notebook-dynamic-color.webp";
import DrawingIcon from "@/assets/3dicons-painting-kit-dynamic-color.webp";
import TicIcon from "@/assets/3dicons-tick-dynamic-color.webp";
import { useViewMode } from "@/context/ViewModeContext";

const ViewSwitcher = () => {
	const { viewMode, setViewMode } = useViewMode();

	return (
		<SegmentedControl
			value={viewMode}
			onChange={setViewMode}
			data={[
				{
					value: "todo",
					label: (
						<Tooltip label="Todo List" position="bottom">
							<Image src={TicIcon} w={24} h={24} alt="Todo list" />
						</Tooltip>
					),
				},
				{
					value: "notes",
					label: (
						<Tooltip label="Notes" position="bottom">
							<Image src={NotebookIcon} w={24} h={24} alt="Notes" />
						</Tooltip>
					),
				},
				{
					value: "excalidraw",
					label: (
						<Tooltip label="Drawing Canvas" position="bottom">
							<Image src={DrawingIcon} w={24} h={24} alt="Drawing canvas" />
						</Tooltip>
					),
				},
			]}
			size="xs"
		/>
	);
};

export default ViewSwitcher;
