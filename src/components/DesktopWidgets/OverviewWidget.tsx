/** Field Notes Ritual: desktop "Overview" widget.
 *
 * Android `widget_overview` card: a compact at-a-glance summary of the
 * whole todo.txt — open tasks, completion, priority spread, and the
 * busiest projects/contexts. Same raised M3 surface as the Todo card,
 * smaller metric callouts since the job here is breadth, not depth.
 */
import { Box, Progress, Stack, Text, Title } from "@mantine/core";
import { useDesktopWidgetData } from "@/hooks/useDesktopWidgetData";

export const OverviewWidget = () => {
	const data = useDesktopWidgetData();

	const open = data.tasks.filter((task) => !task.done);
	const done = data.tasks.filter((task) => task.done);
	const completionPct = data.tasks.length
		? Math.round((done.length / data.tasks.length) * 100)
		: 0;

	const priorities = data.aggregate.priorities;
	const projectsSorted = data.aggregate.projects;
	const contextsSorted = data.aggregate.contexts;

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
				Overview
			</Text>

			{/* Hero metric row */}
			<Box
				style={{
					display: "flex",
					alignItems: "baseline",
					gap: 10,
					margin: "6px 0 8px",
				}}
			>
				<Title
					order={2}
					style={{ fontFamily: "ZillaSlab, serif", lineHeight: 1 }}
				>
					{open.length}
				</Title>
				<Text size="sm" c="var(--app-ink-muted)">
					open · {done.length} done ({completionPct}%)
				</Text>
			</Box>

			<Progress
				value={completionPct}
				color="evergreen"
				size="xs"
				radius="xl"
				style={{ marginBottom: 10 }}
			/>

			<Stack gap={10} style={{ flex: 1, overflow: "hidden" }}>
				{/* Priority spread */}
				<Box>
					<Text size="xs" c="var(--app-ink-faint)" fw={500}>
						Priority
					</Text>
					<Box style={{ display: "flex", gap: 12, marginTop: 2 }}>
						{["A", "B", "C"].map((letter) => (
							<Box
								key={letter}
								style={{ display: "flex", alignItems: "center", gap: 4 }}
							>
								<Text
									size="sm"
									fw={700}
									c={
										letter === "A"
											? "var(--mantine-color-terracotta-7)"
											: "var(--app-ink-muted)"
									}
								>
									({letter})
								</Text>
								<Text size="sm" c="var(--app-ink)">
									{priorities[letter] ?? 0}
								</Text>
							</Box>
						))}
					</Box>
				</Box>

				{/* Busiest projects */}
				<Box>
					<Text size="xs" c="var(--app-ink-faint)" fw={500}>
						Projects
					</Text>
					{projectsSorted.length === 0 ? (
						<Text
							size="sm"
							c="var(--app-ink-faint)"
							style={{ fontStyle: "italic" }}
						>
							No open projects
						</Text>
					) : (
						projectsSorted.map((bucket) => (
							<Box
								key={bucket.key}
								style={{ display: "flex", justifyContent: "space-between" }}
							>
								<Text size="sm" c="var(--mantine-color-evergreen-7)">
									{bucket.key}
								</Text>
								<Text size="sm" c="var(--app-ink-muted)">
									{bucket.count}
								</Text>
							</Box>
						))
					)}
				</Box>

				{/* Busiest contexts */}
				<Box>
					<Text size="xs" c="var(--app-ink-faint)" fw={500}>
						Contexts
					</Text>
					{contextsSorted.length === 0 ? (
						<Text
							size="sm"
							c="var(--app-ink-faint)"
							style={{ fontStyle: "italic" }}
						>
							No open contexts
						</Text>
					) : (
						contextsSorted.map((bucket) => (
							<Box
								key={bucket.key}
								style={{ display: "flex", justifyContent: "space-between" }}
							>
								<Text size="sm" c="var(--app-ink)">
									{bucket.key}
								</Text>
								<Text size="sm" c="var(--app-ink-muted)">
									{bucket.count}
								</Text>
							</Box>
						))
					)}
				</Box>
			</Stack>
		</Box>
	);
};

export default OverviewWidget;
