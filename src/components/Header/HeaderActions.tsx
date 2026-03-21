import {
	ActionIcon,
	Group,
	Tooltip,
	useComputedColorScheme,
	useMantineColorScheme,
} from "@mantine/core";
import { Maximize, Minimize, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { toggleFullscreen } from "../../utils/fullscreen";
import Help from "../Help/Help";

const HeaderActions = () => {
	const { setColorScheme } = useMantineColorScheme();
	const computedColorScheme = useComputedColorScheme("light");
	const [isFullscreen, setIsFullscreen] = useState(false);

	const isDark = computedColorScheme === "dark";

	const toggleTheme = () => {
		setColorScheme(isDark ? "light" : "dark");
	};

	useEffect(() => {
		const handleFullscreenChange = (): void => {
			setIsFullscreen(!!document.fullscreenElement);
		};
		document.addEventListener("fullscreenchange", handleFullscreenChange);
		return () => {
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
		};
	}, []);

	return (
		<Group gap="xs">
			<Tooltip label={isDark ? "Light mode" : "Dark mode"} position="bottom">
				<ActionIcon
					variant="subtle"
					size="lg"
					onClick={toggleTheme}
					aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
				>
					{isDark ? <Sun size={20} /> : <Moon size={20} />}
				</ActionIcon>
			</Tooltip>

			<Tooltip
				label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
				position="bottom"
			>
				<ActionIcon
					variant="subtle"
					size="lg"
					onClick={toggleFullscreen}
					aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
				>
					{isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
				</ActionIcon>
			</Tooltip>

			<Help />
		</Group>
	);
};

export default HeaderActions;
