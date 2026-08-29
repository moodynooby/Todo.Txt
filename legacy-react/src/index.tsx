import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import "@mantine/tiptap/styles.css";
import { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MantineProvider } from "@/context/MantineProvider";
import App from "./App";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement,
);
root.render(<RootComponent />);

function RootComponent() {
	useEffect(dismissSplash, []);

	return (
		<MantineProvider>
			<ErrorBoundary>
				<App />
			</ErrorBoundary>
		</MantineProvider>
	);
}

function dismissSplash(): () => void {
	const splash = document.getElementById("splash");
	if (!splash) return () => undefined;

	const remove = (): void => splash.remove();
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		remove();
		return () => undefined;
	}
	splash.classList.add("splash-hide");
	const timeout = window.setTimeout(remove, 300);
	return () => window.clearTimeout(timeout);
}
