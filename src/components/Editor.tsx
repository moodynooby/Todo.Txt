import { Divider, Group, Menu, Tooltip } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import type { Editor as TipTapEditor } from "@tiptap/core";
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
import { useEditor } from "@/context/EditorContext";

interface EditorProps {
	editor: TipTapEditor | null;
	toolbarVariant?: "full" | "minimal" | "none";
	className?: string;
	style?: React.CSSProperties;
}

export function Editor({
	editor,
	toolbarVariant = "full",
	className,
	style,
}: EditorProps) {
	const context = useEditor();

	if (!editor) return null;

	return (
		<RichTextEditor editor={editor} className={className} style={style}>
			{toolbarVariant !== "none" && (
				<RichTextEditor.Toolbar
					style={
						toolbarVariant === "minimal"
							? { overflow: "auto", flexWrap: "nowrap" }
							: undefined
					}
				>
					<RichTextEditor.ControlsGroup>
						<RichTextEditor.H1 />
						<RichTextEditor.H2 />
						<RichTextEditor.H3 />
						<RichTextEditor.Bold />
						<RichTextEditor.Italic />
						<RichTextEditor.Underline />
						<RichTextEditor.Strikethrough />
					</RichTextEditor.ControlsGroup>

					<Divider orientation="vertical" />

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.BulletList />
						<RichTextEditor.OrderedList />
						<RichTextEditor.Blockquote />
						<RichTextEditor.Code />
						<RichTextEditor.Hr />
						<RichTextEditor.Undo />
						<RichTextEditor.Redo />
					</RichTextEditor.ControlsGroup>

					{toolbarVariant === "full" && (
						<>
							<Divider orientation="vertical" />

							<RichTextEditor.ControlsGroup>
								<RichTextEditor.Control
									onClick={() => editor.chain().focus().toggleTaskList().run()}
									active={editor.isActive("taskList")}
									aria-label="Toggle task list"
								>
									<Tooltip label="Toggle task list" position="top">
										<CheckSquare size={16} />
									</Tooltip>
								</RichTextEditor.Control>

								<RichTextEditor.Control
									onClick={context.onToggleSidebar}
									active={false}
									aria-label={
										context.sidebarCollapsed ? "Show filters" : "Hide filters"
									}
								>
									<Tooltip
										label={
											context.sidebarCollapsed ? "Show filters" : "Hide filters"
										}
										position="top"
									>
										<Filter size={16} />
									</Tooltip>
								</RichTextEditor.Control>

								<RichTextEditor.Control
									onClick={context.onOpen}
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
											onClick={() => context.onSave("markdown")}
										>
											Markdown
										</Menu.Item>
										<Menu.Item
											leftSection={<FileIcon size={14} />}
											onClick={() => context.onSave("text")}
										>
											Text
										</Menu.Item>
										<Menu.Item
											leftSection={<Code size={14} />}
											onClick={() => context.onSave("html")}
										>
											HTML
										</Menu.Item>
									</Menu.Dropdown>
								</Menu>

								<RichTextEditor.Control
									onClick={context.onAiTools}
									active={false}
									aria-label="AI Tools"
								>
									<Tooltip label="AI Tools" position="top">
										<Sparkles size={16} />
									</Tooltip>
								</RichTextEditor.Control>
							</RichTextEditor.ControlsGroup>
						</>
					)}
				</RichTextEditor.Toolbar>
			)}
			<RichTextEditor.Content />
		</RichTextEditor>
	);
}
