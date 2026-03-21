import { Button, Divider, Kbd, Menu, Tooltip } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import type { Editor } from "@tiptap/react";
import {
	ChevronDown,
	Code,
	File as FileIcon,
	FileText,
	FolderOpen,
	Save,
	Sparkles,
} from "lucide-react";

interface EditorToolbarProps {
	editor: Editor | null;
	onSave: (format: string) => void;
	onOpen: () => void;
	onAiTools: () => void;
}

export const EditorToolbar = ({
	onSave,
	onOpen,
	onAiTools,
}: EditorToolbarProps) => {
	return (
		<RichTextEditor.Toolbar sticky stickyOffset={60}>
			<RichTextEditor.ControlsGroup>
				<RichTextEditor.H1 />
				<RichTextEditor.H2 />
				<RichTextEditor.H3 />
			</RichTextEditor.ControlsGroup>

			<Divider orientation="vertical" />

			<RichTextEditor.ControlsGroup>
				<RichTextEditor.Bold />
				<RichTextEditor.Italic />
				<RichTextEditor.Underline />
				<RichTextEditor.Strikethrough />
			</RichTextEditor.ControlsGroup>

			<Divider orientation="vertical" />

			<RichTextEditor.ControlsGroup>
				<RichTextEditor.BulletList />
				<RichTextEditor.OrderedList />
			</RichTextEditor.ControlsGroup>

			<Divider orientation="vertical" />

			<RichTextEditor.ControlsGroup>
				<RichTextEditor.Blockquote />
				<RichTextEditor.Code />
				<RichTextEditor.CodeBlock />
			</RichTextEditor.ControlsGroup>

			<Divider orientation="vertical" />

			<RichTextEditor.ControlsGroup>
				<RichTextEditor.Link />
				<RichTextEditor.Unlink />
			</RichTextEditor.ControlsGroup>

			<Divider orientation="vertical" />

			<RichTextEditor.ControlsGroup>
				<RichTextEditor.Hr />
				<RichTextEditor.Undo />
				<RichTextEditor.Redo />
			</RichTextEditor.ControlsGroup>

			<Divider orientation="vertical" />

			<RichTextEditor.ControlsGroup>
				<RichTextEditor.Control
					onClick={onOpen}
					active={false}
					aria-label="Open file"
				>
					<Tooltip label="Open file (Ctrl+O)" position="top">
						<FolderOpen size={16} />
					</Tooltip>
				</RichTextEditor.Control>

				<Menu shadow="md" width={180} position="bottom-end">
					<Menu.Target>
						<RichTextEditor.Control active={false} aria-label="Save">
							<Button
								variant="subtle"
								size="compact-xs"
								px="xs"
								rightSection={<ChevronDown size={10} />}
								leftSection={<Save size={14} />}
							>
								Save
							</Button>
						</RichTextEditor.Control>
					</Menu.Target>

					<Menu.Dropdown>
						<Menu.Item
							leftSection={<FileText size={14} />}
							rightSection={<Kbd size="xs">M</Kbd>}
							onClick={() => onSave("markdown")}
						>
							Markdown
						</Menu.Item>
						<Menu.Item
							leftSection={<FileIcon size={14} />}
							rightSection={<Kbd size="xs">T</Kbd>}
							onClick={() => onSave("text")}
						>
							Text
						</Menu.Item>
						<Menu.Item
							leftSection={<Code size={14} />}
							rightSection={<Kbd size="xs">H</Kbd>}
							onClick={() => onSave("html")}
						>
							HTML
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>

				<RichTextEditor.Control
					onClick={onAiTools}
					active={false}
					aria-label="AI Tools"
				>
					<Tooltip label="AI Tools" position="top">
						<Sparkles size={16} />
					</Tooltip>
				</RichTextEditor.Control>
			</RichTextEditor.ControlsGroup>
		</RichTextEditor.Toolbar>
	);
};
