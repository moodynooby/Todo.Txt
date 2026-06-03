import type { Editor } from "@tiptap/core";
import { useEditor } from "@tiptap/react";
import { useCallback, useRef } from "react";
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
	const isExternalUpdate = useRef(false);
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
			if (!isExternalUpdate.current) {
				onContentChange(currentEditor.getMarkdown());
			}
			isExternalUpdate.current = false;
		},
		immediatelyRender: false,
	});

	const setExternalContent = useCallback(
		(html: string) => {
			if (!editor) return;
			isExternalUpdate.current = true;
			editor.commands.setContent(html, { emitUpdate: true });
		},
		[editor],
	);

	return { editor, setExternalContent };
};
