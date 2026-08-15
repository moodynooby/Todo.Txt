import { ActionIcon, Badge, Group, Stack, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { Sparkles, X } from "lucide-react";

/**
 * Smart contextual guidance for the Todo workspace.
 *
 * Principles (Material 3 Expressive "smart guidance"):
 * 1. Say only what matters right now. A fresh workspace gets a short
 *    onboarding hint that invites the user to try real todo.txt syntax.
 *    A workspace that already has tasks stays silent — the empty-state
 *    sections and the quick-add placeholder already teach syntax.
 * 2. One example at a time, softly rotating: a single pill-style example
 *    demonstrates what the app can do without a wall of permanent chips.
 * 3. The hint is dismissible and remembered, never re-imposed.
 */

const EXAMPLES: {
	syntax: string;
	description: string;
}[] = [
	{
		syntax: "(A) Reply to mom +personal due:today",
		description: "Priority, project, and due date in one line.",
	},
	{
		syntax: "Call dentist @phone due:2026-09-01",
		description: "@context keeps tasks grouped by where they happen.",
	},
	{
		syntax: "x 2026-08-15 Bought groceries",
		description: "Prefix a line with `x` plus today's date to close it.",
	},
];

interface TipsPanelProps {
	/** true when the todo document has no tasks at all */
	isEmpty: boolean;
	/** optional filter currently applied, to acknowledge the user's action */
	activeFilterLabel?: string;
}

/** Pick an example deterministically from the day so the UI stays stable. */
const exampleForToday = () => {
	const day = Math.floor(Date.now() / 86400000);
	return EXAMPLES[day % EXAMPLES.length];
};

export default function TipsPanel({ isEmpty }: TipsPanelProps) {
	const [dismissed, setDismissed] = useLocalStorage<boolean>({
		key: "tips-dismissed-v1",
		defaultValue: false,
	});

	if (dismissed) return null;

	// A fresh workspace gets a warm, actionable invitation.
	if (isEmpty) {
		return (
			<Stack gap="sm" px="xs" py="xs">
				<Group justify="space-between" wrap="nowrap" style={{ flex: 1 }}>
					<Group gap="xs" wrap="nowrap">
						<Sparkles size={14} color="var(--mantine-color-evergreen-4)" />
						<Text size="xs" fw={700}>
							Try it
						</Text>
					</Group>
					<ActionIcon
						variant="subtle"
						size="xs"
						onClick={() => setDismissed(true)}
						aria-label="Hide hint"
					>
						<X size={13} />
					</ActionIcon>
				</Group>
				<Text size="xs" c="dimmed" lh={1.5}>
					Just type a line — like{" "}
					<Text component="span" fw={600} c="inherit">
						`(A) Buy milk +groceries`
					</Text>{" "}
					— in the bar above and press{" "}
					<Text component="span" fw={600} c="inherit">
						Enter
					</Text>
					. Each line becomes a task, and your list appears right here.
				</Text>
			</Stack>
		);
	}

	// A working workspace gets one quiet, rotating nudge — nothing more.
	const example = exampleForToday();
	return (
		<Stack gap="xs" px="xs" py="xs">
			<Group justify="space-between" wrap="nowrap" style={{ flex: 1 }}>
				<Group gap="xs" wrap="nowrap">
					<Sparkles size={14} color="var(--mantine-color-evergreen-4)" />
					<Text size="xs" fw={700}>
						One more thing
					</Text>
				</Group>
				<ActionIcon
					variant="subtle"
					size="xs"
					onClick={() => setDismissed(true)}
					aria-label="Hide hint"
				>
					<X size={13} />
				</ActionIcon>
			</Group>
			<Badge
				variant="light"
				color="gray"
				radius="xl"
				size="sm"
				style={{ fontWeight: 500, fontFamily: "monospace", fontSize: 11 }}
			>
				{example.syntax}
			</Badge>
			<Text size="xs" c="dimmed" lh={1.5}>
				{example.description}
			</Text>
		</Stack>
	);
}
