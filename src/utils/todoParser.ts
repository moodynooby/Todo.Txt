import type { ParsedTodoContent, Task } from "@/types/todo";
import { getToday, getTomorrow, getYesterday } from "./dateUtils";

/** Turn `14:3`, `9:05`, or `14:30:00` into a consistent `HH:MM` string. */
export const normaliseTime = (raw: string): string => {
	const parts = raw.split(":");
	if (parts.length < 2) return raw;
	const hh = String(parseInt(parts[0], 10)).padStart(2, "0");
	const mm = String(parseInt(parts[1], 10)).padStart(2, "0");
	return `${hh}:${mm}`;
};

const RE_IS_DATE = /^\d{4}-\d{2}-\d{2}$/;
const RE_IS_TIME = /^\d{1,2}:\d{2}(:\d{2})?$/;
const RE_CHECKBOX_MARKER = /^-?\[.?\]\s/;
const RE_CHECKED_MARKER = /^-?\[x\]\s/i;
const RE_X_PREFIX = /^x\s/i;
const RE_PRIORITY = /^\(([A-Z])\)\s/;
const RE_PROJECTS = /\+[\w][\w.-]*/g;
const RE_CONTEXTS = /@[\w][\w.-]*/g;
/* `due:` followed by a date or relative word, optionally suffixed with
 * `@HH:MM` or `THH:MM` clock time, e.g. due:2026-08-16T14:30,
 * due:today@17:00, due:tomorrow@09:00 */
const RE_DUE = /due:([\w-]+)(?:[@tT](\d{1,2}:\d{2}(?::\d{2})?))?/;

const parseRelativeDate = (
	value: string,
	dates: { today: string; tomorrow: string; yesterday: string },
): string | undefined => {
	if (value === "today") return dates.today;
	if (value === "tomorrow") return dates.tomorrow;
	if (value === "yesterday") return dates.yesterday;
	if (value === "now") return dates.today;
	if (RE_IS_DATE.test(value)) return value;
	return undefined;
};

export const parseTodoLine = (trimmed: string, id = 0): Task => {
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

	/* Project and context detection: tokens must start after a word
	 * boundary so stray symbols like email addresses aren't double-counted. */
	if (/\+/.test(cleanText)) {
		const projectMatches = cleanText.match(RE_PROJECTS);
		if (projectMatches) {
			task.projects = [
				...new Set(projectMatches.map((p: string) => p.slice(1))),
			];
		}
	}

	if (/@/.test(cleanText)) {
		const contextMatches = cleanText.match(RE_CONTEXTS);
		if (contextMatches) {
			task.contexts = [
				...new Set(contextMatches.map((c: string) => c.slice(1))),
			];
		}
	}

	if (cleanText.includes("due:")) {
		const dueMatch = cleanText.match(RE_DUE);
		if (dueMatch) {
			const value = dueMatch[1].toLowerCase();
			const timeRaw = dueMatch[2];
			const today = getToday();
			const tomorrow = getTomorrow();
			const yesterday = getYesterday();
			const dateContext = { today, tomorrow, yesterday };
			const due = parseRelativeDate(value, dateContext);
			if (due) {
				task.due = due;
				if (timeRaw && RE_IS_TIME.test(timeRaw)) {
					// Store a normalised HH:MM:SS string
					task.dueTime = normaliseTime(timeRaw);
				} else if (value === "now" && timeRaw) {
					task.dueTime = normaliseTime(timeRaw);
				}
			} else if (RE_IS_TIME.test(value)) {
				// Bare time like `due:14:30` counts as today at that clock time
				task.due = today;
				task.dueTime = normaliseTime(value);
			}
		}
	}
	/* Detect a standalone `due:` with a value whose first character was
	 * missed by the main regex (e.g. unicode punctuation edge cases). */
	if (!task.due && cleanText.includes("due:")) {
		const fallback = cleanText.match(/due:(\S+)/);
		if (fallback) {
			const value = fallback[1].toLowerCase().replace(/[,;]+$/, "");
			if (RE_IS_TIME.test(value)) {
				task.due = getToday();
				task.dueTime = normaliseTime(value);
			}
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

		const task = parseTodoLine(trimmed, i);

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
