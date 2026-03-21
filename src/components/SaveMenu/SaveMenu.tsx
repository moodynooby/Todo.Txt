import { Button, Kbd, Menu } from "@mantine/core";
import { ChevronDown, Code, File as FileIcon, FileText } from "lucide-react";

interface SaveMenuProps {
	onSave: (format: string) => void;
}

const SaveMenu = ({ onSave }: SaveMenuProps) => {
	return (
		<Menu shadow="md" width={200} position="bottom-end">
			<Menu.Target>
				<Button
					variant="filled"
					size="compact-sm"
					rightSection={<ChevronDown size={14} />}
				>
					Save
				</Button>
			</Menu.Target>

			<Menu.Dropdown>
				<Menu.Item
					leftSection={<FileText size={16} />}
					rightSection={<Kbd size="xs">M</Kbd>}
					onClick={() => onSave("markdown")}
				>
					Markdown
				</Menu.Item>
				<Menu.Item
					leftSection={<FileIcon size={16} />}
					rightSection={<Kbd size="xs">T</Kbd>}
					onClick={() => onSave("text")}
				>
					Text
				</Menu.Item>
				<Menu.Item
					leftSection={<Code size={16} />}
					rightSection={<Kbd size="xs">H</Kbd>}
					onClick={() => onSave("html")}
				>
					HTML
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
};

export default SaveMenu;
