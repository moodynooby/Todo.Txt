/** Field Notes Ritual: desktop "Today" widget.
 *
 * The desktop equivalent of the Android `widget_todo` card: the number of
 * tasks waiting on their due date, followed by the list of open tasks due
 * today or overdue. Styled with the shared M3 role tokens so it looks like
 * a native Android homescreen widget — solid raised surface, big ZillaSlab
 * number callout, WinkySans body, and a slim evergreen progress bar.
 */
import { Badge, Box, Progress, Stack, Text, Title } from "@mantine/core";
import { Check, Clock } from "lucide-react";
import { useDesktopWidgetData } from "@/hooks/useDesktopWidgetData";
import { getToday } from "@/utils/dateUtils";

/** Tiny empty checkbox glyph for the widget header (no interactive state). */
const CheckboxGlyph = () => (
	<Box
		aria-hidden
		style={{
			width: 11,
			height: 11,
			borderRadius: 3,
			border: "2px solid var(--mantine-color-evergreen-7)",
			flexShrink: 0,
		}}
	/>
);

export const TodoWidget = () => {
	const data = useDesktopWidgetData();
	const today = getToday();

	const openTasks = data.tasks.filter((task) => !task.done);
	const doneCount = data.tasks.length - openTasks.length;

	const dueTasks = openTasks
		.filter((task) => task.due != null && task.due !== "" && task.due <= today)
		.sort((a, b) => (a.due ?? "").localeCompare(b.due ?? ""));

	const overdueCount = dueTasks.filter(
		(task) => (task.due ?? "") < today,
	).length;

	const completionPct = data.tasks.length
		? Math.round((doneCount / data.tasks.length) * 100)
		: 0;

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
			{/* Widget header — Android widget chrome style */}
			<Box
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: 4,
				}}
			>
				<Box style={{ display: "flex", alignItems: "center", gap: 6 }}>
					<CheckboxGlyph />
					<Text
						size="xs"
						fw={700}
						c="var(--app-ink)"
						style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}
					>
						Today
					</Text>
				</Box>
				<Badge
					variant="light"
					color="terracotta"
					size="sm"
					style={{ borderRadius: 12 }}
				>
					{dueTasks.length} waiting
				</Badge>
			</Box>

			{/* Big ZillaSlab callout — the moment of an Android widget */}
			<Box style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
				<Title
					order={2}
					style={{ fontFamily: "ZillaSlab, serif", lineHeight: 1 }}
				>
					{overdueCount > 0 ? (
						<Text c="var(--mantine-color-terracotta-7)" component="span">
							{overdueCount} overdue
						</Text>
					) : (
						<Text c="var(--mantine-color-evergreen-7)" component="span">
							{dueTasks.length} due
						</Text>
					)}
				</Title>
				<Text size="xs" c="var(--app-ink-muted)">
					{doneCount}/{data.tasks.length} done
				</Text>
			</Box>

			<Progress
				value={completionPct}
				color="evergreen"
				size="xs"
				radius="xl"
				style={{ margin: "8px 0 10px" }}
			/>

			{/* Task list — truncated to fit the 320x260 widget */}
			<Stack gap={6} style={{ flex: 1, overflow: "hidden" }}>
				{dueTasks.length === 0 && (
					<Box
						style={{
							flex: 1,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Text
							size="sm"
							c="var(--app-ink-faint)"
							style={{ fontStyle: "italic" }}
						>
							Nothing waiting — enjoy the quiet.
						</Text>
					</Box>
				)}
				{dueTasks.slice(0, 7).map((task) => (
					<Box
						key={task.id}
						style={{
							display: "flex",
							alignItems: "center",
							gap: 8,
							fontSize: 13,
						}}
					>
						<Check
							size={13}
							style={{
								color: "var(--app-ink-faint)",
								flexShrink: 0,
							}}
						/>
						<Text
							size="sm"
							c="var(--app-ink)"
							style={{
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap",
							}}
							title={task.text}
						>
							{task.text}
						</Text>
						<Clock
							size={11}
							style={{
								color: "var(--mantine-color-terracotta-6)",
								flexShrink: 0,
							}}
						/>
						<Text
							size="xs"
							c="var(--mantine-color-terracotta-7)"
							fw={500}
							style={{ flexShrink: 0 }}
						>
							{task.due === today ? "today" : task.due}
						</Text>
					</Box>
				))}
				{dueTasks.length > 7 && (
					<Text size="xs" c="var(--app-ink-faint)">
						…+{dueTasks.length - 7} more in the app
					</Text>
				)}
			</Stack>
		</Box>
	);
};

export default TodoWidget;
