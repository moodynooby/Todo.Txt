import {
	ActionIcon,
	Avatar,
	Indicator,
	Menu,
	Text,
	Tooltip,
} from "@mantine/core";
import { LogOut, User } from "lucide-react";
import { useEditor } from "@/context/EditorContext";

const ConnectionButton = () => {
	const { user, syncStatus, onConnect, onDisconnectSync } = useEditor();

	const dotColor = () => {
		switch (syncStatus) {
			case "connecting":
				return "yellow";
			case "synced":
				return "green";
			case "error":
				return "red";
			default:
				return "gray";
		}
	};

	if (!user) {
		return (
			<Tooltip label="Sign in" position="bottom">
				<ActionIcon
					variant="subtle"
					size="lg"
					onClick={onConnect}
					aria-label="Sign in"
				>
					<User size={20} />
				</ActionIcon>
			</Tooltip>
		);
	}

	return (
		<Menu shadow="md" width={200} position="bottom-end">
			<Menu.Target>
				<Indicator
					position="bottom-end"
					offset={4}
					color={dotColor()}
					size={12}
					withBorder
				>
					<Avatar
						src={user.photoURL}
						alt={user.displayName ?? "User"}
						size="md"
					>
						{user.displayName?.charAt(0).toUpperCase() ?? "U"}
					</Avatar>
				</Indicator>
			</Menu.Target>

			<Menu.Dropdown>
				<Menu.Label>
					<Text size="sm" fw={600} truncate>
						{user.displayName ?? "Signed in"}
					</Text>
				</Menu.Label>
				<Menu.Divider />
				<Menu.Item
					leftSection={<LogOut size={16} />}
					color="red"
					onClick={onDisconnectSync}
				>
					Sign out
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
};

export default ConnectionButton;
