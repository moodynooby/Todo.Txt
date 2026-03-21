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
