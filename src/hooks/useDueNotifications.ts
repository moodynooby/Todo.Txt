import { useEffect, useRef } from "react";
import type { Task } from "../types/todo";
import { playBeep } from "../utils/beep";
import { getToday } from "../utils/dateUtils";

const STORAGE_KEY_PREFIX = "todo-notifications-";

export const useDueNotifications = (tasks: Task[]) => {
	const lastCheckedDateRef = useRef<string>("");

	useEffect(() => {
		if (!("Notification" in window)) return;

		const today = getToday();
		if (lastCheckedDateRef.current === today) return;
		lastCheckedDateRef.current = today;

		let cancelled = false;

		const checkDueTasks = async () => {
			if (Notification.permission === "default") {
				await Notification.requestPermission();
			}

			if (cancelled) return;

			if (Notification.permission !== "granted") return;

			const storageKey = `${STORAGE_KEY_PREFIX}${today}`;

			let notifiedTaskIds: number[] = [];
			try {
				const stored = localStorage.getItem(storageKey);
				if (stored) {
					notifiedTaskIds = JSON.parse(stored);
				}
			} catch (e) {
				console.error("Failed to parse notified tasks", e);
			}

			if (cancelled) return;

			const dueTasks = tasks.filter((task) => {
				return task.due === today && !notifiedTaskIds.includes(task.id);
			});

			if (dueTasks.length === 0) return;

			dueTasks.forEach((task) => {
				try {
					new Notification("Todo Due Today", {
						body: task.text,
						icon: "/icon192.png",
					});
				} catch (e) {
					console.warn("Failed to show notification:", e);
				}
				notifiedTaskIds.push(task.id);
			});

			playBeep();

			try {
				localStorage.setItem(storageKey, JSON.stringify(notifiedTaskIds));
			} catch (e) {
				console.error("Failed to save notified task IDs:", e);
			}
		};

		checkDueTasks().catch((e) =>
			console.error("Due notification check failed:", e),
		);

		return () => {
			cancelled = true;
		};
	}, [tasks]);
};
