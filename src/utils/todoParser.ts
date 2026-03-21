import dayjs from "dayjs";

export interface Task {
	id: number;
	text: string;
	raw: string;
	priority?: string;
	projects?: string[];
	contexts?: string[];
	due?: string;
}

export interface ParsedTodoContent {
	tasks: Task[];
	priorities: Record<string, Task[]>;
	projects: Record<string, Task[]>;
	contexts: Record<string, Task[]>;
}

const stripHtml = (html: string, replacement = "\n"): string => {
	if (!html) return "";
	return html.replace(/<[^>]*>/g, replacement);
};

const parseRelativeDate = (value: string): string | undefined => {
	if (value === "today") {
		return dayjs().format("YYYY-MM-DD");
	}
	if (value === "tomorrow") {
		return dayjs().add(1, "day").format("YYYY-MM-DD");
	}
	if (value === "yesterday") {
		return dayjs().subtract(1, "day").format("YYYY-MM-DD");
	}
	if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		return value;
	}
	return undefined;
};

export const parseTodoContent = (content: string): ParsedTodoContent => {
	if (!content)
		return { tasks: [], priorities: {}, projects: {}, contexts: {} };

	const text = stripHtml(content, "\n");
	const lines = text.split("\n").filter((line) => line.trim());

	const tasks: Task[] = [];
	const priorities: Record<string, Task[]> = { A: [], B: [], C: [] };
	const projects: Record<string, Task[]> = {};
	const contexts: Record<string, Task[]> = {};

	lines.forEach((line, index) => {
		const trimmed = line.trim();
		if (!trimmed) return;

		const task: Task = { id: index, text: trimmed, raw: line };

		const priorityMatch = trimmed.match(/^([A-Z])\s/);
		if (priorityMatch) {
			task.priority = priorityMatch[1];
			if (priorities[task.priority]) {
				priorities[task.priority].push(task);
			}
		}

		const projectMatches = trimmed.match(/\+[\w-]+/g);
		if (projectMatches) {
			task.projects = projectMatches.map((p) => p.slice(1));
			task.projects.forEach((p) => {
				projects[p] = (projects[p] || []).concat(task);
			});
		}

		const contextMatches = trimmed.match(/@[\w-]+/g);
		if (contextMatches) {
			task.contexts = contextMatches.map((c) => c.slice(1));
			task.contexts.forEach((c) => {
				contexts[c] = (contexts[c] || []).concat(task);
			});
		}

		const dueMatch = trimmed.match(/due:([\w-]+)/);
		if (dueMatch) {
			const value = dueMatch[1].toLowerCase();
			task.due = parseRelativeDate(value);
		}

		tasks.push(task);
	});

	return { tasks, priorities, projects, contexts };
};
