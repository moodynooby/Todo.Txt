import {
	ActionIcon,
	Group,
	Tooltip,
	useComputedColorScheme,
	useMantineColorScheme,
} from "@mantine/core";
import {
	Download,
	Maximize,
	Minimize,
	Moon,
	Sun,
	Wifi,
	WifiOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useInstallPrompt } from "../../hooks/useInstallPrompt";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";
import { useEditor } from "../../providers/EditorContext";
import { toggleFullscreen } from "../../utils/fullscreen";
import Help from "../Help/Help";

const HeaderActions = () => {
	const { setColorScheme } = useMantineColorScheme();
	const computedColorScheme = useComputedColorScheme("light");
	const [isFullscreen, setIsFullscreen] = useState(false);

	const { syncStatus, isSynced, onConnect, onDisconnectSync } = useEditor();
	const { isInstallable, install } = useInstallPrompt();
	const { isOnline } = useNetworkStatus();

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

	const syncIcon = () => {
		if (!isOnline) return <WifiOff size={14} />;
		switch (syncStatus) {
			case "connecting":
				return <Wifi size={14} />;
			case "synced":
				return <Wifi size={14} />;
			case "error":
				return <WifiOff size={14} />;
			default:
				return <WifiOff size={14} />;
		}
	};

	const syncColor = () => {
		if (!isOnline) return "red";
		switch (syncStatus) {
			case "connecting":
				return "yellow";
			case "synced":
				return "green";
			case "error":
				return "red";
			default:
				return "gray";
		}
	};

	return (
		<Group gap="xs">
			{syncStatus !== "disconnected" && (
				<Tooltip
					label={
						isSynced
							? "Synced. Click to disconnect"
							: syncStatus === "connecting"
								? "Connecting..."
								: "Sync error. Click to reconnect"
					}
					position="bottom"
				>
					<ActionIcon
						variant="subtle"
						size="lg"
						c={syncColor()}
						onClick={isSynced ? onDisconnectSync : onConnect}
						aria-label={isSynced ? "Disconnect sync" : "Reconnect sync"}
					>
						{syncIcon()}
					</ActionIcon>
				</Tooltip>
			)}

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

			<Help />
		</Group>
	);
};

export default HeaderActions;
