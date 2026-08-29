import { parseTaskMetadata } from "@/lib/core";
import type { Task } from "@/types/todo";

/**
 * Task dependency graph (`after:` / `blocks:` metadata), backed by the
 * shared-core metadata parser so the grammar cannot drift between surfaces.
 */

export interface DependencyGraphNode {
	id: string;
	taskText: string;
	completed: boolean;
	after: string[];
	blocks: string[];
	status: "active" | "blocked" | "completed";
}

export class DependencyGraph {
	private nodes: Map<string, DependencyGraphNode> = new Map();

	addNode(node: DependencyGraphNode) {
		this.nodes.set(node.id, node);
	}

	detectCycles(): { hasCycle: boolean; cyclePath: string[] } {
		const visited = new Set<string>();
		const visiting = new Set<string>();
		let cyclePath: string[] = [];

		const dfs = (id: string, path: string[]): boolean => {
			visiting.add(id);
			path.push(id);

			const node = this.nodes.get(id);
			if (node) {
				const neighbors = new Set<string>([...node.blocks]);
				for (const [otherId, otherNode] of this.nodes.entries()) {
					if (otherNode.after.includes(id)) neighbors.add(otherId);
				}

				for (const neighbor of neighbors) {
					if (visiting.has(neighbor)) {
						cyclePath = [...path, neighbor];
						return true;
					}
					if (!visited.has(neighbor)) {
						if (dfs(neighbor, [...path])) return true;
					}
				}
			}

			visiting.delete(id);
			visited.add(id);
			return false;
		};

		for (const id of this.nodes.keys()) {
			if (!visited.has(id)) {
				if (dfs(id, [])) return { hasCycle: true, cyclePath };
			}
		}

		return { hasCycle: false, cyclePath: [] };
	}

	propagateStatus(): Map<string, "active" | "blocked" | "completed"> {
		const statuses = new Map<string, "active" | "blocked" | "completed">();

		for (const [id, node] of this.nodes.entries()) {
			if (node.completed) statuses.set(id, "completed");
		}

		let changed = true;
		while (changed) {
			changed = false;
			for (const [id, node] of this.nodes.entries()) {
				if (node.completed) continue;

				let isBlocked = false;
				for (const reqId of node.after) {
					const reqNode = this.nodes.get(reqId);
					if (!reqNode?.completed) {
						isBlocked = true;
						break;
					}
				}

				const newStatus = isBlocked ? "blocked" : "active";
				if (statuses.get(id) !== newStatus) {
					statuses.set(id, newStatus);
					changed = true;
				}
			}
		}

		return statuses;
	}
}

export interface DependencyReport {
	graph: DependencyGraph;
	nodes: DependencyGraphNode[];
	cycles: { hasCycle: boolean; cyclePath: string[] };
	statuses: Map<string, "active" | "blocked" | "completed">;
	missingReferences: string[];
}

export function buildDependencyReport(tasks: Task[]): DependencyReport {
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
