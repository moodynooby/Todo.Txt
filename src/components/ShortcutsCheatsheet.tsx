import {
	Code,
	Kbd,
	Modal,
	Stack,
	Table,
	Tabs,
	Text,
	Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

/**
 * Help cheatsheet (opens with `?`, the header keyboard button, or the
 * command palette). The app's single help surface: keyboard map plus a
 * todo.txt syntax reference.
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

const SYNTAX_ROWS: { syntax: string; meaning: string }[] = [
	{ syntax: "(A)", meaning: "Priority A (also B, C)" },
	{ syntax: "+project", meaning: "Project tag" },
	{ syntax: "@context", meaning: "Context tag" },
	{
		syntax: "due:today",
		meaning: "Due date — also due:YYYY-MM-DD or due:tomorrow",
	},
	{
		syntax: "due:tomorrow@15:30",
		meaning: "Due date with time — fires a reminder at that moment",
	},
	{ syntax: "x 2026-08-03", meaning: "Completed task prefix" },
	{
		syntax: "in 3 days · every Monday",
		meaning: "Scheduling phrases — use the chips in the editor toolbar",
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
					Help
				</Title>
			}
			size={isNarrow ? "100%" : 520}
			radius="lg"
			centered
		>
			<Tabs defaultValue="shortcuts">
				<Tabs.List mb="sm">
					<Tabs.Tab value="shortcuts">Shortcuts</Tabs.Tab>
					<Tabs.Tab value="syntax">todo.txt syntax</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="shortcuts">
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
				</Tabs.Panel>

				<Tabs.Panel value="syntax">
					<Text size="sm" c="dimmed" mb="sm">
						Type these inline — every new line is a task.
					</Text>
					<Table verticalSpacing="xs" fz="sm">
						<Table.Tbody>
							{SYNTAX_ROWS.map((row) => (
								<Table.Tr key={row.syntax}>
									<Table.Td w="45%">
										<Code>{row.syntax}</Code>
									</Table.Td>
									<Table.Td>{row.meaning}</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</Tabs.Panel>
			</Tabs>
		</Modal>
	);
}
