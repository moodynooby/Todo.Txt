import { saveAs } from "file-saver";
import TurndownService from "turndown";

export interface SaveFormatConfig {
	filename: string;
	mimeType: string;
	transform: ((content: string) => string) | null;
}

export interface ExcalidrawData {
	elements: unknown[];
	appState: {
		collaborators?: unknown[] | Record<string, unknown>;
		zenModeEnabled?: boolean;
	};
	scrollToContent?: boolean;
}

export interface ExcalidrawStorageConfig {
	key: string;
	delay: number;
}

/**
 * Save format configuration
 */
export const SAVE_FORMATS: Record<string, SaveFormatConfig> = {
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

/**
 * Excalidraw storage configuration
 */
export const EXCALIDRAW_STORAGE: ExcalidrawStorageConfig = {
	key: "excalidraw-data",
	delay: 1000,
};

// Initialize Turndown service for HTML to Markdown conversion
const turndownService = new TurndownService({
	headingStyle: "atx",
	bulletListMarker: "-",
	codeBlockStyle: "fenced",
	fence: "```",
	emDelimiter: "*",
	strongDelimiter: "**",
	linkStyle: "inlined",
});

// Add custom rules for Turndown
turndownService.addRule("strikethrough", {
	filter: ["s", "del"],
	replacement: (content) => `~~${content}~~`,
});

turndownService.addRule("underline", {
	filter: ["u"],
	replacement: (content) => content,
});

/**
 * Downloads content as a file with proper MIME type
 */
export const downloadFile = (
	content: string,
	filename: string,
	mimeType: string,
): void => {
	const blob = new Blob([content], { type: mimeType });
	saveAs(blob, filename);
};

/**
 * Converts HTML content to Markdown
 */
export const htmlToMarkdown = (htmlContent: string): string => {
	return turndownService.turndown(htmlContent);
};

SAVE_FORMATS.markdown.transform = htmlToMarkdown;

/**
 * Generic save function for different formats
 */
export const saveToFile = (
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

/**
 * Saves content as Markdown file
 */
export const saveAsMarkdown = (
	htmlContent: string,
	filename: string | null = null,
): void => {
	saveToFile(htmlContent, "markdown", filename);
};

/**
 * Saves content as plain text file
 */
export const saveAsText = (
	textContent: string,
	filename: string | null = null,
): void => {
	saveToFile(textContent, "text", filename);
};

/**
 * Saves content as HTML file
 */
export const saveAsHtml = (
	htmlContent: string,
	filename: string | null = null,
): void => {
	saveToFile(htmlContent, "html", filename);
};

/**
 * Creates a debounced save function for Excalidraw data
 */
export const createExcalidrawSaver = (
	onSaveCallback?: (data: string) => void,
) => {
	let timeoutId: ReturnType<typeof setTimeout> | undefined;

	const debouncedSave = (elements: unknown[], appState: unknown): void => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			try {
				const data = JSON.stringify({ elements, appState });
				localStorage.setItem(EXCALIDRAW_STORAGE.key, data);
				if (onSaveCallback) {
					onSaveCallback(data);
				}
			} catch (error) {
				console.error("Failed to save Excalidraw data:", error);
			}
		}, EXCALIDRAW_STORAGE.delay);
	};

	debouncedSave.cancel = () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
	};

	return debouncedSave;
};

/**
 * Loads Excalidraw data from localStorage
 */
export const loadExcalidrawData = (): ExcalidrawData | undefined => {
	try {
		const data = localStorage.getItem(EXCALIDRAW_STORAGE.key);
		if (data) {
			const parsedData = JSON.parse(data) as ExcalidrawData;
			// Ensure collaborators is an array
			if (parsedData.appState) {
				if (!parsedData.appState.collaborators) {
					parsedData.appState.collaborators = [];
				} else if (!Array.isArray(parsedData.appState.collaborators)) {
					parsedData.appState.collaborators = Object.values(
						parsedData.appState.collaborators,
					);
				}
			} else {
				parsedData.appState = { collaborators: [] };
			}
			return {
				...parsedData,
				appState: { ...parsedData.appState, zenModeEnabled: true },
				scrollToContent: true,
			};
		}
	} catch (error) {
		console.error("Failed to load Excalidraw data:", error);
	}
	return {
		elements: [],
		appState: { zenModeEnabled: true },
		scrollToContent: true,
	};
};

/**
 * Clears Excalidraw data from localStorage
 */
export const clearExcalidrawData = (): void => {
	try {
		localStorage.removeItem(EXCALIDRAW_STORAGE.key);
	} catch (error) {
		console.error("Failed to clear Excalidraw data:", error);
	}
};

/**
 * Save service object that provides a unified API for all save operations
 */
const saveService = {
	saveAsMarkdown,
	saveAsText,
	saveAsHtml,
	saveToFile,
	downloadFile,
	createExcalidrawSaver,
	loadExcalidrawData,
	clearExcalidrawData,
	SAVE_FORMATS,
	EXCALIDRAW_STORAGE,
	htmlToMarkdown,
};

export default saveService;
