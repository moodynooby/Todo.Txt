import type { Editor } from "@tiptap/core";
import { useCallback } from "react";
import { playBeep } from "../utils/beep";
import {
	saveAsHtml,
	saveAsMarkdown,
	saveAsText,
} from "../utils/documentExportService";

type SaveFormat = "markdown" | "text" | "html";

export const useDocumentSave = (editor: Editor | null, htmlContent: string) => {
	return useCallback(
		(format: SaveFormat) => {
			if (format !== "html" && !editor) return;
			const saveActions: Record<SaveFormat, () => void> = {
				markdown: () => saveAsMarkdown(editor ? editor.getMarkdown() : ""),
				text: () => saveAsText(editor ? editor.getText() : ""),
				html: () => saveAsHtml(htmlContent),
			};

			saveActions[format]();
			playBeep(150, 660);
		},
		[editor, htmlContent],
	);
};
