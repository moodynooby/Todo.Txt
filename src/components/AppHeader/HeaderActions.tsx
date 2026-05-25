import {
	ActionIcon,
	Group,
	Tooltip,
	useComputedColorScheme,
	useMantineColorScheme,
} from "@mantine/core";
import { Download, Maximize, Minimize, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useInstallPrompt } from "../../hooks/useInstallPrompt";
import { toggleFullscreen } from "../../utils/fullscreen";
import ConnectionButton from "./ConnectionButton";

const HeaderActions = () => {
	const { setColorScheme } = useMantineColorScheme();
	const computedColorScheme = useComputedColorScheme("light");
	const [isFullscreen, setIsFullscreen] = useState(false);

	const { isInstallable, install } = useInstallPrompt();

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
			<ConnectionButton />

			{isInstallable && (
				<Tooltip label="Install app" position="bottom">
					<ActionIcon
						variant="subtle"
						size="lg"
						onClick={install}
						aria-label="Install app"
					>
						<Download size={20} />
					</ActionIcon>
				</Tooltip>
			)}

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
		</Group>
	);
};

export default HeaderActions;
