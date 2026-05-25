const SYNC_TAG = "__sync__";

export interface ExcalidrawData {
	elements: unknown[];
	appState: {
		collaborators?: unknown[] | Record<string, unknown>;
		zenModeEnabled?: boolean;
	};
	scrollToContent?: boolean;
}

const EXCALIDRAW_STORAGE = {
	key: "excalidraw-data",
	delay: 1000,
};

type ExcalidrawSaver = ((elements: unknown[], appState: unknown) => void) & {
	cancel: () => void;
};

export const createExcalidrawSaver = (
	onSaveCallback?: (data: string) => void,
): ExcalidrawSaver => {
	let timeoutId: ReturnType<typeof setTimeout> | undefined;

	const debouncedSave = ((elements: unknown[], appState: unknown): void => {
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			try {
				const data = JSON.stringify({ elements, appState });
				localStorage.setItem(EXCALIDRAW_STORAGE.key, data);
				onSaveCallback?.(data);
			} catch (error) {
				console.error("Failed to save Excalidraw data:", error);
			}
		}, EXCALIDRAW_STORAGE.delay);
	}) as ExcalidrawSaver;

	debouncedSave.cancel = () => {
		if (timeoutId) clearTimeout(timeoutId);
	};

	return debouncedSave;
};

export const loadExcalidrawData = (): ExcalidrawData | undefined => {
	try {
		const data = localStorage.getItem(EXCALIDRAW_STORAGE.key);
		if (data) {
			const parsedData = JSON.parse(data) as ExcalidrawData;
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

function extractLinesFromHtml(html: string): string[] {
	const text = html.replace(/<[^>]*>/g, "\n");
	return text
		.split("\n")
		.map((l) => l.trim())
		.filter((l) => l.length > 0);
}

function isEmptyHtml(html: string): boolean {
	const trimmed = html.trim();
	return !trimmed || trimmed === "<p></p>" || trimmed === "<p><br></p>";
}

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function createSyncTextElement(
	text: string,
	seed: number,
	x: number,
	y: number,
) {
	return {
		id: `sync-text-${seed}`,
		type: "text",
		x,
		y,
		width: 400,
		height: 25,
		text,
		fontSize: 20,
		fontFamily: 1,
		textAlign: "left",
		verticalAlign: "top",
		containerId: null,
		originalText: text,
		autoResize: true,
		lineHeight: 1.25,
		groupIds: [SYNC_TAG],
		strokeColor: "#1e1e1e",
		backgroundColor: "transparent",
		fillStyle: "solid",
		strokeWidth: 2,
		strokeStyle: "solid",
		roughness: 1,
		opacity: 100,
		angle: 0,
		seed,
		version: 1,
		versionNonce: 0,
		isDeleted: false,
		boundElements: null,
		updated: Date.now(),
		link: null,
		locked: false,
		roundness: null,
		frameId: null,
		customData: undefined,
	};
}

function loadRawExcalidrawData() {
	try {
		const data = localStorage.getItem(EXCALIDRAW_STORAGE.key);
		return data ? JSON.parse(data) : null;
	} catch {
		return null;
	}
}

function saveRawExcalidrawData(data: unknown) {
	try {
		localStorage.setItem(EXCALIDRAW_STORAGE.key, JSON.stringify(data));
	} catch (e) {
		console.error("Failed to save Excalidraw data:", e);
	}
}

export function syncTextToExcalidraw(htmlContent: string): void {
	if (!htmlContent || isEmptyHtml(htmlContent)) return;

	const lines = extractLinesFromHtml(htmlContent);
	if (lines.length === 0) return;

	const existing = loadRawExcalidrawData() as Record<string, unknown> | null;
	const existingElements = (existing?.elements ?? []) as Record<
		string,
		unknown
	>[];

	const nonSyncElements = existingElements.filter(
		(el) => !(el.groupIds as string[])?.includes(SYNC_TAG),
	);

	const now = Date.now();
	const existingBottom = nonSyncElements.reduce(
		(max, el) =>
			Math.max(max, ((el.y as number) || 0) + ((el.height as number) || 0)),
		0,
	);
	const syncStartY = existingBottom > 0 ? existingBottom + 20 : 50;

	const syncElements = lines.map((line, i) =>
		createSyncTextElement(line, now + i, 100, syncStartY + i * 40),
	);

	const combined = [...nonSyncElements, ...syncElements];

	saveRawExcalidrawData({
		elements: combined,
		appState: existing?.appState ?? { zenModeEnabled: true },
		scrollToContent: true,
	});
}

export function syncExcalidrawToText(): string | null {
	const data = loadRawExcalidrawData() as Record<string, unknown> | null;
	if (
		!data?.elements ||
		!Array.isArray(data.elements) ||
		data.elements.length === 0
	)
		return null;

	const elements = data.elements as Record<string, unknown>[];

	const userTextElements = elements
		.filter(
			(el) =>
				el.type === "text" &&
				el.text &&
				!(el.groupIds as string[])?.includes(SYNC_TAG),
		)
		.sort((a, b) => ((a.y as number) || 0) - ((b.y as number) || 0));

	if (userTextElements.length === 0) return null;

	const text = userTextElements
		.map((el) => escapeHtml(el.text as string))
		.join("</p><p>");
	return `<p>${text}</p>`;
}
