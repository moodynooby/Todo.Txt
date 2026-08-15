import { useEffect, useRef } from "react";
import { playBeep } from "@/lib/beep";
import type { ParsedTodoContent, Task } from "@/types/todo";
import { getToday } from "@/utils/dateUtils";

/**
 * Automatic due-date reminders.
 *
 * Watches the parsed todo document and fires a browser notification + beep
 * the first time a task's due moment is reached while the app is open:
 *
 * - `due:2026-08-16T14:30` / `due:today@17:00` — fires at the exact clock time
 * - `due:today` (no time) — fires at 09:00, the default start-of-day reminder
 *
 * Each task is tracked by `id` so a reminder fires only once per due moment,
 * and completed tasks never trigger. The hook re-checks every 15 seconds and
 * on every document change so typing a new `due:` line schedules it live.
 */

const DEFAULT_DUE_HOUR = 9; // 09:00 when a date is given without a time

const minutesForTask = (task: Task): number => {
	if (task.dueTime) {
		const [h, m] = task.dueTime.split(":").map((v) => parseInt(v, 10));
		return h * 60 + m;
	}
	return DEFAULT_DUE_HOUR * 60;
};

/** ISO date string + minutes → epoch. */
const dueEpoch = (task: Task): number => {
	if (!task.due) return -1;
	const [y, mo, d] = task.due.split("-").map((v) => parseInt(v, 10));
	const date = new Date(y, mo - 1, d);
	date.setMinutes(date.getMinutes() + minutesForTask(task));
	return date.getTime();
};

export const useDueReminders = (taskData: ParsedTodoContent) => {
	const notifiedRef = useRef(new Set<number>());
	const lastCheckedDateRef = useRef("");

	useEffect(() => {
		if (!("Notification" in window)) return;
		const tasks = taskData.tasks;
		const today = getToday();

		// A new calendar day clears the per-day notification set.
		if (lastCheckedDateRef.current !== today) {
			lastCheckedDateRef.current = today;
			notifiedRef.current.clear();
		}

		let cancelled = false;

		const check = async () => {
			if (cancelled || Notification.permission !== "granted") return;
			const now = Date.now();
			tasks.forEach((task) => {
				if (task.completed || !task.due || notifiedRef.current.has(task.id)) {
					return;
				}
				if (dueEpoch(task) <= now) {
					notifiedRef.current.add(task.id);
					try {
						new Notification("Todo Due", {
							body: task.text,
							icon: "/icon192.png",
						});
					} catch (e) {
						console.warn("Failed to show due notification:", e);
					}
					playBeep();
				}
			});
		};

		const interval = window.setInterval(check, 15_000);
		check();
		return () => {
			cancelled = true;
			window.clearInterval(interval);
		};
	}, [taskData]);
};
