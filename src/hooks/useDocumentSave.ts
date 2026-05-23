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
			const saveActions: Record<SaveFormat, () => void> = {
				markdown: () => saveAsMarkdown(editor?.getHTML() || ""),
				text: () => saveAsText(editor?.getText() || ""),
				html: () => saveAsHtml(htmlContent),
			};

			saveActions[format]();
			playBeep(150, 660);
		},
		[editor, htmlContent],
	);
};
