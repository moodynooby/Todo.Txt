import { Box } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "../../providers/EditorContext";
import { EditorToolbar } from "../EditorToolbar/EditorToolbar";
import WelcomeScreen from "../WelcomeScreen/WelcomeScreen";

interface TextModeContentProps {
	showWelcome: boolean;
}

const TextModeContent = ({ showWelcome }: TextModeContentProps) => {
	const { editor, quickActions } = useEditor();

	return (
		<Box>
			{showWelcome ? (
				<WelcomeScreen quickActions={quickActions} />
			) : (
				<RichTextEditor editor={editor} className="tiptap-container">
					<EditorToolbar />
					<RichTextEditor.Content />
				</RichTextEditor>
			)}
		</Box>
	);
};

export default TextModeContent;
