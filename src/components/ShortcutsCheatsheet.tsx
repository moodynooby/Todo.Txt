import { Kbd, Modal, Stack, Table, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

/**
 * Keyboard shortcut cheatsheet (opens with `?` or the header keyboard
 * button). Discovery surface for the app's keyboard map — every entry
 * reflects a binding that actually exists.
 */

export const SHORTCUT_GROUPS: {
	group: string;
	items: { keys: string[]; action: string }[];
}[] = [
	{
		group: "Global",
		items: [
			{ keys: ["Ctrl", "K"], action: "Command palette" },
			{ keys: ["?"], action: "This cheatsheet" },
			{ keys: ["Ctrl", "O"], action: "Open a todo.txt file" },
		],
	},
	{
		group: "Editor",
		items: [
			{ keys: ["Ctrl", "Z"], action: "Undo" },
			{ keys: ["Ctrl", "⇧", "Z"], action: "Redo" },
			{ keys: ["Ctrl", "B"], action: "Bold" },
			{ keys: ["Ctrl", "I"], action: "Italic" },
			{ keys: ["Ctrl", "U"], action: "Underline" },
		],
	},
	{
		group: "Quick add",
		items: [
			{ keys: ["Enter"], action: "Commit the todo" },
			{
				keys: ["+proj", "@ctx", "(A)", "due:today"],
				action: "todo.txt syntax inline",
			},
		],
	},
];

interface ShortcutsCheatsheetProps {
	opened: boolean;
	onClose: () => void;
}

/** Listens on `open-shortcuts` so any header button can open it too. */
export const OPEN_SHORTCUTS_EVENT = "open-shortcuts";

export default function ShortcutsCheatsheet({
	opened,
	onClose,
}: ShortcutsCheatsheetProps) {
	const isNarrow = useMediaQuery("(max-width: 40em)");

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={
				<Title order={4} className="app-display-title">
					Keyboard shortcuts
				</Title>
			}
			size={isNarrow ? "100%" : 520}
			radius="lg"
			centered
		>
			<Stack gap="lg">
				<Text size="sm" c="dimmed">
					On macOS use ⌘ instead of Ctrl.
				</Text>
				{SHORTCUT_GROUPS.map((group) => (
					<Table key={group.group} verticalSpacing="xs" fz="sm">
						<Table.Thead>
							<Table.Tr>
								<Table.Th colSpan={2} className="todo-sidebar-heading">
									{group.group}
								</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{group.items.map((item) => (
								<Table.Tr key={item.action}>
									<Table.Td w="45%">
										<Stack gap={4} align="flex-start">
											{item.keys.map((key) => (
												<Kbd key={key} size="xs">
													{key}
												</Kbd>
											))}
										</Stack>
									</Table.Td>
									<Table.Td>{item.action}</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				))}
			</Stack>
		</Modal>
	);
}
