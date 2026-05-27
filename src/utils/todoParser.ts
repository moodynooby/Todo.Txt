import type { ParsedTodoContent, Task } from "@/types/todo";
import { getToday, getTomorrow, getYesterday } from "./dateUtils";
import { stripHtml } from "./html";

const parseRelativeDate = (
	value: string,
	dates: { today: string; tomorrow: string; yesterday: string },
): string | undefined => {
	if (value === "today") {
		return dates.today;
	}
	if (value === "tomorrow") {
		return dates.tomorrow;
	}
	if (value === "yesterday") {
		return dates.yesterday;
	}
	if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		return value;
	}
	return undefined;
};

export const parseTodoContent = (content: string): ParsedTodoContent => {
	if (!content)
		return {
			tasks: [],
			priorities: {},
			projects: {},
			contexts: {},
			dueDates: {},
		};

	const text = stripHtml(content, "\n");
	const lines = text.split("\n").filter((line) => line.trim());

	const tasks: Task[] = [];
	const priorities: Record<string, Task[]> = {};
	const projects: Record<string, Task[]> = {};
	const contexts: Record<string, Task[]> = {};
	const dueDates: Record<string, Task[]> = {};

	const today = getToday();
	const tomorrow = getTomorrow();
	const yesterday = getYesterday();
	const dateContext = { today, tomorrow, yesterday };

	const categorizeDueDate = (due: string): string => {
		if (/^\d{4}-\d{2}-\d{2}$/.test(due)) {
			if (due < today) return "overdue";
			if (due === today) return "today";
			if (due === tomorrow) return "tomorrow";
		}
		return due;
	};

	lines.forEach((line, index) => {
		const trimmed = line.trim();
		if (!trimmed) return;

		const hasCheckboxMarker = /^-?\[.?\]\s/.test(trimmed);
		const isChecked = /^-?\[x\]\s/i.test(trimmed);
		const hasXPrefix = /^x\s/i.test(trimmed);

		const cleanText = hasCheckboxMarker
			? trimmed.replace(/^-?\[.?\]\s/, "")
			: trimmed;

		const task: Task = {
			id: index,
			text: cleanText,
			raw: trimmed,
			completed: isChecked || hasXPrefix,
		};

		const priorityMatch = cleanText.match(/^\(([A-Z])\)\s/);
		if (priorityMatch) {
			task.priority = priorityMatch[1];
			if (!priorities[task.priority]) {
				priorities[task.priority] = [];
			}
			priorities[task.priority].push(task);
		}

		const projectMatches = cleanText.match(/\+[\w-]+/g);
		if (projectMatches) {
			task.projects = projectMatches.map((p: string) => p.slice(1));
			task.projects.forEach((p: string) => {
				if (!projects[p]) {
					projects[p] = [];
				}
				projects[p].push(task);
			});
		}

		const contextMatches = cleanText.match(/@[\w-]+/g);
		if (contextMatches) {
			task.contexts = contextMatches.map((c: string) => c.slice(1));
			task.contexts.forEach((c: string) => {
				if (!contexts[c]) {
					contexts[c] = [];
				}
				contexts[c].push(task);
			});
		}

		const dueMatch = cleanText.match(/due:([\w-]+)/);
		if (dueMatch) {
			const value = dueMatch[1].toLowerCase();
			task.due = parseRelativeDate(value, dateContext);
			if (task.due) {
				const category = categorizeDueDate(task.due);
				if (!dueDates[category]) {
					dueDates[category] = [];
				}
				dueDates[category].push(task);
			}
		}

		tasks.push(task);
	});

	return { tasks, priorities, projects, contexts, dueDates };
};
