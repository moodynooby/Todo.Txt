import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import { useLocalStorage } from "@mantine/hooks";
import { useCallback, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import Timer from "./components/Timer/Timer";
import { useTimers } from "./hooks/useTimers";
import { MantineProvider } from "./providers/MantineProvider";
import { ViewModeContext } from "./providers/ViewModeContext";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);

root.render(<RootComponent />);

function RootComponent() {
	const [viewMode, setViewMode] = useLocalStorage({
		key: "viewMode",
		defaultValue: "text",
	});
	const { timers, addTimer, removeTimer, updateTimer } = useTimers();

	useEffect(() => {
		if (!("serviceWorker" in navigator)) return;

		let refreshing = false;
		navigator.serviceWorker.addEventListener("controllerchange", () => {
			if (refreshing) return;
			refreshing = true;
			window.location.reload();
		});

		const checkForUpdates = async () => {
			try {
				const reg = await navigator.serviceWorker.getRegistration();
				if (reg) await reg.update();
			} catch (e) {
				console.warn("Service worker update check failed:", e);
			}
		};

		const intervalId = setInterval(checkForUpdates, 30 * 60 * 1000);
		window.addEventListener("focus", checkForUpdates);

		return () => {
			clearInterval(intervalId);
			window.removeEventListener("focus", checkForUpdates);
		};
	}, []);

	const handleStateChange = useCallback(
		(
			id: number,
			elapsed: number,
			isActive: boolean,
			startTime: number | null,
		) => updateTimer(id, { elapsed, isActive, startTime }),
		[updateTimer],
	);

	const handlePositionChange = useCallback(
		(id: number, position: { top: number; left: number }) =>
			updateTimer(id, { position }),
		[updateTimer],
	);

	return (
		<MantineProvider>
			<ViewModeContext.Provider value={{ viewMode, setViewMode, addTimer }}>
				<ErrorBoundary>
					<App />
				</ErrorBoundary>
				{timers.map((timer) => (
					<Timer
						key={timer.id}
						timer={timer}
						onRemove={removeTimer}
						onStateChange={handleStateChange}
						onPositionChange={handlePositionChange}
					/>
				))}
			</ViewModeContext.Provider>
		</MantineProvider>
	);
}
