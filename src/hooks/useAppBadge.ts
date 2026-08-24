import { useEffect } from "react";

/** Reflect the open-task count as an app-icon badge (Badging API). Installed
 * PWA users see pending work without opening the app — same signal the
 * native widgets provide. Silently no-ops where unsupported. */
export const useAppBadge = (openCount: number): void => {
	useEffect(() => {
		const nav = navigator as Navigator & {
			setAppBadge?: (n?: number) => Promise<void>;
			clearAppBadge?: () => Promise<void>;
		};
		if (typeof nav.setAppBadge !== "function") return;
		if (openCount > 0) {
			nav.setAppBadge(openCount).catch(() => undefined);
		} else if (typeof nav.clearAppBadge === "function") {
			nav.clearAppBadge().catch(() => undefined);
		}
	}, [openCount]);
};
