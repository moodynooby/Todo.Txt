/** Field Notes Ritual: discreet reminders only fire after a user has explicitly enabled them. */

import { useEffect } from "react";
import { useHabitsContext } from "@/context/HabitsContext";
import { formatLocalDate } from "@/utils/habitUtils";

const REMINDER_LOG_KEY = "habits_reminder_log";

function readReminderLog(): Set<string> {
	try {
		const raw = localStorage.getItem(REMINDER_LOG_KEY);
		return new Set(raw ? (JSON.parse(raw) as string[]) : []);
	} catch {
		return new Set();
	}
}

function writeReminderLog(log: Set<string>): void {
	try {
		localStorage.setItem(REMINDER_LOG_KEY, JSON.stringify([...log].slice(-200)));
	} catch {
		// Storage can be unavailable in private browsing; reminders can still run.
	}
}

export default function HabitReminderManager() {
	const { state } = useHabitsContext();

	useEffect(() => {
		const checkReminders = () => {
			if (!("Notification" in window) || Notification.permission !== "granted") {
				return;
			}

			const now = new Date();
			const time = `${String(now.getHours()).padStart(2, "0")}:${String(
				now.getMinutes(),
			).padStart(2, "0")}`;
			const today = formatLocalDate(now);
			const log = readReminderLog();

			state.habits
				.filter(
					(habit) =>
						!habit.archived &&
						habit.reminderEnabled &&
						habit.reminderTime <= time &&
						!habit.completedDates.includes(today),
				)
				.forEach((habit) => {
					const key = `${habit.id}:${today}`;
					if (log.has(key)) return;
					try {
						new Notification("A small moment for you", {
							body: `Time for ${habit.name}. One small mark is still momentum.`,
							icon: "/todotxt2.svg",
						});
						log.add(key);
					} catch (error) {
						console.warn("Habit reminder could not be shown:", error);
					}
				});
			writeReminderLog(log);
		};

		checkReminders();
		const interval = window.setInterval(checkReminders, 60_000);
		return () => window.clearInterval(interval);
	}, [state.habits]);

	return null;
}
