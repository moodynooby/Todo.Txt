import { ActionIcon, Group, Image, Paper, Title, Tooltip } from "@mantine/core";
import { Plus, Timer as TimerIcon } from "lucide-react";
import { useViewMode } from "../../providers/ViewModeContext";
import HeaderActions from "../Header/HeaderActions";
import ViewSwitcher from "../Header/ViewSwitcher";

const AppHeader = () => {
	const { viewMode, addTimer } = useViewMode();

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
				<Group gap="sm">
					<Image src="/todotxt2.svg" alt="Logo" w={28} h={28} />
					<Title order={4} c="var(--mantine-primary-color-6)">
						T0do.Txt
					</Title>
					<ViewSwitcher />
				</Group>

				<Group gap="sm">
					{viewMode === "text" && (
						<Tooltip label="Add timer">
							<ActionIcon variant="subtle" size="lg" onClick={addTimer}>
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
