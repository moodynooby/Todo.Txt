import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import { useLocalStorage } from "@mantine/hooks";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MantineProvider } from "@/context/MantineProvider";
import { ViewModeContext } from "@/context/ViewModeContext";
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
