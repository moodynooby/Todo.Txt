import { Box } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import type { Editor } from "@tiptap/core";
import type { QuickAction } from "../../types/ui";
import { EditorToolbar } from "../EditorToolbar/EditorToolbar";
import WelcomeScreen from "../WelcomeScreen/WelcomeScreen";

interface TextModeContentProps {
	editor: Editor | null;
	showWelcome: boolean;
	quickActions: QuickAction[];
	onSave: (format: "markdown" | "text" | "html") => void;
	onOpen: () => void;
	onAiTools: () => void;
	sidebarCollapsed?: boolean;
	onToggleSidebar?: () => void;
}

const TextModeContent = ({
	editor,
	showWelcome,
	quickActions,
	onSave,
	onOpen,
	onAiTools,
	sidebarCollapsed,
	onToggleSidebar,
}: TextModeContentProps) => {
	return (
		<Box>
			{showWelcome ? (
				<WelcomeScreen quickActions={quickActions} />
			) : (
				<RichTextEditor editor={editor} className="tiptap-container">
					<EditorToolbar
						onSave={onSave}
						onOpen={onOpen}
						onAiTools={onAiTools}
						sidebarCollapsed={sidebarCollapsed}
						onToggleSidebar={onToggleSidebar}
					/>
					<RichTextEditor.Content />
				</RichTextEditor>
			)}
		</Box>
	);
};

export default TextModeContent;
