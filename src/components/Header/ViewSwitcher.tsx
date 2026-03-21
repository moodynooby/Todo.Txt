import { Image, SegmentedControl, Tooltip } from "@mantine/core";
import DrawinIcon from "../Assets/3dicons-painting-kit-dynamic-color.png";
import PencilIcon from "../Assets/3dicons-pencil-dynamic-color.png";

interface ViewSwitcherProps {
	value: string;
	onChange: (value: string) => void;
}

const ViewSwitcher = ({ value, onChange }: ViewSwitcherProps) => {
	return (
		<SegmentedControl
			value={value}
			onChange={onChange}
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
