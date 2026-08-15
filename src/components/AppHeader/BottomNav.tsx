import { Image, Paper, Text } from "@mantine/core";
import BroomIcon from "@/assets/3dicons-broom-dynamic-color.webp";
import NotebookIcon from "@/assets/3dicons-notebook-dynamic-color.webp";
import DrawingIcon from "@/assets/3dicons-painting-kit-dynamic-color.webp";
import TicIcon from "@/assets/3dicons-tick-dynamic-color.webp";
import { useViewContext } from "@/context/ViewContext";

/**
 * M3 Expressive bottom navigation — mobile only (`visibleFrom` hidden below).
 *
 * Follows the Material 3 bottom app bar pattern: a fixed bar with a sliding
 * indicator pill behind the selected label, 44dp+ touch targets, and per-tab
 * icon + label rows. On desktop the header segmented switcher takes over, so
 * this component renders nothing above `md`.
 */

const TABS = [
	{
		value: "todo",
		label: "Todo",
		icon: TicIcon,
	},
	{
		value: "habits",
		label: "Habits",
		icon: BroomIcon,
	},
	{
		value: "notes",
		label: "Notes",
		icon: NotebookIcon,
	},
	{
		value: "excalidraw",
		label: "Draw",
		icon: DrawingIcon,
	},
];

const BottomNav = () => {
	const { state: viewState, dispatchView } = useViewContext();
	const viewMode = viewState.viewMode;
	const setViewMode = (mode: string) =>
		dispatchView({ type: "SET_VIEW_MODE", payload: mode });

	return (
		<Paper
			component="nav"
			aria-label="Main navigation"
			className="bottom-nav app-surface"
			shadow="lg"
			radius={0}
			hiddenFrom="md"
			style={{
				position: "fixed",
				left: 0,
				right: 0,
				bottom: 0,
				zIndex: 150,
				borderTop: "1px solid var(--app-border)",
				display: "grid",
				gridTemplateColumns: `repeat(${TABS.length}, 1fr)`,
			}}
		>
			{TABS.map((tab) => {
				const active = tab.value === viewMode;
				return (
					<button
						key={tab.value}
						type="button"
						aria-current={active ? "page" : undefined}
						className="bottom-nav-item"
						onClick={() => setViewMode(tab.value)}
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: 2,
							padding: "10px 0 12px",
							minHeight: 62,
							border: "none",
							background: "transparent",
							color: active ? "var(--app-ink)" : "var(--app-ink-muted)",
							cursor: "pointer",
							transition:
								"color 160ms var(--m3-ease-effects), transform 120ms var(--m3-ease-spatial-fast)",
						}}
					>
						{/* M3 indicator pill: the 3D icon sits centered inside the
							rounded slot, raised surface when active (like the
							reference Airbnb-style bottom bar). */}
						<span
							className={active ? "bottom-nav-indicator" : undefined}
							style={{
								borderRadius: "var(--m3-radius-pill)",
								padding: "4px 16px",
								background: active ? "var(--app-surface-muted)" : "transparent",
								boxShadow: active ? "0 2px 8px rgb(23 61 53 / 14%)" : "none",
								transition:
									"background-color 180ms var(--m3-ease-effects), box-shadow 180ms var(--m3-ease-effects)",
								display: "inline-flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Image
								src={tab.icon}
								w={26}
								h={26}
								alt={tab.label}
								style={{ display: "block" }}
							/>
						</span>
						<Text
							size="xs"
							fw={active ? 700 : 500}
							style={{
								lineHeight: 1.2,
								transition: "color 160ms var(--m3-ease-effects)",
							}}
						>
							{tab.label}
						</Text>
					</button>
				);
			})}
		</Paper>
	);
};

export default BottomNav;
