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
		const line = lines[i];
		const trimmed = line.trim();
		if (!trimmed) continue;

		// PERFORMANCE (Bolt): Fast path for completion check using startsWith instead of regex.
		// This significantly reduces overhead for large documents.
		const isChecked =
			trimmed.startsWith("[x] ") ||
			trimmed.startsWith("[X] ") ||
			trimmed.startsWith("x ") ||
			trimmed.startsWith("X ") ||
			trimmed.startsWith("-[x] ") ||
			trimmed.startsWith("-[X] ");

		const hasCheckboxMarker =
			!isChecked &&
			(trimmed.startsWith("[] ") ||
				trimmed.startsWith("[ ] ") ||
				trimmed.startsWith("-[] ") ||
				trimmed.startsWith("-[ ] "));

		const cleanText =
			isChecked || hasCheckboxMarker
				? trimmed.replace(/^-?\[.?\]\s|^(x|X)\s/, "")
				: trimmed;

		const task: Task = {
			id: i,
			text: cleanText,
			raw: trimmed,
			completed: isChecked,
		};

		if (isChecked) completedCount++;

		// PERFORMANCE (Bolt): Fast path for priority (A) check to avoid regex execution.
		if (
			cleanText.length >= 4 &&
			cleanText[0] === "(" &&
			cleanText[2] === ")" &&
			cleanText[3] === " "
		) {
			const priority = cleanText[1];
			task.priority = priority;
			if (!priorities[priority]) {
				priorities[priority] = [];
			}
			priorities[priority].push(task);
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
