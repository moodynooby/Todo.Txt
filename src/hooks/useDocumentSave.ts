import type { Editor } from "@tiptap/core";
import { useCallback } from "react";
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
				markdown: () => saveAsMarkdown(editor?.getMarkdown() || ""),
				text: () => saveAsText(editor?.getText() || ""),
				html: () => saveAsHtml(htmlContent),
			};

			saveActions[format]();
		},
		[editor, htmlContent],
	);
};
