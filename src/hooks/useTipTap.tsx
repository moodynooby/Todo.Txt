import type { Editor } from "@tiptap/core";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "@tiptap/markdown";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import type { Filter } from "../types/todo";

interface UseTipTapProps {
	viewMode: string;
	activeFilter: Filter | null;
	initialContent: string;
	onContentChange: (content: string) => void;
}

interface UseTipTapReturn {
	editor: Editor | null;
}

export const useTipTap = ({
	viewMode,
	activeFilter,
	initialContent,
	onContentChange,
}: UseTipTapProps): UseTipTapReturn => {
	const shouldShowEditor = viewMode === "text" && !activeFilter;

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
		content: initialContent ? { type: "doc", content: [] } : "",
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

	useEffect(() => {
		if (!editor) return;

		if (shouldShowEditor && !initialContent) {
			editor.commands.clearContent();
		} else if (shouldShowEditor && initialContent && editor.isEmpty) {
			editor.commands.setContent(initialContent);
		}
	}, [editor, shouldShowEditor, initialContent]);

	return { editor };
};
