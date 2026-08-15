import { ActionIcon, Group, Image, Paper, Title, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Plus, Timer as TimerIcon } from "lucide-react";
import { useTimerContext } from "@/context/TimerContext";
import { useViewContext } from "@/context/ViewContext";
import HeaderActions from "./HeaderActions";
import ViewSwitcher from "./ViewSwitcher";

/**
 * M3 Expressive app header.
 *
 * A translucent "top app bar" with an emphasized wordmark, a pill-shaped
 * view switcher that morphs with the motion tokens, and compact icon
 * actions at 44px touch targets on mobile.
 */
const AppHeader = () => {
	const { state: viewState } = useViewContext();
	const viewMode = viewState.viewMode;
	const { dispatchTimer } = useTimerContext();

	/* On mobile the M3 bottom navigation bar replaces the segmented
	 * switcher, so the header can stay compact and never overflow. */
	const isMobile = useMediaQuery("(max-width: 767px)");

	return (
		<Paper
			component="header"
			className="app-header"
			shadow="sm"
			radius={0}
			h="100%"
			style={{ overflowX: "auto" }}
		>
			<Group
				className="app-header-inner"
				h="100%"
				justify="space-between"
				px={isMobile ? "md" : "lg"}
				wrap="nowrap"
			>
				<Group gap="sm">
					<Image src="/todotxt2.svg" alt="Logo" w={28} h={28} />
					<Title order={4} className="app-wordmark">
						T0do.Txt
					</Title>
					{!isMobile && <ViewSwitcher />}
				</Group>

				<Group gap="xs">
					{/* The add-timer affordance lives on the mobile bottom bar /
					 * FAB on narrow screens, so the header keeps zero reserved
					 * space on the right below `xs`. */}
					{viewMode === "todo" && (
						<Tooltip label="Add timer">
							<ActionIcon
								variant="light"
								color="evergreen"
								radius="md"
								size="lg"
								visibleFrom="xs"
								onClick={() => dispatchTimer({ type: "ADD_TIMER" })}
								aria-label="Add timer"
							>
								<Group gap={2}>
									<TimerIcon size={18} />
									<Plus size={12} />
								</Group>
							</ActionIcon>
						</Tooltip>
					)}
					<HeaderActions />
				</Group>
			</Group>
		</Paper>
	);
};

export default AppHeader;
