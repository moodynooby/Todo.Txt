import { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Timer from "./components/Timer/Timer";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useLocalStorage } from "./hooks/useLocalStorage";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);

root.render(<RootComponent />);

if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register("/service-worker.js")
			.then((registration) => {
				registration.update().catch((error) => {
					console.error("ServiceWorker update check failed:", error);
				});
			})
			.catch((error) => {
				console.error("ServiceWorker registration failed: ", error);
			});
	});
}

function RootComponent() {
	const [viewMode, setViewMode] = useLocalStorage<string>("viewMode", "text");
	const [timers, setTimers] = useState<Array<{ id: number }>>([]);

	const addTimer = (): void => {
		setTimers([...timers, { id: Date.now() }]);
	};

	const removeTimer = (id: number): void => {
		setTimers(timers.filter((t) => t.id !== id));
	};

	return (
		<ThemeProvider>
			<App
				viewMode={viewMode}
				setViewMode={setViewMode}
				onAddTimer={addTimer}
			/>
			{timers.map((timer) => (
				<Timer key={timer.id} id={timer.id} onRemove={removeTimer} />
			))}
		</ThemeProvider>
	);
}
