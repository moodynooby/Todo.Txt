import { ActionIcon, Anchor, Button, Group, Modal, Stack } from "@mantine/core";
import { BookOpen, Info } from "lucide-react";
import { useState } from "react";
import { DescriptionSvg } from "../Assets/DescriptionSvg";

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
				title="Help"
				size="lg"
			>
				<Stack gap="lg">
					<Group justify="center">
						<DescriptionSvg />
					</Group>
					<Stack gap="xs" align="center">
						{" "}
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
								Learn more about Todo.txt Format
							</Button>
						</Anchor>{" "}
						<Anchor
							href="https://www.markdownguide.org/cheat-sheet/"
							target="_blank"
							rel="noreferrer"
							c="info"
						>
							<Button
								leftSection={<BookOpen size={16} />}
								variant="light"
								color="info"
							>
								Learn more about Markdown Format
							</Button>
						</Anchor>
					</Stack>
				</Stack>
			</Modal>
		</>
	);
};

export default Help;
