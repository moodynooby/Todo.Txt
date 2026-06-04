import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MantineProvider } from "@/context/MantineProvider";
import App from "./App";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);
root.render(<RootComponent />);

function RootComponent() {
	return (
		<MantineProvider>
			<ErrorBoundary>
				<App />
			</ErrorBoundary>
		</MantineProvider>
	);
}
