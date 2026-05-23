import { Image, SegmentedControl, Tooltip } from "@mantine/core";
import { useViewMode } from "../../providers/ViewModeContext";
import DrawinIcon from "../Assets/3dicons-painting-kit-dynamic-color.png";
import PencilIcon from "../Assets/3dicons-pencil-dynamic-color.png";

const ViewSwitcher = () => {
	const { viewMode, setViewMode } = useViewMode();

	return (
		<SegmentedControl
			value={viewMode}
			onChange={setViewMode}
			data={[
				{
					value: "text",
					label: (
						<Tooltip label="Text Editor" position="bottom">
							<Image src={PencilIcon} w={24} h={24} alt="Text editor" />
						</Tooltip>
					),
				},
				{
					value: "excalidraw",
					label: (
						<Tooltip label="Drawing Canvas" position="bottom">
							<Image src={DrawinIcon} w={24} h={24} alt="Drawing canvas" />
						</Tooltip>
					),
				},
			]}
			size="xs"
		/>
	);
};

export default ViewSwitcher;
