import {
	ActionIcon,
	Group,
	Tooltip,
	useComputedColorScheme,
	useMantineColorScheme,
} from "@mantine/core";
import { Download, Maximize, Minimize, Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toggleFullscreen } from "@/lib/fullscreen";
import ConnectionButton from "./ConnectionButton";

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const HeaderActions = () => {
	const { setColorScheme } = useMantineColorScheme();
	const computedColorScheme = useComputedColorScheme("light");
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);

	useEffect(() => {
		const handleBeforeInstall = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e as BeforeInstallPromptEvent);
		};
		const handleInstalled = () => setDeferredPrompt(null);
		window.addEventListener("beforeinstallprompt", handleBeforeInstall);
		window.addEventListener("appinstalled", handleInstalled);
		return () => {
			window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
			window.removeEventListener("appinstalled", handleInstalled);
		};
	}, []);

	const install = useCallback(async () => {
		if (!deferredPrompt) return;
		try {
			await deferredPrompt.prompt();
		} catch (e) {
			console.error("Install prompt failed:", e);
			setDeferredPrompt(null);
			return;
		}
		const { outcome } = await deferredPrompt.userChoice;
		if (outcome === "accepted") setDeferredPrompt(null);
		setDeferredPrompt(null);
	}, [deferredPrompt]);

	const isInstallable = !!deferredPrompt;

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
						hiddenFrom="sm"
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
					hiddenFrom="sm"
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
