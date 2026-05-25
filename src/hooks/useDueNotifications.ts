import { useEffect, useRef } from "react";
import type { Task } from "../types/todo";
import { playBeep } from "../utils/beep";
import { getToday } from "../utils/dateUtils";
import { safeGetItem, safeSetItem } from "../utils/storage";

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

			const notifiedTaskIds: number[] = safeGetItem<number[]>(storageKey, []);

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

			safeSetItem(storageKey, notifiedTaskIds);
		};

		checkDueTasks().catch((e) =>
			console.error("Due notification check failed:", e),
		);

		return () => {
			cancelled = true;
		};
	}, [tasks]);
};
