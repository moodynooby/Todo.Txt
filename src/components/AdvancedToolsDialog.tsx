import {
	Alert,
	Badge,
	Code,
	Divider,
	Group,
	Modal,
	Paper,
	ScrollArea,
	Stack,
	Text,
} from "@mantine/core";
import { useMemo } from "react";
import type { ParsedTodoContent, Task } from "@/types/todo";
import {
	DependencyGraph,
	type DependencyGraphNode,
	parseTaskMetadata,
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
	const dependencyReport = useMemo(
		() => buildDependencyReport(taskData.tasks),
		[taskData.tasks],
	);

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title="Task dependencies"
			size="lg"
			radius="lg"
			centered
		>
			<Stack gap="sm">
				<Group justify="space-between" align="end">
					<Text size="sm" c="dimmed">
						Status is computed from <Code>after:id</Code> prerequisites and
						completion state.
					</Text>
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
							const status = dependencyReport.statuses.get(node.id) ?? "active";
							return (
								<Paper key={node.id} withBorder p="sm" radius="md">
									<Group justify="space-between" wrap="nowrap" align="start">
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
		</Modal>
	);
}
