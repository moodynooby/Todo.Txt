import type { Editor } from "@tiptap/core";
import { useEditor } from "@tiptap/react";
import { useCallback } from "react";
import { getEditorExtensions } from "@/utils/editorExtensions";

interface UseTipTapProps {
	initialContent: string;
	onContentChange: (content: string) => void;
	onFilterClick?: (type: string, value: string) => void;
}

interface UseTipTapReturn {
	editor: Editor | null;
	setExternalContent: (html: string) => void;
}

export const useTipTap = ({
	initialContent,
	onContentChange,
	onFilterClick,
}: UseTipTapProps): UseTipTapReturn => {
	const editor = useEditor({
		extensions: getEditorExtensions({
			placeholder: "Start writing your todos...",
			onFilterClick,
		}),
		content: initialContent,
		contentType: "markdown",
		shouldRerenderOnTransaction: true,
		editorProps: {
			attributes: {
				class: "tiptap-editor-content",
			},
		},
		onUpdate: ({ editor: currentEditor }) => {
			onContentChange(currentEditor.getMarkdown());
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
