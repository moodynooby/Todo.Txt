import {
	ActionIcon,
	Anchor,
	Badge,
	Button,
	Group,
	Modal,
	Stack,
	Table,
	Text,
	Title,
} from "@mantine/core";
import { BookOpen, Info } from "lucide-react";
import { useState } from "react";
import { DescriptionSvg } from "../DescriptionSvg";

const SYNTAX_DATA = [
	{ syntax: "# Heading 1", output: "<h1>Heading 1</h1>" },
	{ syntax: "## Heading 2", output: "<h2>Heading 2</h2>" },
	{ syntax: "**Bold Text**", output: "<strong>Bold Text</strong>" },
	{ syntax: "*Italic Text*", output: "<em>Italic Text</em>" },
	{ syntax: "~~Strikethrough~~", output: "<del>Strikethrough</del>" },
	{ syntax: "> Blockquote", output: "<blockquote>Blockquote</blockquote>" },
	{ syntax: "- List item", output: "<ul><li>List item</li></ul>" },
	{ syntax: "1. Ordered item", output: "<ol><li>Ordered item</li></ol>" },
	{ syntax: "[Link](url)", output: '<a href="url">Link</a>' },
	{ syntax: "`inline code`", output: "<code>inline code</code>" },
	{ syntax: "```code```", output: "<pre><code>code</code></pre>" },
	{ syntax: "* [ ] Task", output: "<input type=checkbox> Task" },
	{ syntax: "* [x] Done", output: "<input type=checkbox checked> Done" },
	{ syntax: "---", output: "<hr>" },
	{ syntax: "| Table |", output: "<table><tr><td>Table</td></tr></table>" },
	{ syntax: ":emoji:", output: "😊" },
];

const Help = () => {
	const [opened, setOpened] = useState(false);

	return (
		<>
			<ActionIcon
				variant="subtle"
				size="lg"
				color="info"
				onClick={() => setOpened(true)}
				aria-label="Open help dialog"
			>
				<Info size={20} />
			</ActionIcon>

			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				title={<Title order={3}>Help</Title>}
				size="lg"
			>
				<Stack gap="lg">
					<Group justify="center">
						<DescriptionSvg />
					</Group>

					<Anchor
						href="https://github.com/todotxt/todo.txt"
						target="_blank"
						rel="noreferrer"
						c="info"
					>
						<Button
							leftSection={<BookOpen size={16} />}
							variant="light"
							color="info"
						>
							Learn more about todo.txt
						</Button>
					</Anchor>

					<Stack gap="xs">
						<Title order={4}>Markdown Syntax</Title>
						<Table striped highlightOnHover>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Syntax</Table.Th>
									<Table.Th>Output</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{SYNTAX_DATA.map((item) => (
									<Table.Tr key={item.syntax}>
										<Table.Td>
											<Badge variant="outline" size="sm">
												{item.syntax}
											</Badge>
										</Table.Td>
										<Table.Td>
											<Text size="sm" c="dimmed">
												{item.output}
											</Text>
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					</Stack>
				</Stack>
			</Modal>
		</>
	);
};

export default Help;
