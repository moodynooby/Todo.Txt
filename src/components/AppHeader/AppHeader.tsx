import { ActionIcon, Group, Paper, Title, Tooltip } from "@mantine/core";
import { Plus, Timer as TimerIcon } from "lucide-react";
import HeaderActions from "../Header/HeaderActions";
import ViewSwitcher from "../Header/ViewSwitcher";

interface AppHeaderProps {
	viewMode: string;
	setViewMode: (mode: string) => void;
	onAddTimer: () => void;
}

const AppHeader = ({ viewMode, setViewMode, onAddTimer }: AppHeaderProps) => {
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
						<Tooltip label="Add timer">
							<ActionIcon variant="subtle" size="lg" onClick={onAddTimer}>
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
