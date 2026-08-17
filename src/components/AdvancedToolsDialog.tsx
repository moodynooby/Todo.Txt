import {
	Alert,
	Badge,
	Button,
	Code,
	Divider,
	Group,
	Modal,
	Paper,
	ScrollArea,
	Stack,
	Tabs,
	Text,
	Textarea,
	Title,
} from "@mantine/core";
import { useMemo, useState } from "react";
import type { ParsedTodoContent, Task } from "@/types/todo";
import {
	DependencyGraph,
	type DependencyGraphNode,
	parseRecurringScheduleExpression,
	parseRelativeDateExpression,
	parseTaskMetadata,
	type RecurrenceRule,
} from "@/utils/advancedParser";

interface AdvancedToolsDialogProps {
	opened: boolean;
	onClose: () => void;
	taskData: ParsedTodoContent;
}

interface DependencyReport {
	graph: DependencyGraph;
	nodes: DependencyGraphNode[];
	cycles: { hasCycle: boolean; cyclePath: string[] };
	statuses: Map<string, "active" | "blocked" | "completed">;
	missingReferences: string[];
}

const formatDate = (date: Date) => date.toISOString().split("T")[0];

const formatRule = (rule: RecurrenceRule) => {
	const schedule = rule.nthWeekday
		? `monthly, ${rule.nthWeekday.n}${rule.nthWeekday.n === 1 ? "st" : rule.nthWeekday.n === 2 ? "nd" : rule.nthWeekday.n === 3 ? "rd" : "th"} weekday ${rule.nthWeekday.day}`
		: `${rule.freq} every ${rule.interval}`;
	return `${schedule}${rule.time ? ` at ${rule.time}` : ""} · ${rule.mode}`;
};

function buildDependencyReport(tasks: Task[]): DependencyReport {
	const graph = new DependencyGraph();
	const nodes: DependencyGraphNode[] = [];
	const knownIds = new Set<string>();

	for (const task of tasks) {
		const metadata = parseTaskMetadata(task.raw || task.text);
		const id = metadata.id ?? `line-${task.id + 1}`;
		knownIds.add(id);
		nodes.push({
			id,
			taskText: task.text,
			completed: task.completed,
			after: metadata.after,
			blocks: metadata.blocks,
			status: task.completed ? "completed" : "active",
		});
	}

	for (const node of nodes) graph.addNode(node);

	const missingReferences = Array.from(
		new Set(
			nodes
				.flatMap((node) => [...node.after, ...node.blocks])
				.filter((id) => !knownIds.has(id)),
		),
	);

	return {
		graph,
		nodes,
		cycles: graph.detectCycles(),
		statuses: graph.propagateStatus(),
		missingReferences,
	};
}

