import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import { useLocalStorage } from "@mantine/hooks";
import ReactDOM from "react-dom/client";
import App from "./App";
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

	return (
		<MantineProvider>
			<ViewModeContext.Provider value={{ viewMode, setViewMode, addTimer }}>
				<App />
				{timers.map((timer) => (
					<Timer
						key={timer.id}
						timer={timer}
						onRemove={removeTimer}
						onStateChange={(id, elapsed, isActive, startTime) =>
							updateTimer(id, { elapsed, isActive, startTime })
						}
						onPositionChange={(id, position) => updateTimer(id, { position })}
					/>
				))}
			</ViewModeContext.Provider>
		</MantineProvider>
	);
}
