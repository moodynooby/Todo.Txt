const SYNC_TAG = "__sync__";

export interface ExcalidrawData {
	elements: readonly unknown[];
	appState: Record<string, unknown>;
	scrollToContent?: boolean;
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

export function syncTextToExcalidraw(
	textContent: string,
	elements: readonly unknown[],
	appState: Record<string, unknown>,
): { elements: readonly unknown[]; appState: Record<string, unknown> } {
	if (!textContent?.trim()) return { elements, appState };

	const lines = textContent
		.split("\n")
		.map((l) => l.trim())
		.filter((l) => l.length > 0);
	if (lines.length === 0) return { elements, appState };

	const existingElements = elements as Record<string, unknown>[];

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

	return {
		elements: [...nonSyncElements, ...syncElements],
		appState: { ...appState, zenModeEnabled: true },
	};
}

export function syncExcalidrawToText(
	elements: readonly unknown[],
): string | null {
	if (!elements || elements.length === 0) return null;

	const els = elements as Record<string, unknown>[];

	const userTextElements = els
		.filter(
			(el) =>
				el.type === "text" &&
				el.text &&
				!(el.groupIds as string[])?.includes(SYNC_TAG),
		)
		.sort((a, b) => ((a.y as number) || 0) - ((b.y as number) || 0));

	if (userTextElements.length === 0) return null;

	return userTextElements.map((el) => el.text as string).join("\n");
}