export default function AdvancedToolsDialog({
	opened,
	onClose,
	taskData,
}: AdvancedToolsDialogProps) {
	const [naturalLanguage, setNaturalLanguage] = useState("in 3 days");
	const [parseResult, setParseResult] = useState<
		| { kind: "relative"; date: Date; ast: unknown }
		| { kind: "recurrence"; rule: RecurrenceRule; ast: unknown }
		| { kind: "error"; message: string }
		| null
	>(null);
	const dependencyReport = useMemo(
		() => buildDependencyReport(taskData.tasks),
		[taskData.tasks],
	);

	const runNaturalLanguageParser = () => {
		const relative = parseRelativeDateExpression(naturalLanguage);
		if (relative) {
			setParseResult({ kind: "relative", ...relative });
			return;
		}

		const recurrence = parseRecurringScheduleExpression(naturalLanguage);
		if (recurrence) {
			setParseResult({ kind: "recurrence", ...recurrence });
			return;
		}

		setParseResult({
			kind: "error",
			message:
				"Try a relative date such as ‘in 3 days’ or a schedule such as ‘every 2nd Tuesday at 3pm’.",
		});
	};

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title="Advanced task tools"
			size="lg"
			centered
		>
			<Tabs defaultValue="parser">
				<Tabs.List grow>
					<Tabs.Tab value="parser">Natural language</Tabs.Tab>
					<Tabs.Tab value="dependencies">Dependencies</Tabs.Tab>
					<Tabs.Tab value="recurrence">Recurrence</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="parser" pt="md">
					<Stack gap="sm">
						<Text size="sm" c="dimmed">
							Parse a scheduling phrase and inspect the resulting AST. The
							parser currently accepts relative dates and recurring schedules.
						</Text>
						<Textarea
							label="Scheduling phrase"
							placeholder="every 2nd Tuesday at 3pm"
							value={naturalLanguage}
							onChange={(event) =>
								setNaturalLanguage(event.currentTarget.value)
							}
							onKeyDown={(event) => {
								if (event.key === "Enter" && (event.metaKey || event.ctrlKey))
									runNaturalLanguageParser();
							}}
						/>
						<Button onClick={runNaturalLanguageParser}>Parse phrase</Button>
						{parseResult?.kind === "relative" && (
							<Alert
								color="teal"
								title={`Due date: ${formatDate(parseResult.date)}`}
							>
								<Code block>{JSON.stringify(parseResult.ast, null, 2)}</Code>
							</Alert>
						)}
						{parseResult?.kind === "recurrence" && (
							<Alert color="blue" title="Recurring schedule recognized">
								<Text size="sm" mb="xs">
									{formatRule(parseResult.rule)}
								</Text>
								<Code block>{JSON.stringify(parseResult.ast, null, 2)}</Code>
							</Alert>
						)}
						{parseResult?.kind === "error" && (
							<Alert color="yellow">{parseResult.message}</Alert>
						)}
					</Stack>
				</Tabs.Panel>

				<Tabs.Panel value="dependencies" pt="md">
					<Stack gap="sm">
						<Group justify="space-between" align="end">
							<div>
								<Title order={4}>Task dependency graph</Title>
								<Text size="sm" c="dimmed">
									Status is computed from <Code>after:id</Code> prerequisites
									and completion state.
								</Text>
							</div>
							<Badge color={dependencyReport.cycles.hasCycle ? "red" : "teal"}>
								{dependencyReport.cycles.hasCycle
									? "Cycle detected"
									: "Graph valid"}
							</Badge>
						</Group>
						{dependencyReport.cycles.hasCycle && (
							<Alert color="red" title="Circular dependency">
								{dependencyReport.cycles.cyclePath.join(" → ")}
							</Alert>
						)}
						{dependencyReport.missingReferences.length > 0 && (
							<Alert color="yellow" title="Missing task references">
								{dependencyReport.missingReferences.join(", ")}
							</Alert>
						)}
						<Divider />
						<ScrollArea h={280} type="auto">
							<Stack gap="xs">
								{dependencyReport.nodes.length === 0 && (
									<Text c="dimmed">No tasks in the current document.</Text>
								)}
								{dependencyReport.nodes.map((node) => {
									const status =
										dependencyReport.statuses.get(node.id) ?? "active";
									return (
										<Paper key={node.id} withBorder p="sm" radius="md">
											<Group
												justify="space-between"
												wrap="nowrap"
												align="start"
											>
												<div>
													<Text fw={600} size="sm">
														{node.id}
													</Text>
													<Text size="sm">{node.taskText}</Text>
													{node.after.length > 0 && (
														<Text size="xs" c="dimmed">
															After: {node.after.join(", ")}
														</Text>
													)}
													{node.blocks.length > 0 && (
														<Text size="xs" c="dimmed">
															Blocks: {node.blocks.join(", ")}
														</Text>
													)}
												</div>
												<Badge
													color={
														status === "completed"
															? "teal"
															: status === "blocked"
																? "red"
																: "blue"
													}
												>
													{status}
												</Badge>
											</Group>
										</Paper>
									);
								})}
							</Stack>
						</ScrollArea>
					</Stack>
				</Tabs.Panel>

				<Tabs.Panel value="recurrence" pt="md">
					<Stack gap="sm">
						<Title order={4}>Recurrence modes</Title>
						<Text size="sm" c="dimmed">
							Add one of these tokens to a recurring task. The parser preserves
							the rule for future lifecycle automation.
						</Text>
						{[
							[
								"rec:strict",
								"Next due date is anchored to the previous due date.",
							],
							[
								"rec:workdays",
								"Weekend results are shifted forward to Monday.",
							],
							[
								"rec:completion",
								"Next due date is anchored to the completion date.",
							],
						].map(([token, description]) => (
							<Paper key={token} withBorder p="sm" radius="md">
								<Group justify="space-between" wrap="nowrap">
									<Code>{token}</Code>
									<Text size="sm" ta="right">
										{description}
									</Text>
								</Group>
							</Paper>
						))}
					</Stack>
				</Tabs.Panel>
			</Tabs>
		</Modal>
	);
}
