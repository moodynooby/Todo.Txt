import { Avatar, Button, Indicator, Menu, Text } from "@mantine/core";
import { LogOut, User } from "lucide-react";
import { useState } from "react";
import { useEditor } from "@/context/EditorContext";
import { useSyncContext } from "@/context/SyncContext";
import SignInModal from "@/features/auth/SignInModal";

const ConnectionButton = () => {
	// TODO: Read user/syncStatus from useAuthContext() instead of useEditor() — EditorContext will be removed.
	const { user, syncStatus } = useEditor();
	const { disconnect } = useSyncContext();
	const [signInModalOpen, setSignInModalOpen] = useState(false);

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
			<>
				<Button
					variant="subtle"
					size="compact-sm"
					leftSection={<User size={16} />}
					onClick={() => setSignInModalOpen(true)}
				>
					Sign in
				</Button>
				<SignInModal
					opened={signInModalOpen}
					onClose={() => setSignInModalOpen(false)}
				/>
			</>
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
					onClick={disconnect}
				>
					Sign out
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
};

export default ConnectionButton;
