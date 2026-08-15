/** Field Notes Ritual: native side of the web's HabitReminderManager.
 *
 * In Tauri builds this replaces browser polling with OS-scheduled daily
 * notifications; in web/PWA builds it renders nothing and does nothing.
 *
 * Listens for `native-reminder-action` custom events dispatched from
 * src/lib/nativeReminders.ts (notification action buttons) and dispatches
 * the same HabitsContext actions the UI uses, so "Mark done" from a
 * notification updates the habit exactly like a button tap.
 */

import { useEffect, useRef } from "react";
import { useHabitsContext } from "@/context/HabitsContext";
import {
	cancelHabitReminder,
	isTauri,
	type ReminderActionKind,
	scheduleHabitReminder,
} from "@/lib/nativeReminders";
import { formatLocalDate as formatLocalDateUtil } from "@/utils/habitUtils";

export default function HabitNativeReminder() {
	const { state, dispatchHabits } = useHabitsContext();
	const lastSyncRef = useRef<string>("");

	useEffect(() => {
		if (!isTauri()) return;

		// Re-sync schedules whenever habits change (guard avoids noisy loops:
		// scheduleHabitReminder only re-schedules when the serialized state
		// actually differs).
		const sync = async () => {
			const serialized = state.habits
				.map(
					(habit) =>
						`${habit.id}:${habit.reminderEnabled}:${habit.reminderTime}`,
				)
				.join(",");
			if (serialized === lastSyncRef.current) return;
			lastSyncRef.current = serialized;

			for (const habit of state.habits) {
				if (!habit.archived) {
					await scheduleHabitReminder(habit);
				} else {
					await cancelHabitReminder(habit.id);
				}
			}
		};
		void sync();
	}, [state.habits]);

	useEffect(() => {
		if (!isTauri()) return;
		const handler = (event: Event) => {
			const payload = (event as CustomEvent<ReminderActionKind>).detail;
			if (payload.kind === "mark-done-habit") {
				dispatchHabits({
					type: "TOGGLE_COMPLETION",
					payload: { id: payload.id, date: formatLocalDateUtil(new Date()) },
				});
			} else if (payload.kind === "snooze-habit") {
				// Snooze is handled at the native layer (reschedule notification);
				// the habit itself is intentionally untouched until completed.
				void scheduleHabitReminder(
					state.habits.find((habit) => habit.id === payload.id) ?? {
						id: payload.id,
						name: "",
						reminderEnabled: true,
						reminderTime: "09:00",
					},
				);
			}
		};
		window.addEventListener("native-reminder-action", handler);
		return () => window.removeEventListener("native-reminder-action", handler);
	}, [dispatchHabits, state.habits]);

	return null;
}
