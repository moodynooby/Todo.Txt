import { Anchor, Box, Group, Stack, Text } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { BookOpen } from "lucide-react";
import { useEditor } from "../../providers/EditorContext";
import { EditorToolbar } from "../EditorToolbar/EditorToolbar";

const TipsPanel = () => (
	<Stack gap={4} px="md" py="xs">
		<Text size="xs" c="dimmed" fw={600}>
			Tips
		</Text>
		<Group gap="xs" wrap="wrap">
			<Text size="xs" c="dimmed" component="span">
				<Text component="span" inherit fw={600}>
					(A)
				</Text>{" "}
				priority
			</Text>
			<Text size="xs" c="dimmed" component="span">
				<Text component="span" inherit fw={600}>
					+project
				</Text>{" "}
				group
			</Text>
			<Text size="xs" c="dimmed" component="span">
				<Text component="span" inherit fw={600}>
					@context
				</Text>{" "}
				category
			</Text>
			<Text size="xs" c="dimmed" component="span">
				<Text component="span" inherit fw={600}>
					due:today
				</Text>{" "}
				deadline
			</Text>
			<Text size="xs" c="dimmed" component="span">
				<Text component="span" inherit fw={600}>
					[ ] / [x]
				</Text>{" "}
				checklist
			</Text>
			<Text size="xs" c="dimmed" component="span">
				<Text component="span" inherit fw={600}>
					Ctrl+O
				</Text>{" "}
				open file
			</Text>
			<Text size="xs" c="dimmed" component="span">
				<Text component="span" inherit fw={600}>
					Ctrl+M/T/H
				</Text>{" "}
				save
			</Text>
			<Anchor
				href="https://github.com/todotxt/todo.txt"
				target="_blank"
				rel="noreferrer"
				size="xs"
			>
				<Group gap={4} wrap="nowrap">
					<BookOpen size={12} />
					<Text component="span" inherit size="xs">
						todo.txt spec
					</Text>
				</Group>
			</Anchor>
		</Group>
	</Stack>
);

const TextModeContent = () => {
	const { editor } = useEditor();

	return (
		<Box>
			<RichTextEditor editor={editor} className="tiptap-container">
				<EditorToolbar />
				<RichTextEditor.Content />
			</RichTextEditor>
			<TipsPanel />
		</Box>
	);
};

export default TextModeContent;
