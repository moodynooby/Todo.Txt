import { useEditor } from "@tiptap/react";
import { useEffect, useRef } from "react";
import { Editor } from "@/components/Editor";
import { getEditorExtensions } from "@/utils/editorExtensions";

interface NoteCardEditorProps {
	content: string;
	onChange: (md: string) => void;
}

const NoteCardEditor = ({ content, onChange }: NoteCardEditorProps) => {
	const lastMarkdownRef = useRef(content);

	const editor = useEditor({
		extensions: getEditorExtensions({
			headingLevels: [1, 2, 3],
			placeholder: "Take a note...",
		}),
		content: content || "",
		contentType: "markdown",
		shouldRerenderOnTransaction: true,
		onUpdate: ({ editor: currentEditor }) => {
			const md = currentEditor.getMarkdown();
			lastMarkdownRef.current = md;
			onChange(md);
		},
		immediatelyRender: false,
	});

	useEffect(() => {
		if (editor && content !== lastMarkdownRef.current) {
			lastMarkdownRef.current = content;
			editor.commands.setContent(content || "");
		}
	}, [content, editor]);

	return (
		<Editor
			editor={editor}
			toolbarVariant="minimal"
			className="NotesPage-noteCard-editor"
			style={{ "--note-text-color": "#000" } as React.CSSProperties}
		/>
	);
};

export default NoteCardEditor;
