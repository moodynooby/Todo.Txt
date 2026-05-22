import { useEffect } from "react";
import type { Task } from "../types/todo";
import { playBeep } from "../utils/beep";
import { getToday } from "../utils/dateUtils";

const STORAGE_KEY_PREFIX = "todo-notifications-";

export const useDueNotifications = (tasks: Task[]) => {
	useEffect(() => {
		if (!("Notification" in window)) {
			return;
		}

		const checkDueTasks = async () => {
			if (Notification.permission === "default") {
				await Notification.requestPermission();
			}

			if (Notification.permission !== "granted") {
				return;
			}

			const today = getToday();
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

			const dueTasks = tasks.filter((task) => {
				return task.due === today && !notifiedTaskIds.includes(task.id);
			});

			if (dueTasks.length === 0) return;

			dueTasks.forEach((task) => {
				new Notification("Todo Due Today", {
					body: task.text,
					icon: "/icon192.png",
				});
				notifiedTaskIds.push(task.id);
			});

			playBeep();

			localStorage.setItem(storageKey, JSON.stringify(notifiedTaskIds));
		};

		checkDueTasks();
	}, [tasks]);
};
