import type { ParsedTodoContent, Task } from "../types/todo";
import { getToday, getTomorrow, getYesterday } from "./dateUtils";

const stripHtml = (html: string, replacement = "\n"): string => {
	if (!html) return "";
	return html.replace(/<[^>]*>/g, replacement);
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

	// Performance optimization: Hoist date calculations out of the loop
	const today = getToday();
	const tomorrow = getTomorrow();
	const yesterday = getYesterday();

	const parseRelativeDate = (value: string): string | undefined => {
		if (value === "today") return today;
		if (value === "tomorrow") return tomorrow;
		if (value === "yesterday") return yesterday;
		if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
		return undefined;
	};

	const categorizeDueDate = (due: string): string => {
		if (/^\d{4}-\d{2}-\d{2}$/.test(due)) {
			if (due < today) return "overdue";
			if (due === today) return "today";
			if (due === tomorrow) return "tomorrow";
		}
		return due;
	};

	const text = stripHtml(content, "\n");
	const lines = text.split("\n").filter((line) => line.trim());

	const tasks: Task[] = [];
	const priorities: Record<string, Task[]> = {};
	const projects: Record<string, Task[]> = {};
	const contexts: Record<string, Task[]> = {};
	const dueDates: Record<string, Task[]> = {};

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
				// Optimization: Use push instead of concat to avoid O(N^2)
				if (!projects[p]) projects[p] = [];
				projects[p].push(task);
			});
		}

		const contextMatches = cleanText.match(/@[\w-]+/g);
		if (contextMatches) {
			task.contexts = contextMatches.map((c: string) => c.slice(1));
			task.contexts.forEach((c: string) => {
				// Optimization: Use push instead of concat to avoid O(N^2)
				if (!contexts[c]) contexts[c] = [];
				contexts[c].push(task);
			});
		}

		const dueMatch = cleanText.match(/due:([\w-]+)/);
		if (dueMatch) {
			const value = dueMatch[1].toLowerCase();
			task.due = parseRelativeDate(value);
			if (task.due) {
				const category = categorizeDueDate(task.due);
				// Optimization: Use push instead of concat to avoid O(N^2)
				if (!dueDates[category]) dueDates[category] = [];
				dueDates[category].push(task);
			}
		}

		tasks.push(task);
	});

	return { tasks, priorities, projects, contexts, dueDates };
};
