import type { ParsedTodoContent, Task } from "@/types/todo";
import { getToday, getTomorrow, getYesterday } from "./dateUtils";
import { stripHtml } from "./html";

const parseRelativeDate = (
	value: string,
	dates: { today: string; tomorrow: string; yesterday: string },
): string | undefined => {
	if (value === "today") return dates.today;
	if (value === "tomorrow") return dates.tomorrow;
	if (value === "yesterday") return dates.yesterday;
	if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
	return undefined;
};

// Reuse regex for consistency and performance
const CHECKBOX_REGEX = /^-?\[.?\]\s/;
const COMPLETED_REGEX = /^-?\[x\]\s/i;
const X_PREFIX_REGEX = /^x\s/i;

export const parseTodoContent = (content: string): ParsedTodoContent => {
	if (!content)
		return {
			tasks: [],
			priorities: {},
			projects: {},
			contexts: {},
			dueDates: {},
			completedCount: 0,
		};

	const text = stripHtml(content, "\n");
	const lines = text.split("\n");

	const tasks: Task[] = [];
	const priorities: Record<string, Task[]> = {};
	const projects: Record<string, Task[]> = {};
	const contexts: Record<string, Task[]> = {};
	const dueDates: Record<string, Task[]> = {};
	let completedCount = 0;

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

	for (let i = 0; i < lines.length; i++) {
		const trimmed = lines[i].trim();
		if (!trimmed) continue;

		const completed =
			COMPLETED_REGEX.test(trimmed) || X_PREFIX_REGEX.test(trimmed);
		if (completed) {
			completedCount++;
		}

		const cleanText = CHECKBOX_REGEX.test(trimmed)
			? trimmed.replace(CHECKBOX_REGEX, "")
			: trimmed;

		const task: Task = {
			id: tasks.length, // Stable contiguous IDs
			text: cleanText,
			raw: trimmed,
			completed,
		};

		// Fast-path: only use regex if potential markers exist
		if (cleanText.includes("(")) {
			const priorityMatch = cleanText.match(/^\(([A-Z])\)\s/);
			if (priorityMatch) {
				task.priority = priorityMatch[1];
				if (!priorities[task.priority]) {
					priorities[task.priority] = [];
				}
				priorities[task.priority].push(task);
			}
		}

		if (cleanText.includes("+")) {
			const projectMatches = cleanText.match(/\+[\w-]+/g);
			if (projectMatches) {
				task.projects = projectMatches.map((p: string) => p.slice(1));
				for (let j = 0; j < task.projects.length; j++) {
					const p = task.projects[j];
					if (!projects[p]) {
						projects[p] = [];
					}
					projects[p].push(task);
				}
			}
		}

		if (cleanText.includes("@")) {
			const contextMatches = cleanText.match(/@[\w-]+/g);
			if (contextMatches) {
				task.contexts = contextMatches.map((c: string) => c.slice(1));
				for (let j = 0; j < task.contexts.length; j++) {
					const c = task.contexts[j];
					if (!contexts[c]) {
						contexts[c] = [];
					}
					contexts[c].push(task);
				}
			}
		}

		if (cleanText.includes("due:")) {
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
		}

		tasks.push(task);
	}

	return {
		tasks,
		priorities,
		projects,
		contexts,
		dueDates,
		completedCount,
	};
};
