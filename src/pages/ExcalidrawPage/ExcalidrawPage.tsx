import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import { useEffect, useMemo, useState } from "react";
import "./ExcalidrawPage.css";
import "@excalidraw/excalidraw/index.css";
import FullscreenToggle, {
	toggleFullscreen,
} from "../../components/FullscreenToggle";
import { useTheme } from "../../contexts/ThemeContext";
import saveService from "../../utils/saveService";

const FullscreenIcon = () => {
	return <FullscreenToggle />;
};

const ExcalidrawPage = () => {
	const { isDark } = useTheme();
	const [excalidrawTheme, setExcalidrawTheme] = useState("light");
	const UIOptions = {
		canvasActions: {
			export: false,
			toggleTheme: false,
		},
		welcomeScreen: false,
	};
	useEffect(() => {
		setExcalidrawTheme(isDark ? "dark" : "light");
	}, [isDark]);

	const onSave = useMemo(() => saveService.createExcalidrawSaver(), []);

	useEffect(() => {
		return () => {
			onSave.cancel();
		};
	}, [onSave]);

	const initialData = useMemo(() => {
		return saveService.loadExcalidrawData();
	}, []);

	return (
		<div className="ExcalidrawPage">
			<Excalidraw
				theme={excalidrawTheme as "light" | "dark"}
				// @ts-expect-error - Excalidraw UIOptions type is overly strict
				UIOptions={UIOptions}
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
						<FullscreenIcon />
						Fullscreen
					</MainMenu.Item>
				</MainMenu>
			</Excalidraw>
		</div>
	);
};

export default ExcalidrawPage;
