import {
	Box,
	Card,
	Group,
	Image,
	SimpleGrid,
	Stack,
	Text,
	ThemeIcon,
} from "@mantine/core";
import { ArrowRight } from "lucide-react";
import type { KeyboardEvent } from "react";
import type { QuickAction } from "../../types/ui";

interface WelcomeScreenProps {
	quickActions: QuickAction[];
}

const CTA_LABELS: Record<string, string> = {
	start: "Get started",
	connect: "Set up sync",
	help: "Learn more",
};

const handleCardKeyDown = (
	e: KeyboardEvent<HTMLDivElement>,
	action: () => void,
) => {
	if (e.key === "Enter" || e.key === " ") {
		e.preventDefault();
		action();
	}
};

const WelcomeScreen = ({ quickActions }: WelcomeScreenProps) => {
	return (
		<Stack align="center" gap="xl" py="xl">
			<Stack align="center" gap="md">
				<Image src="/todotxt2.svg" alt="Todo.txt Logo" w={80} h={80} />
				<Text
					component="h1"
					ta="center"
					variant="gradient"
					gradient={{ from: "blue", to: "cyan", deg: 135 }}
					style={{ fontSize: "var(--mantine-h1-font-size)", fontWeight: 700 }}
				>
					T0do.TxT
				</Text>
				<Text size="lg" c="dimmed" maw={400} ta="center">
					A simple, synced plain text task manager
				</Text>
			</Stack>

			<SimpleGrid cols={{ base: 1, sm: 3 }} maw={700} w="100%">
				{quickActions.map((action) => {
					const Icon = action.icon;
					return (
						<Card
							key={action.id}
							withBorder
							padding="lg"
							radius="md"
							role="button"
							tabIndex={0}
							style={{ cursor: "pointer" }}
							onClick={action.action}
							onKeyDown={(e) => handleCardKeyDown(e, action.action)}
						>
							<Card.Section p="md">
								<ThemeIcon size="xl" radius="md" variant="light">
									<Icon size={24} />
								</ThemeIcon>
							</Card.Section>
							<Box>
								<Text fw={600} size="lg">
									{action.title}
								</Text>
								<Text size="sm" c="dimmed">
									{action.description}
								</Text>
							</Box>
							<Group mt="md">
								<Text size="sm" c="blue" fw={500}>
									{CTA_LABELS[action.id] ?? "Learn more"}
								</Text>
								<ArrowRight size={14} />
							</Group>
						</Card>
					);
				})}
			</SimpleGrid>
		</Stack>
	);
};

export default WelcomeScreen;
