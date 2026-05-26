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

	const handleChange = useCallback(
		(elements: readonly unknown[], appState: unknown) => {
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
