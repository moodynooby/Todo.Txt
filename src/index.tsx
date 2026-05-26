import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MantineProvider } from "@/context/MantineProvider";
import { ViewModeContext } from "@/context/ViewModeContext";
import Timer from "@/features/timer/Timer";
import { useTimers } from "@/hooks/useTimers";
import App from "./App";

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

	return (
		<MantineProvider>
			<ViewModeContext.Provider value={{ viewMode, setViewMode }}>
				<ErrorBoundary>
					<App addTimer={addTimer} />
					{timers.map((timer) => (
						<Timer
							key={timer.id}
							timer={timer}
							onRemove={removeTimer}
							onUpdate={updateTimer}
						/>
					))}
				</ErrorBoundary>
			</ViewModeContext.Provider>
		</MantineProvider>
	);
}
