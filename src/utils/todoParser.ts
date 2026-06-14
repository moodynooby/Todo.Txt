import type { ParsedTodoContent, Task } from "@/types/todo";
import { getToday, getTomorrow, getYesterday } from "./dateUtils";

const RE_IS_DATE = /^\d{4}-\d{2}-\d{2}$/;
const RE_CHECKBOX_MARKER = /^-?\[.?\]\s/;
const RE_CHECKED_MARKER = /^-?\[x\]\s/i;
const RE_X_PREFIX = /^x\s/i;
const RE_PRIORITY = /^\(([A-Z])\)\s/;
const RE_PROJECTS = /\+[\w-]+/g;
const RE_CONTEXTS = /@[\w-]+/g;
const RE_DUE = /due:([\w-]+)/;

export interface DateContext {
	today: string;
	tomorrow: string;
	yesterday: string;
}

const parseRelativeDate = (
	value: string,
	dates: DateContext,
): string | undefined => {
	if (value === "today") return dates.today;
	if (value === "tomorrow") return dates.tomorrow;
	if (value === "yesterday") return dates.yesterday;
	if (RE_IS_DATE.test(value)) return value;
	return undefined;
};

export const parseTodoLine = (
	trimmed: string,
	id = 0,
	dateContext?: DateContext,
): Task => {
	const hasCheckboxMarker = RE_CHECKBOX_MARKER.test(trimmed);
	const isChecked = hasCheckboxMarker && RE_CHECKED_MARKER.test(trimmed);
	const hasXPrefix = !hasCheckboxMarker && RE_X_PREFIX.test(trimmed);

	const cleanText = hasCheckboxMarker
		? trimmed.replace(RE_CHECKBOX_MARKER, "")
		: trimmed;

	const completed = isChecked || hasXPrefix;

	const task: Task = {
		id,
		text: cleanText,
		raw: trimmed,
		completed,
	};

	if (cleanText.startsWith("(")) {
		const priorityMatch = cleanText.match(RE_PRIORITY);
		if (priorityMatch) {
			task.priority = priorityMatch[1];
		}
	}

	if (cleanText.includes("+")) {
		const projectMatches = cleanText.match(RE_PROJECTS);
		if (projectMatches) {
			task.projects = projectMatches.map((p: string) => p.slice(1));
		}
	}

	if (cleanText.includes("@")) {
		const contextMatches = cleanText.match(RE_CONTEXTS);
		if (contextMatches) {
			task.contexts = contextMatches.map((c: string) => c.slice(1));
		}
	}

	if (cleanText.includes("due:")) {
		const dueMatch = cleanText.match(RE_DUE);
		if (dueMatch) {
			const value = dueMatch[1].toLowerCase();
			const ctx = dateContext || {
				today: getToday(),
				tomorrow: getTomorrow(),
				yesterday: getYesterday(),
			};
			task.due = parseRelativeDate(value, ctx);
		}
	}

	return task;
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

	const text = content;
	const rawLines = text.split("\n");

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
		if (RE_IS_DATE.test(due)) {
			if (due < today) return "overdue";
			if (due === today) return "today";
			if (due === tomorrow) return "tomorrow";
		}
		return due;
	};

	for (let i = 0; i < rawLines.length; i++) {
		const trimmed = rawLines[i].trim();
		if (!trimmed) continue;

		const task = parseTodoLine(trimmed, i, dateContext);

		if (task.completed) {
			completedCount++;
		}

		if (task.priority) {
			if (!priorities[task.priority]) {
				priorities[task.priority] = [];
			}
			priorities[task.priority].push(task);
		}

		if (task.projects) {
			for (const p of task.projects) {
				if (!projects[p]) {
					projects[p] = [];
				}
				projects[p].push(task);
			}
		}

		if (task.contexts) {
			for (const c of task.contexts) {
				if (!contexts[c]) {
					contexts[c] = [];
				}
				contexts[c].push(task);
			}
		}

		if (task.due) {
			const category = categorizeDueDate(task.due);
			if (!dueDates[category]) {
				dueDates[category] = [];
			}
			dueDates[category].push(task);
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
