import { saveAs } from "file-saver";

interface SaveFormatConfig {
	filename: string;
	mimeType: string;
	transform: ((content: string) => string) | null;
}

const SAVE_FORMATS: Record<string, SaveFormatConfig> = {
	markdown: {
		filename: "todo.md",
		mimeType: "text/markdown",
		transform: null,
	},
	text: {
		filename: "todo.txt",
		mimeType: "text/plain",
		transform: (content) => content,
	},
	html: {
		filename: "todo.html",
		mimeType: "text/html",
		transform: (content) => content,
	},
};

const downloadFile = (
	content: string,
	filename: string,
	mimeType: string,
): void => {
	const blob = new Blob([content], { type: mimeType });
	saveAs(blob, filename);
};

const saveToFile = (
	content: string,
	format = "text",
	customFilename: string | null = null,
): void => {
	const config = SAVE_FORMATS[format];
	if (!config) {
		console.warn(`Unknown save format: ${format}`);
		return;
	}

	const filename = customFilename || config.filename;
	const transformedContent = config.transform?.(content) ?? content;
	downloadFile(transformedContent, filename, config.mimeType);
};

export const saveAsMarkdown = (
	htmlContent: string,
	filename: string | null = null,
): void => {
	saveToFile(htmlContent, "markdown", filename);
};

export const saveAsText = (
	textContent: string,
	filename: string | null = null,
): void => {
	saveToFile(textContent, "text", filename);
};

export const saveAsHtml = (
	htmlContent: string,
	filename: string | null = null,
): void => {
	saveToFile(htmlContent, "html", filename);
};
