/** Field Notes Ritual: native side of due-date reminders for the todo editor.
 *
 * The web's `useDueReminders` only nags while the app is open. In Tauri
 * builds this companion hook pushes a native notification for tasks due
 * today or already overdue whenever the document is parsed, so the nudge
 * survives a closed app (the persistent daily schedule comes later in the
 * Week 3 work; this covers the "app-closed at due time" gap for today).
 */

import { useEffect, useRef } from "react";
import { isTauri, notifyDueTodos } from "@/lib/nativeReminders";
import type { ParsedTodoContent } from "@/types/todo";

export function useDueRemindersNative(taskData: ParsedTodoContent) {
	const lastFiredRef = useRef<string>("");

	useEffect(() => {
		if (!isTauri()) return;

		const todayTasks = (taskData.dueDates["today"] ?? []).concat(
			taskData.dueDates["overdue"] ?? [],
		);
		// Fire only for incomplete tasks; dedupe per content snapshot so a
		// reparse (e.g. live typing) doesn't restack the same notification.
		const pending = todayTasks.filter(
			(task) => !task.completed && !task.raw.match(/^-?\[[ xX]\]\s/),
		);
		const snapshot = pending.map((task) => `${task.id}:${task.text}`).join(",");

		if (!snapshot || snapshot === lastFiredRef.current) return;
		lastFiredRef.current = snapshot;

		void notifyDueTodos(pending);
	}, [taskData]);
}
