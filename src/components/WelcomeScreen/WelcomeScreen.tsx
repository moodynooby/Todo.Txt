import {
	ActionIcon,
	Anchor,
	Box,
	Card,
	Group,
	Image,
	Paper,
	SimpleGrid,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { ArrowRight } from "lucide-react";
import type { QuickAction } from "../../types/ui";
import { DescriptionSvg } from "../Assets/DescriptionSvg";

interface WelcomeScreenProps {
	quickActions: QuickAction[];
}

const WelcomeScreen = ({ quickActions }: WelcomeScreenProps) => {
	return (
		<Stack align="center" className="welcome-screen" gap="xl" py="xl">
			<Stack align="center" gap="md">
				<Image src="/todotxt2.svg" alt="Todo.txt Logo" w={80} h={80} />
				<Title order={1} className="gradient-text" ta="center">
					Welcome to Todo.txt
				</Title>
				<Text size="lg" c="dimmed" maw={400} ta="center">
					A simple, plain text task management system based on the{" "}
					<Anchor
						href="https://github.com/todotxt/todo.txt"
						target="_blank"
						rel="noreferrer"
					>
						todo.txt
					</Anchor>{" "}
					philosophy
				</Text>
			</Stack>

			<SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} maw={900} w="100%">
				{quickActions.map((action) => {
					const Icon = action.icon;
					return (
						<Card
							key={action.id}
							withBorder
							padding="lg"
							radius="md"
							style={{ cursor: "pointer" }}
							onClick={action.action}
						>
							<Group>
								<ThemeIcon size="xl" radius="md" variant="light">
									<Icon size={24} />
								</ThemeIcon>
								<Box style={{ flex: 1 }}>
									<Text fw={600} size="lg">
										{action.title}
									</Text>
									<Text size="sm" c="dimmed">
										{action.description}
									</Text>
								</Box>
								<ActionIcon variant="subtle" size="sm">
									<ArrowRight size={16} />
								</ActionIcon>
							</Group>
						</Card>
					);
				})}
			</SimpleGrid>

			<Paper withBorder p="lg" radius="md" maw={600} w="100%">
				<Text size="xs" fw={700} tt="uppercase" c="dimmed" mb="sm">
					Basic Info
				</Text>
				<Paper p="md" radius="sm">
					<DescriptionSvg />
				</Paper>
			</Paper>
		</Stack>
	);
};

export default WelcomeScreen;
