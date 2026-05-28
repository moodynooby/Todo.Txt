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

	// Fast path: avoid stripHtml if there are no HTML tags, reducing processing time for plain text
	const text = content.includes("<") ? stripHtml(content, "\n") : content;
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
		// Quick date format check (YYYY-MM-DD) before full processing
		if (due.length === 10 && due[4] === "-" && due[7] === "-") {
			if (due < today) return "overdue";
			if (due === today) return "today";
			if (due === tomorrow) return "tomorrow";
		}
		return due;
	};

	// Use a single for-loop to reduce array allocations and multiple passes (split/filter/forEach)
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();
		if (!trimmed) continue;

		let isChecked = false;
		let cleanText = trimmed;

		// Optimized prefix checks to avoid expensive regex matches where possible
		if (trimmed.startsWith("x ") || trimmed.startsWith("X ")) {
			isChecked = true;
			cleanText = trimmed.slice(2);
		} else if (
			trimmed.startsWith("[x] ") ||
			trimmed.startsWith("[X] ") ||
			trimmed.startsWith("[ ] ")
		) {
			isChecked = trimmed[1].toLowerCase() === "x";
			cleanText = trimmed.slice(4);
		} else if (
			trimmed.startsWith("- [x] ") ||
			trimmed.startsWith("- [X] ") ||
			trimmed.startsWith("- [ ] ")
		) {
			isChecked = trimmed[3].toLowerCase() === "x";
			cleanText = trimmed.slice(6);
		} else {
			// Fallback to regex for more complex cases or other markers
			const checkboxMatch = trimmed.match(/^-?\[(.)\]\s/);
			if (checkboxMatch) {
				isChecked = checkboxMatch[1].toLowerCase() === "x";
				cleanText = trimmed.replace(/^-?\[.?\]\s/, "");
			} else if (/^x\s/i.test(trimmed)) {
				isChecked = true;
				cleanText = trimmed.slice(2);
			}
		}

		const task: Task = {
			id: tasks.length,
			text: cleanText,
			raw: trimmed,
			completed: isChecked,
		};

		if (isChecked) {
			completedCount++;
		}

		// Fast priority check: (A) prefix
		if (
			cleanText.startsWith("(") &&
			cleanText.length > 4 &&
			cleanText[2] === ")" &&
			cleanText[3] === " "
		) {
			const p = cleanText[1];
			if (p >= "A" && p <= "Z") {
				task.priority = p;
				if (!priorities[p]) priorities[p] = [];
				priorities[p].push(task);
			}
		}

		// Only attempt expensive regex matches if the identifying character is present
		if (cleanText.includes("+")) {
			const projectMatches = cleanText.match(/\+[\w-]+/g);
			if (projectMatches) {
				task.projects = projectMatches.map((p: string) => p.slice(1));
				for (const p of task.projects) {
					if (!projects[p]) projects[p] = [];
					projects[p].push(task);
				}
			}
		}

		if (cleanText.includes("@")) {
			const contextMatches = cleanText.match(/@[\w-]+/g);
			if (contextMatches) {
				task.contexts = contextMatches.map((c: string) => c.slice(1));
				for (const c of task.contexts) {
					if (!contexts[c]) contexts[c] = [];
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
					if (!dueDates[category]) dueDates[category] = [];
					dueDates[category].push(task);
				}
			}
		}

		tasks.push(task);
	}

	return { tasks, priorities, projects, contexts, dueDates, completedCount };
};
