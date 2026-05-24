const SYNC_TAG = "__sync__";
const EXCALIDRAW_KEY = "excalidraw-data";

interface ExcalidrawElement {
	id: string;
	type: string;
	x: number;
	y: number;
	width: number;
	height: number;
	text?: string;
	groupIds?: string[];
	[key: string]: unknown;
}

interface ExcalidrawData {
	elements: ExcalidrawElement[];
	appState: Record<string, unknown>;
	scrollToContent?: boolean;
}

export function syncTextToExcalidraw(htmlContent: string): void {
	if (!htmlContent || isEmptyHtml(htmlContent)) return;

	const lines = extractLinesFromHtml(htmlContent);
	if (lines.length === 0) return;

	const existing = loadExcalidrawData();
	const existingElements: ExcalidrawElement[] = existing?.elements ?? [];

	const nonSyncElements = existingElements.filter(
		(el) => !el.groupIds?.includes(SYNC_TAG),
	);

	const now = Date.now();
	const existingBottom = nonSyncElements.reduce(
		(max: number, el) => Math.max(max, (el.y || 0) + (el.height || 0)),
		0,
	);
	const syncStartY = existingBottom > 0 ? existingBottom + 20 : 50;

	const syncElements = lines.map((line, i) =>
		createTextElement(line, now + i, 100, syncStartY + i * 40),
	);

	const combined = [...nonSyncElements, ...syncElements];

	saveExcalidrawData({
		elements: combined,
		appState: existing?.appState ?? { zenModeEnabled: true },
		scrollToContent: true,
	});
}

export function syncExcalidrawToText(): string | null {
	const data = loadExcalidrawData();
	if (!data?.elements || data.elements.length === 0) return null;

	const userTextElements = data.elements
		.filter(
			(el) => el.type === "text" && el.text && !el.groupIds?.includes(SYNC_TAG),
		)
		.sort((a, b) => (a.y || 0) - (b.y || 0));

	if (userTextElements.length === 0) return null;

	const text = userTextElements
		.map((el) => escapeHtml(el.text || ""))
		.join("</p><p>");
	return `<p>${text}</p>`;
}

function isEmptyHtml(html: string): boolean {
	const trimmed = html.trim();
	return !trimmed || trimmed === "<p></p>" || trimmed === "<p><br></p>";
}

function extractLinesFromHtml(html: string): string[] {
	const text = html.replace(/<[^>]*>/g, "\n");
	return text
		.split("\n")
		.map((l) => l.trim())
		.filter((l) => l.length > 0);
}

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

function createTextElement(
	text: string,
	seed: number,
	x: number,
	y: number,
): ExcalidrawElement {
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

function saveExcalidrawData(data: ExcalidrawData): void {
	try {
		localStorage.setItem(EXCALIDRAW_KEY, JSON.stringify(data));
	} catch (error) {
		console.error("Failed to save Excalidraw sync data:", error);
	}
}

function loadExcalidrawData(): ExcalidrawData | null {
	try {
		const data = localStorage.getItem(EXCALIDRAW_KEY);
		return data ? JSON.parse(data) : null;
	} catch (e) {
		console.error("Failed to load Excalidraw sync data:", e);
		return null;
	}
}
