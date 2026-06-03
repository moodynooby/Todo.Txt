import { Code, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import {
	AtSign,
	Calendar,
	CheckCheck,
	Flag,
	Folders,
	Text as TextIcon,
} from "lucide-react";

interface Tip {
	icon: React.ReactNode;
	color: string;
	label: string;
	example: string;
	description: string;
}

const TIPS: Tip[] = [
	{
		icon: <TextIcon size={14} />,
		color: "gray",
		label: "Task Format",
		example: "Buy groceries",
		description: "Each line becomes a separate task.",
	},
	{
		icon: <Flag size={14} />,
		color: "red",
		label: "Priority",
		example: "(A) Urgent task",
		description: "Add (A), (B), or (C) at the start.",
	},
	{
		icon: <Folders size={14} />,
		color: "blue",
		label: "Project",
		example: "Write report +work",
		description: "Tag with +projectname.",
	},
	{
		icon: <AtSign size={14} />,
		color: "teal",
		label: "Context",
		example: "Call doctor @phone",
		description: "Tag with @context.",
	},
	{
		icon: <Calendar size={14} />,
		color: "violet",
		label: "Due Date",
		example: "Submit taxes due:2026-04-15",
		description: "Use due:YYYY-MM-DD or due:today.",
	},
	{
		icon: <CheckCheck size={14} />,
		color: "green",
		label: "Completion",
		example: "x 2026-06-03 Done task",
		description: "Prefix with x to mark done.",
	},
];

const TipsPanel = () => (
	<Stack gap="sm" px="xs" py="xs">
		{TIPS.map((tip) => (
			<Group key={tip.label} gap="xs" align="flex-start" wrap="nowrap">
				<ThemeIcon
					variant="light"
					color={tip.color}
					size="sm"
					radius="md"
					style={{ marginTop: 2, flexShrink: 0 }}
				>
					{tip.icon}
				</ThemeIcon>
				<Stack gap={2}>
					<Text size="xs" fw={600}>
						{tip.label}
					</Text>
					<Code
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 4,
							fontSize: 11,
							whiteSpace: "nowrap",
						}}
					>
						{tip.example}
					</Code>
					<Text size="xs" c="dimmed">
						{tip.description}
					</Text>
				</Stack>
			</Group>
		))}
	</Stack>
);

export default TipsPanel;
