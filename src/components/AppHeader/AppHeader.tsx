import { ActionIcon, Group, Paper, Title, Tooltip } from "@mantine/core";
import { Filter, Plus, Sparkles, Timer as TimerIcon } from "lucide-react";
import HeaderActions from "../Header/HeaderActions";
import ViewSwitcher from "../Header/ViewSwitcher";

interface AppHeaderProps {
	viewMode: string;
	setViewMode: (mode: string) => void;
	onAddTimer: () => void;
	onAiTools: () => void;
	onToggleSidebar?: () => void;
	sidebarCollapsed?: boolean;
}

const AppHeader = ({
	viewMode,
	setViewMode,
	onAddTimer,
	onAiTools,
	onToggleSidebar,
	sidebarCollapsed,
}: AppHeaderProps) => {
	return (
		<Paper
			component="header"
			shadow="sm"
			radius={0}
			style={{
				height: "100%",
				overflowX: "auto",
				WebkitOverflowScrolling: "touch",
			}}
		>
			<Group h="100%" justify="space-between" px="md" wrap="nowrap">
				<Group gap="md">
					<Title order={4} c="var(--mantine-primary-color-6)">
						T0do.Txt
					</Title>
					<ViewSwitcher value={viewMode} onChange={setViewMode} />
				</Group>

				<Group gap="sm">
					{viewMode === "text" && (
						<>
							{onToggleSidebar && (
								<Tooltip
									label={sidebarCollapsed ? "Show filters" : "Hide filters"}
								>
									<ActionIcon
										variant={sidebarCollapsed ? "light" : "subtle"}
										color={
											sidebarCollapsed
												? "var(--mantine-primary-color-6)"
												: undefined
										}
										size="lg"
										onClick={onToggleSidebar}
									>
										<Filter size={18} />
									</ActionIcon>
								</Tooltip>
							)}
							<Tooltip label="Add timer">
								<ActionIcon variant="subtle" size="lg" onClick={onAddTimer}>
									<Group gap={2}>
										<TimerIcon size={18} />
										<Plus size={12} />
									</Group>
								</ActionIcon>
							</Tooltip>
							<Tooltip label="AI Tools">
								<ActionIcon variant="subtle" size="lg" onClick={onAiTools}>
									<Sparkles size={18} />
								</ActionIcon>
							</Tooltip>
						</>
					)}

					<HeaderActions />
				</Group>
			</Group>
		</Paper>
	);
};

export default AppHeader;
