import { useEffect, useRef } from "react";
import { playBeep } from "@/lib/beep";
import type { Task } from "@/types/todo";
import { getToday } from "@/utils/dateUtils";

export const useDueNotifications = (tasks: Task[]) => {
	const lastCheckedDateRef = useRef<string>("");
	const notifiedIdsRef = useRef(new Set<number>());

	useEffect(() => {
		if (!("Notification" in window)) return;

		const today = getToday();
		if (lastCheckedDateRef.current !== today) {
			lastCheckedDateRef.current = today;
			notifiedIdsRef.current.clear();
		}

		let cancelled = false;

		const checkDueTasks = async () => {
			if (Notification.permission === "default") {
				await Notification.requestPermission();
			}

			if (cancelled) return;

			if (Notification.permission !== "granted") return;

			const dueTasks = tasks.filter(
				(task) => task.due === today && !notifiedIdsRef.current.has(task.id),
			);

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
				notifiedIdsRef.current.add(task.id);
			});

			playBeep();
		};

		checkDueTasks().catch((e) =>
			console.error("Due notification check failed:", e),
		);

		return () => {
			cancelled = true;
		};
	}, [tasks]);
};
