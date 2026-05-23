import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface InstallPromptReturn {
	isInstallable: boolean;
	isInstalled: boolean;
	install: () => Promise<void>;
}

export const useInstallPrompt = (): InstallPromptReturn => {
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);
	const [isInstalled, setIsInstalled] = useState(false);

	useEffect(() => {
		const handleBeforeInstall = (e: Event) => {
			e.preventDefault();
			setDeferredPrompt(e as BeforeInstallPromptEvent);
		};

		const handleInstalled = () => {
			setIsInstalled(true);
			setDeferredPrompt(null);
		};

		const isAlreadyInstalled = matchMedia("(display-mode: standalone)").matches;

		if (isAlreadyInstalled) {
			setIsInstalled(true);
		}

		window.addEventListener("beforeinstallprompt", handleBeforeInstall);
		window.addEventListener("appinstalled", handleInstalled);

		return () => {
			window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
			window.removeEventListener("appinstalled", handleInstalled);
		};
	}, []);

	const install = useCallback(async () => {
		if (!deferredPrompt) return;
		deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		if (outcome === "accepted") {
			setIsInstalled(true);
		}
		setDeferredPrompt(null);
	}, [deferredPrompt]);

	return {
		isInstallable: !!deferredPrompt,
		isInstalled,
		install,
	};
};
