import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/code-highlight/styles.css";
import "@mantine/tiptap/styles.css";
import { useLocalStorage } from "@mantine/hooks";
import { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Timer from "./components/Timer/Timer";
import { MantineProvider } from "./providers/MantineProvider";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);

root.render(<RootComponent />);

function RootComponent() {
	const [viewMode, setViewMode] = useLocalStorage({
		key: "viewMode",
		defaultValue: "text",
	});
	const [timers, setTimers] = useState<Array<{ id: number }>>([]);

	const addTimer = (): void => {
		setTimers([...timers, { id: Date.now() }]);
	};

	const removeTimer = (id: number): void => {
		setTimers(timers.filter((t) => t.id !== id));
	};

	return (
		<MantineProvider>
			<App
				viewMode={viewMode}
				setViewMode={setViewMode}
				onAddTimer={addTimer}
			/>
			{timers.map((timer) => (
				<Timer key={timer.id} id={timer.id} onRemove={removeTimer} />
			))}
		</MantineProvider>
	);
}
