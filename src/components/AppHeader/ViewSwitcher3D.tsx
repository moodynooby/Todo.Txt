/**
 * M3 icon-only pill switcher with 3D icons — used on compact widths
 * (38em → md) where the full segmented switcher would overflow the header.
 *
 * Each 3D icon sits centered inside its own square pill slot, so the bar
 * reads as a clean row of centered icons with the active one on a raised
 * pill (the M3 indicator treatment), exactly like the desktop segmented
 * control but with only imagery, no labels.
 */

import { Image, Paper, Tooltip } from "@mantine/core";
import { useViewContext } from "@/context/ViewContext";
import { VIEW_TABS } from "./viewTabs";

const ViewSwitcher3D = () => {
	const { state: viewState, dispatchView } = useViewContext();
	const viewMode = viewState.viewMode;
	const setViewMode = (mode: string) =>
		dispatchView({ type: "SET_VIEW_MODE", payload: mode });

	return (
		<Paper
			radius="xl"
			withBorder
			p={2}
			style={{
				display: "inline-flex",
				alignItems: "center",
				gap: 2,
				background: "var(--app-surface-muted)",
				borderColor: "var(--app-border)",
				flexShrink: 0,
			}}
		>
			{VIEW_TABS.map((tab) => {
				const active = tab.value === viewMode;
				return (
					<button
						key={tab.value}
						type="button"
						aria-current={active ? "page" : undefined}
						onClick={() => setViewMode(tab.value)}
						style={{
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							border: "none",
							background: active ? "var(--app-surface-raised)" : "transparent",
							borderRadius: "calc(var(--m3-radius-pill) - 2px)",
							padding: "5px",
							width: 34,
							height: 34,
							cursor: "pointer",
							boxShadow: active ? "0 1px 4px rgb(23 61 53 / 12%)" : "none",
							transition:
								"background 160ms var(--m3-ease-effects), transform 120ms var(--m3-ease-spatial-fast), box-shadow 160ms var(--m3-ease-effects)",
						}}
					>
						<Tooltip label={tab.label} position="bottom">
							<Image
								src={tab.src}
								w={24}
								h={24}
								alt={tab.label}
								style={{ display: "block" }}
							/>
						</Tooltip>
					</button>
				);
			})}
		</Paper>
	);
};

export default ViewSwitcher3D;
