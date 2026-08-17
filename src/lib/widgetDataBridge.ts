/** Field Notes Ritual: widget data bridge for Tauri builds.
 *
 * Home-screen widgets cannot read Firebase without duplicating auth, so the
 * webview pushes a compact projection of the app's data into the native
 * mirror (see the Kotlin `widgetdata` plugin). The Android
 * `AppWidgetProvider`s then render from that local store, which keeps the
 * widget accurate even after the app is force-killed.
 *
 * Web/PWA builds are unaffected: every function here is a no-op outside the
 * Tauri runtime, matching the convention in `nativeReminders.ts`.
 */

import { isTauri } from "@/lib/nativeReminders";
import type { Habit } from "@/types/habits";
import {
	formatLocalDate,
	getBestStreak,
	getHabitStreak,
	getLastDays,
} from "@/utils/habitUtils";

export interface WidgetTaskProjection {
	id: number;
	text: string;
	done: boolean;
	due?: string;
}

export interface WidgetHabitProjection {
	id: string;
	name: string;
	color: string;
	/** Current streak: days completed through today/yesterday, counting back. */
	streak: number;
	/** Longest streak ever recorded. */
	bestStreak: number;
	/** Completion rate over the trailing 28 days, percent. */
	rate28: number;
	/** Boolean per trailing day, oldest first — feeds heatmap / grid widgets. */
	last30: boolean[];
	/** Boolean per trailing day, oldest first (week grid rows). */
	last7: boolean[];
	/** 12 trailing weeks, each a 7-day Mon–Sun row oldest-first — heatmap. */
	last12Weeks: boolean[][];
	completedToday: boolean;
	/** Reminder time, used by the Today widget to order habit rows. */
	reminderTime?: string;
}

export interface WidgetHabitMomentum {
	bestStreak: number;
	bestHabitName: string;
	avgRate28: number;
	habitsDoneToday: number;
	habitsTotal: number;
}

export interface WidgetPayload {
	date: string;
	tasks: WidgetTaskProjection[];
	habits: WidgetHabitProjection[];
	/** Desktop + Android widget summary — best streak, today's progress, 28-day rate. */
	momentum?: WidgetHabitMomentum;
}

const WIDGET_SYNC_COMMAND = "plugin:widget-data|push";

/** Compact projection used for streak / heatmap / grid widgets. */
export function projectHabits(habits: Habit[]): WidgetHabitProjection[] {
	const today = formatLocalDate(new Date());
	const last30 = getLastDays(30).map(formatLocalDate);
	const last7 = getLastDays(7).map(formatLocalDate);
	const last84 = getLastDays(84).map(formatLocalDate);
	return habits
		.filter((habit) => !habit.archived)
		.map((habit) => ({
			id: habit.id,
			name: habit.name,
			color: habit.color,
			streak: getHabitStreak(habit),
			bestStreak: getBestStreak(habit),
			rate28: Math.round(
				(last30.filter((date) => habit.completedDates.includes(date)).length /
					30) *
					100,
			),
			last30: last30.map((date) => habit.completedDates.includes(date)),
			last7: last7.map((date) => habit.completedDates.includes(date)),
			last12Weeks: Array.from({ length: 12 }, (_, weekIndex) =>
				last84
					.slice(weekIndex * 7, weekIndex * 7 + 7)
					.map((date) => habit.completedDates.includes(date)),
			),
			completedToday: habit.completedDates.includes(today),
			reminderTime: habit.reminderTime,
		}));
}

/** Push the current app state into the native widget mirror. */
export async function pushWidgetData(payload: WidgetPayload): Promise<void> {
	if (!isTauri()) return;
	try {
		// Fix F6: the `push_widget_data` Rust command takes a named `payload`
		// parameter; the flat pass previously failed deserialization silently,
		// leaving widgets rendering stale data. Arguments must be wrapped.
		const { invoke } = await import("@tauri-apps/api/core");
		await invoke(WIDGET_SYNC_COMMAND, { payload });
	} catch (error) {
		// Mirror updates are best-effort; the widget simply shows stale
		// (still valid) data until the next push.
		console.warn("Widget data could not be pushed:", error);
	}
}
