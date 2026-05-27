import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import { useCallback, useRef } from "react";
import "./ExcalidrawPage.css";
import "@excalidraw/excalidraw/index.css";
import { Box, useComputedColorScheme } from "@mantine/core";
import type { ExcalidrawData } from "@/lib/excalidrawSync";
import { toggleFullscreen } from "@/lib/fullscreen";

const EXCALIDRAW_UI_OPTIONS = {
	canvasActions: { export: false, toggleTheme: false },
	welcomeScreen: false,
} as const;

interface ExcalidrawPageProps {
	initialData: ExcalidrawData | null;
	onChange: (data: ExcalidrawData | null) => void;
}

const ExcalidrawPage = ({ initialData, onChange }: ExcalidrawPageProps) => {
	const excalidrawTheme =
		useComputedColorScheme("dark") === "dark" ? "dark" : "light";
	const onChangeRef = useRef(onChange);
	onChangeRef.current = onChange;

	// Track content hashes to detect real changes vs re-render noise.
	// This prevents the "Maximum update depth exceeded" error caused by
	// Excalidraw firing onChange after receiving the same data back.
	const elementsHashRef = useRef("");
	const appStateHashRef = useRef("");
	// Skip Excalidraw's immediate onChange re-fire after initialData is set
	const isMountedRef = useRef(false);

	const handleChange = useCallback(
		(elements: readonly unknown[], appState: unknown) => {
			// Excalidraw fires onChange once on mount with initialData.
			// Skip that first call to avoid reflecting our own data back.
			if (!isMountedRef.current) {
				isMountedRef.current = true;
				// Still record the hash so subsequent real changes are detected
				elementsHashRef.current = JSON.stringify(elements);
				appStateHashRef.current = JSON.stringify(appState);
				return;
			}

			const elementsHash = JSON.stringify(elements);
			const appStateHash = JSON.stringify(appState);

			// Skip if nothing actually changed — breaks the infinite loop
			if (
				elementsHash === elementsHashRef.current &&
				appStateHash === appStateHashRef.current
			) {
				return;
			}

			elementsHashRef.current = elementsHash;
			appStateHashRef.current = appStateHash;

			const data: ExcalidrawData = {
				elements,
				appState: appState as Record<string, unknown>,
			};
			onChangeRef.current(data);
		},
		[],
	);

	return (
		<Box className="ExcalidrawPage">
			<Excalidraw
				theme={excalidrawTheme}
				UIOptions={EXCALIDRAW_UI_OPTIONS}
				onChange={handleChange}
				// @ts-expect-error - Excalidraw initialData type is overly strict
				initialData={initialData ?? undefined}
			>
				<MainMenu>
					<MainMenu.DefaultItems.LoadScene />
					<MainMenu.DefaultItems.SearchMenu />
					<MainMenu.DefaultItems.ClearCanvas />
					<MainMenu.DefaultItems.SaveAsImage />
					<MainMenu.Item onClick={() => toggleFullscreen()}>
						Fullscreen
					</MainMenu.Item>
				</MainMenu>
			</Excalidraw>
		</Box>
	);
};

export default ExcalidrawPage;
