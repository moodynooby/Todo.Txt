import { Box } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "../../providers/EditorContext";
import type { Filter, ParsedTodoContent } from "../../types/todo";
import { EditorToolbar } from "../EditorToolbar/EditorToolbar";
import Sidebar from "../Sidebar/Sidebar";

interface TextModeContentProps {
	taskData: ParsedTodoContent;
	activeFilter: Filter | null;
	onFilterChange: (filter: Filter | null) => void;
}

const TextModeContent = ({
	taskData,
	activeFilter,
	onFilterChange,
}: TextModeContentProps) => {
	const { editor, sidebarCollapsed, onToggleSidebar } = useEditor();

	if (!editor) return null;

	return (
		<Box
			style={{
				display: "flex",
				flexDirection: "row",
				flex: 1,
				minHeight: 0,
				overflow: "hidden",
			}}
		>
			<Box
				style={{
					flexShrink: 0,
					width: sidebarCollapsed
						? "var(--sidebar-collapsed-width)"
						: "var(--sidebar-width)",
				}}
			>
				<Sidebar
					isCollapsed={sidebarCollapsed}
					onToggle={onToggleSidebar}
					taskData={taskData}
					activeFilter={activeFilter}
					onFilterChange={onFilterChange}
				/>
			</Box>
			<Box
				style={{
					display: "flex",
					flexDirection: "column",
					flex: 1,
					minWidth: 0,
				}}
			>
				<RichTextEditor
					editor={editor}
					className="tiptap-container"
					style={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						minHeight: 0,
					}}
				>
					<EditorToolbar />
					<RichTextEditor.Content />
				</RichTextEditor>
			</Box>
		</Box>
	);
};

export default TextModeContent;
