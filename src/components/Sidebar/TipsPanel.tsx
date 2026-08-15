import { Badge, Box, Divider, Group, Stack, Text } from "@mantine/core";
import {
	Bell,
	CalendarCheck,
	CalendarClock,
	CheckCircle2,
	ClipboardList,
	Flag,
	Hash,
	Tag,
} from "lucide-react";

/**
 * Persistent help guide for the Todo workspace (Material 3 "always reachable").
 *
 * Unlike the previous dismissible hints, this section never disappears — the
 * sidebar scrolls through it so users can always return to the reference.
 * Content is compact (icon + one-liner rows) so it does not crowd the
 * filter lists, and due-date rows explain the new exact-time reminder
 * syntax (`due:today@17:00`) that the auto-reminder engine consumes.
 */

const ENTRIES: {
	icon: React.ComponentType<{ size?: number; color?: string }>;
	title: string;
	syntax?: string;
	description: string;
}[] = [
	{
		icon: ClipboardList,
		title: "Write tasks directly",
		description:
			"Just type lines in the editor — every new line becomes a task. No separate input bar needed.",
	},
	{
		icon: Flag,
		title: "Priority",
		syntax: "(A) Urgent task",
		description: "Add (A), (B), or (C) at the start of a line.",
	},
	{
		icon: Hash,
		title: "Project",
		syntax: "Write report +work",
		description: "Tag with +projectname.",
	},
	{
		icon: Tag,
		title: "Context",
		syntax: "Call doctor @phone",
		description: "Tag with @context.",
	},
	{
		icon: CalendarCheck,
		title: "Due date",
		syntax: "Submit taxes due:2026-04-15",
		description:
			"Use due:YYYY-MM-DD, due:today, due:tomorrow, or a relative word.",
	},
	{
		icon: CalendarClock,
		title: "Due date + time",
		syntax: "Meeting due:tomorrow@15:30",
		description:
			"Add @HH:MM (or T15:30) to any due date — the app fires a reminder at the exact time.",
	},
	{
		icon: Bell,
		title: "Reminders",
		syntax: "due:today@09:00",
		description:
			"Tasks with a due moment get a notification and a chime when they arrive while the app is open.",
	},
	{
		icon: CheckCircle2,
		title: "Completion",
		syntax: "x 2026-08-03 Done task",
		description: "Prefix with x (plus the completion date) to mark done.",
	},
];

export default function TipsPanel() {
	return (
		<Box py="xs">
			{ENTRIES.map((entry, index) => (
				<Box key={entry.title}>
					{index > 0 && <Divider mb="xs" mt="xs" style={{ opacity: 0.4 }} />}
					<Stack gap={2}>
						<Group gap="xs" wrap="nowrap">
							<entry.icon size={13} color="var(--mantine-color-evergreen-4)" />
							<Text size="xs" fw={700}>
								{entry.title}
							</Text>
						</Group>
						{entry.syntax && (
							<Badge
								variant="light"
								color="gray"
								radius="xl"
								size="sm"
								style={{
									fontWeight: 500,
									fontFamily: "monospace",
									fontSize: 11,
									justifyContent: "flex-start",
								}}
							>
								{entry.syntax}
							</Badge>
						)}
						<Text size="xs" c="dimmed" lh={1.5}>
							{entry.description}
						</Text>
					</Stack>
				</Box>
			))}
		</Box>
	);
}
