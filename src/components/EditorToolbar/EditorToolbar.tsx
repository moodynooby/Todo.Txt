import { Divider, Group, Menu, Tooltip } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import {
	CheckSquare,
	ChevronDown,
	Code,
	File as FileIcon,
	FileText,
	Filter,
	FolderOpen,
	Save,
	Sparkles,
} from "lucide-react";
import { useEditor } from "../../providers/EditorContext";
export const EditorToolbar = () => {
	const {
		onSave,
		onOpen,
		onAiTools,
		sidebarCollapsed,
		onToggleSidebar,
		editor,
	} = useEditor();

	return (
		<RichTextEditor.Toolbar>
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
					onClick={() => editor?.chain().focus().insertContent("[ ] ").run()}
					active={false}
					aria-label="Insert checkbox"
				>
					<Tooltip label="Insert [ ] checkbox" position="top">
						<CheckSquare size={16} />
					</Tooltip>
				</RichTextEditor.Control>

				<RichTextEditor.Control
					onClick={onToggleSidebar}
					active={false}
					aria-label={sidebarCollapsed ? "Show filters" : "Hide filters"}
				>
					<Tooltip
						label={sidebarCollapsed ? "Show filters" : "Hide filters"}
						position="top"
					>
						<Filter size={16} />
					</Tooltip>
				</RichTextEditor.Control>

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
						<RichTextEditor.Control active={false} aria-label="Save as">
							<Group gap={4} wrap="nowrap">
								<Save size={14} />
								<ChevronDown size={10} />
							</Group>
						</RichTextEditor.Control>
					</Menu.Target>

					<Menu.Dropdown>
						<Menu.Item
							leftSection={<FileText size={14} />}
							onClick={() => onSave("markdown")}
						>
							Markdown
						</Menu.Item>
						<Menu.Item
							leftSection={<FileIcon size={14} />}
							onClick={() => onSave("text")}
						>
							Text
						</Menu.Item>
						<Menu.Item
							leftSection={<Code size={14} />}
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
