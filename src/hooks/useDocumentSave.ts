import type { Editor } from "@tiptap/core";
import { useCallback } from "react";
import { playBeep } from "@/utils/beep";
import {
	saveAsHtml,
	saveAsMarkdown,
	saveAsText,
} from "@/utils/documentExportService";

type SaveFormat = "markdown" | "text" | "html";

export const useDocumentSave = (editor: Editor | null) => {
	return useCallback(
		(format: SaveFormat) => {
			if (!editor) return;
			const saveActions: Record<SaveFormat, () => void> = {
				markdown: () => saveAsMarkdown(editor.getMarkdown()),
				text: () => saveAsText(editor.getText()),
				html: () => saveAsHtml(editor.getHTML()),
			};

			saveActions[format]();
			playBeep(150, 660);
		},
		[editor],
	);
};
