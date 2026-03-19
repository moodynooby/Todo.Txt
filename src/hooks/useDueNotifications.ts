import { useEffect } from "react";
import type { Task } from "../utils/todoParser";

const STORAGE_KEY_PREFIX = "todo-notifications-";

export const useDueNotifications = (tasks: Task[]) => {
	useEffect(() => {
		if (!("Notification" in window)) {
			console.log("This browser does not support desktop notification");
			return;
		}

		const checkDueTasks = async () => {
			if (Notification.permission === "default") {
				await Notification.requestPermission();
			}

			if (Notification.permission !== "granted") {
				return;
			}

			const today = new Date().toISOString().split("T")[0];
			const storageKey = `${STORAGE_KEY_PREFIX}${today}`;

			// Load previously notified tasks for today
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
				// Check if task has a due date and it matches today
				// Also check if we haven't notified about it yet today
				return task.due === today && !notifiedTaskIds.includes(task.id);
			});

			if (dueTasks.length === 0) return;

			// Send notifications
			dueTasks.forEach((task) => {
				new Notification("Todo Due Today", {
					body: task.text,
					icon: "/icon192.png", // Assuming this exists based on public folder structure
				});
				notifiedTaskIds.push(task.id);
			});

			// Update storage
			localStorage.setItem(storageKey, JSON.stringify(notifiedTaskIds));

			// Cleanup old keys (optional, but good practice to keep storage clean)
			// Simple cleanup: remove keys from yesterday or before?
			// For simplicity, we just leave them. They are small arrays.
		};

		checkDueTasks();
	}, [tasks]);
};
