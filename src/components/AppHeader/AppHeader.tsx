import {
	ActionIcon,
	Divider,
	Group,
	Paper,
	Title,
	Tooltip,
} from "@mantine/core";
import { FolderOpen, Plus, Sparkles, Timer as TimerIcon } from "lucide-react";
import HeaderActions from "../Header/HeaderActions";
import ViewSwitcher from "../Header/ViewSwitcher";
import SaveMenu from "../SaveMenu/SaveMenu";

interface AppHeaderProps {
	viewMode: string;
	setViewMode: (mode: string) => void;
	onAddTimer: () => void;
	onOpenRepo: () => void;
	onSave: (format: string) => void;
	onAiTools: () => void;
}

const AppHeader = ({
	viewMode,
	setViewMode,
	onAddTimer,
	onOpenRepo,
	onSave,
	onAiTools,
}: AppHeaderProps) => {
	return (
		<Paper
			component="header"
			shadow="sm"
			radius={0}
			style={{
				height: "100%",
			}}
		>
			<Group h="100%" justify="space-between" px="md">
				<Group gap="md">
					<Title order={4} c="violet.6">
						T0do.Txt
					</Title>
					<ViewSwitcher value={viewMode} onChange={setViewMode} />
				</Group>

				<Group gap="sm">
					<Tooltip label="Open file">
						<ActionIcon variant="subtle" size="lg" onClick={onOpenRepo}>
							<FolderOpen size={18} />
						</ActionIcon>
					</Tooltip>
					<SaveMenu onSave={onSave} />

					<Divider orientation="vertical" />

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

					<Divider orientation="vertical" />

					<HeaderActions />
				</Group>
			</Group>
		</Paper>
	);
};

export default AppHeader;
