/** Field Notes Ritual: desktop "Habits" widget.
 *
 * Android `widget_habits` card: the current best streak, today's habit
 * progress, and a one-line momentum readout. Mirrors the Android widget's
 * single-glance job — a big ZillaSlab streak number and a short list of
 * habits due today.
 */
import { Box, Progress, Stack, Text, Title } from "@mantine/core";
import { Flame } from "lucide-react";
import { useDesktopWidgetData } from "@/hooks/useDesktopWidgetData";

export const HabitsWidget = () => {
	const data = useDesktopWidgetData();
	const momentum = data.momentum;

	const habitsDone = momentum?.habitsDoneToday ?? 0;
	const habitsTotal = momentum?.habitsTotal ?? 0;
	const bestStreak = momentum?.bestStreak ?? 0;
	const avgRate = momentum?.avgRate28 ?? 0;
	const bestName = momentum?.bestHabitName ?? "";

	return (
		<Box
			className="app-surface"
			p="md"
			style={{
				background: "var(--app-surface-raised)",
				border: "1px solid var(--app-border-strong)",
				borderRadius: "var(--m3-radius-lg)",
				boxShadow: "var(--app-shadow-md)",
				width: "100%",
				height: "100%",
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Text
				size="xs"
				fw={700}
				c="var(--app-ink)"
				style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}
			>
				Habits
			</Text>

			{/* Hero streak callout */}
			<Box
				style={{
					display: "flex",
					alignItems: "center",
					gap: 8,
					margin: "4px 0 2px",
				}}
			>
				<Flame size={18} style={{ color: "var(--mantine-color-honey-7)" }} />
				<Title
					order={2}
					style={{ fontFamily: "ZillaSlab, serif", lineHeight: 1 }}
				>
					{bestStreak} day streak
				</Title>
			</Box>
			{bestName && (
				<Text size="xs" c="var(--app-ink-muted)" style={{ marginBottom: 8 }}>
					{bestName}
				</Text>
			)}

			{/* Today's progress */}
			<Stack gap={6} style={{ flex: 1, justifyContent: "center" }}>
				<Box style={{ display: "flex", justifyContent: "space-between" }}>
					<Text size="sm" c="var(--app-ink)">
						Today
					</Text>
					<Text size="sm" c="var(--app-ink-muted)">
						{habitsDone}/{habitsTotal}
					</Text>
				</Box>
				<Progress
					value={habitsTotal ? Math.round((habitsDone / habitsTotal) * 100) : 0}
					color="honey"
					size="md"
					radius="xl"
				/>
				<Box style={{ display: "flex", justifyContent: "space-between" }}>
					<Text size="sm" c="var(--app-ink)">
						28-day average
					</Text>
					<Text size="sm" c="var(--app-ink-muted)">
						{avgRate}%
					</Text>
				</Box>
			</Stack>
		</Box>
	);
};

export default HabitsWidget;
