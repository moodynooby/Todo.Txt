import { Image, SegmentedControl, Tooltip } from "@mantine/core";
import { useViewContext } from "@/context/ViewContext";
import { VIEW_TABS } from "./viewTabs";

const ViewSwitcher = () => {
	const { state: viewState, dispatchView } = useViewContext();
	const viewMode = viewState.viewMode;
	const setViewMode = (mode: string) =>
		dispatchView({ type: "SET_VIEW_MODE", payload: mode });

	return (
		<SegmentedControl
			value={viewMode}
			onChange={setViewMode}
			style={{ minWidth: 320, flexShrink: 0 }}
			size="sm"
			data={VIEW_TABS.map((tab) => ({
				value: tab.value,
				label: (
					<Tooltip key={tab.value} label={tab.tooltip} position="bottom">
						<div
							style={{
								display: "inline-flex",
								alignItems: "center",
								justifyContent: "center",
								gap: 6,
								whiteSpace: "nowrap",
							}}
						>
							<Image src={tab.src} w={18} h={18} alt={tab.label} />
							<span style={{ lineHeight: 1 }}>{tab.label}</span>
						</div>
					</Tooltip>
				),
			}))}
		/>
	);
};

export default ViewSwitcher;
