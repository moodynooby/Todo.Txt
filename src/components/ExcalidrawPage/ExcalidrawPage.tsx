import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import { useEffect, useMemo } from "react";
import "./ExcalidrawPage.css";
import "@excalidraw/excalidraw/index.css";
import { Box, useComputedColorScheme } from "@mantine/core";
import {
	createExcalidrawSaver,
	loadExcalidrawData,
} from "../../utils/excalidrawStorageService";
import { toggleFullscreen } from "../../utils/fullscreen";

const EXCALIDRAW_UI_OPTIONS = {
	canvasActions: {
		export: false,
		toggleTheme: false,
	},
	welcomeScreen: false,
};

const ExcalidrawPage = () => {
	const excalidrawTheme =
		useComputedColorScheme("dark") === "dark" ? "dark" : "light";

	const onSave = useMemo(() => createExcalidrawSaver(), []);

	useEffect(() => {
		return () => {
			onSave.cancel();
		};
	}, [onSave]);

	const initialData = useMemo(() => {
		return loadExcalidrawData();
	}, []);

	return (
		<Box className="ExcalidrawPage">
			<Excalidraw
				theme={excalidrawTheme}
				// @ts-expect-error - Excalidraw UIOptions type is overly strict
				UIOptions={EXCALIDRAW_UI_OPTIONS}
				// @ts-expect-error - Excalidraw onChange signature expects readonly arrays
				onChange={onSave}
				// @ts-expect-error - Excalidraw initialData type is overly strict
				initialData={initialData}
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
