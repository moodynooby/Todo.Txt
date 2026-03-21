import { Box, useComputedColorScheme } from "@mantine/core";
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
}

const TextModeContent = ({
	editor,
	showWelcome,
	quickActions,
	onSave,
	onOpen,
	onAiTools,
}: TextModeContentProps) => {
	const computedColorScheme = useComputedColorScheme("light");
	const isDark = computedColorScheme === "dark";

	return (
		<Box className="rte-editor-container">
			{showWelcome ? (
				<WelcomeScreen quickActions={quickActions} />
			) : (
				<RichTextEditor
					editor={editor}
					className={`tiptap-container tiptap-theme-${isDark ? "dark" : "light"}`}
				>
					<EditorToolbar
						onSave={onSave}
						onOpen={onOpen}
						onAiTools={onAiTools}
					/>
					<RichTextEditor.Content />
				</RichTextEditor>
			)}
		</Box>
	);
};

export default TextModeContent;
