import type { Editor } from "@tiptap/core";
import { useEditor } from "@tiptap/react";
import { useEffect, useRef } from "react";
import { getEditorExtensions } from "@/utils/editorExtensions";

interface UseTipTapProps {
	content: string;
	onContentChange: (content: string) => void;
	onFilterClick?: (type: string, value: string) => void;
}

interface UseTipTapReturn {
	editor: Editor | null;
}

// TODO: Internalize inside TodoContext — App.tsx should not call this directly.
export const useTipTap = ({
	content,
	onContentChange,
	onFilterClick,
}: UseTipTapProps): UseTipTapReturn => {
	const lastMarkdownRef = useRef(content);

	const editor = useEditor({
		extensions: getEditorExtensions({
			placeholder: "Start writing your todos...",
			onFilterClick,
		}),
		content: content || "",
		contentType: "markdown",
		onUpdate: ({ editor: currentEditor }) => {
			const md = currentEditor.getMarkdown();
			lastMarkdownRef.current = md;
			onContentChange(md);
		},
		immediatelyRender: false,
	});

	useEffect(() => {
		if (editor && content !== lastMarkdownRef.current) {
			lastMarkdownRef.current = content;
			editor.commands.setContent(content || "");
		}
	}, [content, editor]);

	return { editor };
};
