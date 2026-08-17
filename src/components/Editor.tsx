import { Group, Menu, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { RichTextEditor } from "@mantine/tiptap";
import type { Editor as TipTapEditor } from "@tiptap/core";
import {
	CheckSquare,
	ChevronDown,
	Code,
	File as FileIcon,
	FileText,
	FolderOpen,
	GitBranch,
	Save,
	Sparkles,
} from "lucide-react";
import { useEffect } from "react";
import SmartSuggestionChips from "@/components/SmartSuggestionChips";

import type { SaveFormat } from "@/lib/documentExport";

/**
 * M3 Expressive writing surface with a playfulness layer:
 *
 * - Adaptive icon-first toolbar (collapses on narrow screens)
 * - Warm cycling placeholder instead of a static void
 * - Pet companion strip, task-rhythm dots, and line/copy animations
 *   live in the `EditorPlay` wrapper layer, so the TipTap content stays pure.
 */

interface EditorProps {
	editor: TipTapEditor | null;
	toolbarVariant?: "full" | "minimal" | "none";
	className?: string;
	style?: React.CSSProperties;
	onSave?: (format: SaveFormat) => void;
	onOpen?: () => void;
	onAiTools?: () => void;
	onAdvancedTools?: () => void;
	/* Playfulness layer */
	playLayer?: React.ReactNode;
	warmPlaceholder?: string;
}

export function Editor({
	editor,
	toolbarVariant = "full",
	className,
	style,
	onSave,
	onOpen,
	onAiTools,
	onAdvancedTools,
	playLayer,
	warmPlaceholder,
}: EditorProps) {
	// On narrow screens the toolbar collapses to essentials (M3 adaptive
	// toolbar pattern): rich formatting is still reachable via keyboard
	// shortcuts, keeping the writing surface prominent.
	const isNarrow = useMediaQuery("(max-width: 640px)");
	const isMinimal = toolbarVariant === "minimal" || isNarrow;

	// Inject the warm placeholder text into TipTap's empty-node placeholder.
	// When the empty-state art is showing (truly bare doc), the TipTap default
	// placeholder is hidden so the warm prompt is the only voice.
	useEffect(() => {
		if (!editor || editor.isDestroyed) return;
		const ext = editor.extensionManager.extensions.find(
			(e) => e.name === "placeholder",
		);
		if (ext?.options) ext.options.placeholder = warmPlaceholder;
		// Force TipTap to re-render the placeholder after mutating options.
		editor.view.dispatch(
			editor.state.tr.setMeta("placeholder", warmPlaceholder),
		);
	}, [editor, warmPlaceholder]);

	if (!editor) return null;

	return (
		<RichTextEditor
			editor={editor}
			className={className}
			style={style}
			classNames={{
				root: "editor-playful-root",
				content: "editor-playful-content",
			}}
		>
			{toolbarVariant !== "none" && (
				<RichTextEditor.Toolbar
					className="toolbar-playful"
					style={
						isMinimal
							? {
									overflowX: "auto",
									overflowY: "hidden",
									flexWrap: "nowrap",
									WebkitOverflowScrolling: "touch",
								}
							: undefined
					}
				>
					{/* Text formatting — hero moments use emphasized controls */}
					<RichTextEditor.ControlsGroup>
						<RichTextEditor.H1 />
						<RichTextEditor.H2 />
						<RichTextEditor.Bold />
						<RichTextEditor.Italic />
						{!isMinimal && (
							<>
								<RichTextEditor.Underline />
								<RichTextEditor.Strikethrough />
							</>
						)}
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.BulletList />
						<RichTextEditor.OrderedList />
						{!isMinimal && (
							<>
								<RichTextEditor.Blockquote />
								<RichTextEditor.Code />
							</>
						)}
					</RichTextEditor.ControlsGroup>

					{/* Task list gets the emphasized primary slot */}
					<RichTextEditor.ControlsGroup>
						<RichTextEditor.Control
							onClick={() => editor.chain().focus().toggleTaskList().run()}
							active={editor.isActive("taskList")}
							aria-label="Toggle task list"
						>
							<Tooltip label="Toggle task list" position="top" withArrow>
								<CheckSquare size={16} />
							</Tooltip>
						</RichTextEditor.Control>
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.Undo />
						<RichTextEditor.Redo />
					</RichTextEditor.ControlsGroup>

					{toolbarVariant === "full" && (
						<RichTextEditor.ControlsGroup>
							<RichTextEditor.Control
								onClick={onOpen}
								active={false}
								aria-label="Open file"
							>
								<Tooltip label="Open file (Ctrl+O)" position="top" withArrow>
									<FolderOpen size={16} />
								</Tooltip>
							</RichTextEditor.Control>

							<Menu shadow="md" width={180} position="bottom-end" withArrow>
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
										onClick={() => onSave?.("markdown")}
									>
										Markdown
									</Menu.Item>
									<Menu.Item
										leftSection={<FileIcon size={14} />}
										onClick={() => onSave?.("text")}
									>
										Text
									</Menu.Item>
									<Menu.Item
										leftSection={<Code size={14} />}
										onClick={() => onSave?.("html")}
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
								<Tooltip label="AI Tools" position="top" withArrow>
									<Sparkles size={16} />
								</Tooltip>
							</RichTextEditor.Control>

							<RichTextEditor.Control
								onClick={onAdvancedTools}
								active={false}
								aria-label="Advanced task tools"
							>
								<Tooltip label="Advanced task tools" position="top" withArrow>
									<GitBranch size={16} />
								</Tooltip>
							</RichTextEditor.Control>
						</RichTextEditor.ControlsGroup>
					)}

					<div
						className="editor-smart-suggestions"
						style={{
							maxWidth: "100%",
							overflowX: "auto",
							overflowY: "hidden",
							WebkitOverflowScrolling: "touch",
						}}
					>
						<SmartSuggestionChips editor={editor} />
					</div>
				</RichTextEditor.Toolbar>
			)}

			{/* Playfulness layer wraps the writing surface so TipTap stays pure */}
			{playLayer}
		</RichTextEditor>
	);
}
