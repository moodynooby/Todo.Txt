import type { Editor } from "@tiptap/core";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "@tiptap/markdown";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback } from "react";

interface UseTipTapProps {
	initialContent: string;
	onContentChange: (content: string) => void;
}

interface UseTipTapReturn {
	editor: Editor | null;
	setExternalContent: (html: string) => void;
}

export const useTipTap = ({
	initialContent,
	onContentChange,
}: UseTipTapProps): UseTipTapReturn => {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3, 4, 5, 6],
				},
			}),
			Placeholder.configure({
				placeholder: "Start writing your todos...",
			}),
			Markdown.configure({
				markedOptions: {
					gfm: true,
					breaks: true,
				},
			}),
		],
		content: initialContent,
		editorProps: {
			attributes: {
				class: "tiptap-editor-content",
			},
		},
		onUpdate: ({ editor: currentEditor }) => {
			onContentChange(currentEditor.getHTML());
		},
		immediatelyRender: false,
	});

	const setExternalContent = useCallback(
		(html: string) => {
			if (!editor) return;
			editor.commands.setContent(html);
		},
		[editor],
	);

	return { editor, setExternalContent };
};
