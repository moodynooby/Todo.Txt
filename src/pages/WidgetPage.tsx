/** Field Notes Ritual: host page for the floating desktop widgets.
 *
 * Each widget window loads this single route (`/widget/todo`,
 * `/widget/overview`, `/widget/habits`) with zero app chrome — no header,
 * no sidebar, no bottom nav — so the card fills the frameless,
 * transparent, always-on-top window the Rust plugin creates. The widget
 * receives live data over the `desktop-widget-data` event from the Rust
 * plugin, which forwards the frontend's own projection (the same one the
 * Android home-screen widgets render from).
 *
 * Web/PWA fallback: outside a Tauri shell the widgets render the local
 * backup mirror so the route stays previewable in a browser.
 */
import { useEffect, useState } from "react";
import HabitsWidget from "@/components/DesktopWidgets/HabitsWidget";
import OverviewWidget from "@/components/DesktopWidgets/OverviewWidget";
import TodoWidget from "@/components/DesktopWidgets/TodoWidget";
import { MantineProvider } from "@/context/MantineProvider";
import { useDesktopWidgetData } from "@/hooks/useDesktopWidgetData";

const WIDGET_MAP: Record<string, React.ComponentType> = {
	todo: TodoWidget,
	overview: OverviewWidget,
	habits: HabitsWidget,
};

/** Detect the widget name from the route — the Rust plugin opens
 * `http://localhost:5173/widget/{name}`, and the built bundle serves the
 * same route. */
function readWidgetName(): string {
	const name = window.location.pathname.replace("/widget/", "").trim();
	if (name && WIDGET_MAP[name]) return name;
	// Fallback for direct browser visits.
	return "todo";
}

const WidgetPage = () => {
	const [name] = useState(readWidgetName());
	const Widget = WIDGET_MAP[name];
	useDesktopWidgetData();

	// Keep the widget window crisp on HiDPI: the frameless window is fixed
	// size, so force the document to fill it exactly.
	useEffect(() => {
		document.body.style.margin = "0";
		document.body.style.background = "transparent";
		document.body.style.overscrollBehavior = "none";
	}, []);

	return (
		<MantineProvider>
			<div
				style={{
					width: "100vw",
					height: "100vh",
					background: "transparent",
					overflow: "hidden",
				}}
			>
				<Widget />
			</div>
		</MantineProvider>
	);
};

export default WidgetPage;
