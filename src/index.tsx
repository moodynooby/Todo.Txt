import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import { useLocalStorage } from "@mantine/hooks";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MantineProvider } from "@/context/MantineProvider";
import { ViewModeContext } from "@/context/ViewModeContext";
import {
	defaults,
	type PersistedState,
	STORAGE_KEY,
} from "@/lib/persistedState";
import App from "./App";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);
root.render(<RootComponent />);

function RootComponent() {
	const [persisted, setPersisted] = useLocalStorage<PersistedState>({
		key: STORAGE_KEY,
		defaultValue: defaults,
	});

	const viewMode = persisted.viewMode;
	const setViewMode = (mode: string) =>
		setPersisted((p) => ({ ...p, viewMode: mode }));

	return (
		<MantineProvider>
			<ViewModeContext.Provider value={{ viewMode, setViewMode }}>
				<ErrorBoundary>
					<App />
				</ErrorBoundary>
			</ViewModeContext.Provider>
		</MantineProvider>
	);
}
