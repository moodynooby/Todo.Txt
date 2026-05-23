import { Box, Text } from "@mantine/core";
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
				<>
					<RichTextEditor editor={editor} className="tiptap-container">
						<EditorToolbar />
						<RichTextEditor.Content />
					</RichTextEditor>
					<Text size="xs" c="dimmed" ta="center" pt="xs">
						Tip: Use{" "}
						<Text component="span" inherit fw={600}>
							(A)
						</Text>{" "}
						for priority,{" "}
						<Text component="span" inherit fw={600}>
							+project
						</Text>{" "}
						for projects,{" "}
						<Text component="span" inherit fw={600}>
							@context
						</Text>{" "}
						for contexts
					</Text>
				</>
			)}
		</Box>
	);
};

export default TextModeContent;
