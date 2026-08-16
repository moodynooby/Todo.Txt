/** Field Notes Ritual: native reminder engine for Tauri builds.
 *
 * Bridges the web app's habit and todo data to Tauri's native notification
 * system so reminders fire from the OS even when the app is closed:
 *
 * - `habit_<id>` recurring daily reminders at the habit's reminderTime
 * - `todo-due-today` one-time nudge for tasks due today or already overdue
 *
 * Web/PWA builds are unaffected: every function here is a no-op outside Tauri.
 * Notification actions ("Mark done" / "Snooze") are wired at init and dispatch
 * into the existing HabitsContext / todo toggle logic via window events, so the
 * same reducer code handles both in-app and notification-triggered actions.
 */

import {
	cancel,
	channels,
	createChannel,
	onAction,
	registerActionTypes,
	Schedule,
	sendNotification,
} from "@tauri-apps/plugin-notification";

export const HABIT_CHANNEL_ID = "habits";
export const TODO_CHANNEL_ID = "todo-due";
const PENDING_ACTIONS_KEY = "native_pending_actions";

/** Notification actions a reminder can carry (see initReminderActions). */
export type ReminderActionKind =
	| { kind: "mark-done-habit"; id: string }
	| { kind: "snooze-habit"; id: string; minutes: number }
	| { kind: "mark-done-todo"; line: number }
	| { kind: "snooze-todo"; date: string };

/** Is this app running inside a Tauri shell? */
export function isTauri(): boolean {
	return "__TAURI__" in window || "__TAURI_INTERNALS__" in window || false;
}

/** Parse a serialized action payload stored by the action handler. */
export function parseActionPayload(
	raw: string | Record<string, unknown> | null | undefined,
): ReminderActionKind | null {
	if (!raw) return null;
	try {
		const parsed: Record<string, unknown> =
			typeof raw === "string" ? JSON.parse(raw) : raw;
		const kind = parsed.kind;
		if (
			kind === "mark-done-habit" ||
			kind === "snooze-habit" ||
			kind === "mark-done-todo" ||
			kind === "snooze-todo"
		) {
			return parsed as unknown as ReminderActionKind;
		}
		return null;
	} catch {
		return null;
	}
}

/** Create the app's notification channels (Android importance, sound, etc.). */
async function ensureChannels() {
	try {
		const existing = await channels();
		if (!existing.find((channel) => channel.id === HABIT_CHANNEL_ID)) {
			await createChannel({
				id: HABIT_CHANNEL_ID,
				name: "Habit Reminders",
				importance: 4, // High — visible, audible, can peek
				description: "Daily habit check-in reminders",
			});
		}
		if (!existing.find((channel) => channel.id === TODO_CHANNEL_ID)) {
			await createChannel({
				id: TODO_CHANNEL_ID,
				name: "Due Tasks",
				importance: 4,
				description: "Reminders for tasks with due dates",
			});
		}
	} catch (error) {
		console.warn("Native notification channels could not be created:", error);
	}
}

/** Register the action types the OS can attach to reminder notifications. */
async function registerActionTypeS() {
	try {
		await registerActionTypes([
			{
				id: "habit-action",
				actions: [
					{ id: "mark-done", title: "Mark done", input: false },
					{ id: "snooze-30", title: "Snooze 30m", input: false },
					{ id: "snooze-60", title: "Snooze 1h", input: false },
				],
			},
			{
				id: "todo-action",
				actions: [
					{ id: "mark-done", title: "Mark done", input: false },
					{ id: "snooze-1h", title: "Snooze 1h", input: false },
				],
			},
		]);
	} catch (error) {
		// Action types are Android/iOS-only; desktop builds skip gracefully.
		console.info("Notification action types unavailable:", error);
	}
}

/** Schedule a recurring daily habit reminder at the habit's reminderTime. */
export async function scheduleHabitReminder(habit: {
	id: string;
	name: string;
	reminderEnabled: boolean;
	reminderTime: string;
}) {
	if (!habit.reminderEnabled) {
		await cancelHabitReminder(habit.id);
		return;
	}
	/* Android 12+ exact scheduling: the Kotlin exact-alarm plugin owns the
	 * alarm when the device allows it (USE_EXACT_ALARM granted at install
	 * for habit-tracking apps), which chains tomorrow's alarm natively so
	 * reminders fire while the app is closed. On devices that decline the
	 * permission, the notification plugin's inexact `Schedule.at`
	 * (allowWhileIdle) path is used transparently. */
	try {
		const [hours, minutes] = habit.reminderTime.split(":").map(Number);
		const atTime = new Date();
		atTime.setHours(hours, minutes, 0, 0);
		// If today's slot already passed, start repeating from tomorrow.
		if (atTime.getTime() <= Date.now()) {
			atTime.setDate(atTime.getDate() + 1);
		}
		const exact = await import("@/lib/exactAlarms");
		const usedExact = await exact.scheduleHabitReminderExact(habit);
		if (usedExact) return;
		sendNotification({
			id: Math.abs(hashIdExposed(`habit_${habit.id}`)),
			title: "A small moment for you",
			body: `Time for ${habit.name}. One small mark is still momentum.`,
			channelId: HABIT_CHANNEL_ID,
			sound: "default",
			actionTypeId: "habit-action",
			schedule: Schedule.at(atTime, true, true),
			extra: { kind: "habit", id: habit.id },
		});
	} catch (error) {
		console.warn("Habit reminder could not be scheduled:", error);
	}
}

/** Cancel a habit's recurring reminder (on delete/archive/toggle). */
export async function cancelHabitReminder(habitId: string) {
	/* The exact-alarm plugin cancels by the same `habit_<id>` key, and the
	 * call is idempotent, so a single attempt covers both scheduling paths. */
	try {
		const exact = await import("@/lib/exactAlarms");
		await exact.cancelHabitReminderExact(habitId);
		return;
	} catch {
		// Exact path unavailable (desktop / web / plugin failure): fall
		// through to the notification-plugin cancellation below.
	}
	try {
		await cancel([Math.abs(hashIdExposed(`habit_${habitId}`))]);
	} catch (error) {
		console.warn("Habit reminder could not be cancelled:", error);
	}
}

/** One-time nudge for tasks due today / already overdue. */
export async function notifyDueTodos(
	tasks: Array<{ id: number; text: string; raw?: string }>,
) {
	try {
		// Clear any prior nudge so restacking doesn't pile up stale IDs.
		await cancel([Math.abs(hashIdExposed("todo-due-today"))]);
		/* Per the parser grammar (`src/utils/todoParser.ts`), `-[x]` and the
		 * `x ` prefix both mean complete; the checkbox regex uses `.` so any
		 * flag char is matched. */
		const pending = tasks.filter(
			(task) => !task.raw?.match(/^-?\[x\]\s/i) && !task.raw?.match(/^x\s/i),
		);
		if (!pending.length) return;

		const shown = pending.slice(0, 3);
		sendNotification({
			id: Math.abs(hashIdExposed("todo-due-today")),
			title:
				shown.length === 1
					? "A task waits on you"
					: `${shown.length} tasks wait on you`,
			inboxLines: shown.map((task) =>
				task.text
					.replace(/^-?\[[ xX]\]\s?/, "")
					.replace(/\s*\+[\w][\w.-]*|\s*@\S+|due:\S+/g, "")
					.trim()
					.slice(0, 60),
			),
			channelId: TODO_CHANNEL_ID,
			sound: "default",
			actionTypeId: "todo-action",
			extra: { kind: "todo", line: shown[0].id },
		});
	} catch (error) {
		console.warn("Due-todo notification could not be shown:", error);
	}
}

/** Stable string hash so recurring reminders keep the same OS id. */
/* Exported so the exact-alarm router and widget bridge keep identical id
 * conventions with the notification-plugin fallback. */
export function hashIdExposed(input: string): number {
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		hash = (hash << 5) - hash + input.charCodeAt(i);
		hash |= 0;
	}
	return hash;
}

/** Dispatch a notification action into the app via a custom window event. */
function dispatchReminderAction(payload: ReminderActionKind) {
	try {
		window.dispatchEvent(
			new CustomEvent("native-reminder-action", { detail: payload }),
		);
		// Keep a durable copy so a cold-starting webview can consume it
		// once state is hydrated.
		const existing = parseActionPayload(
			localStorage.getItem(PENDING_ACTIONS_KEY),
		);
		const queue: ReminderActionKind[] = existing ? [existing] : [];
		queue.push(payload);
		localStorage.setItem(PENDING_ACTIONS_KEY, JSON.stringify(queue.slice(-10)));
	} catch {
		// Storage unavailable (private browsing) — action still dispatches live.
	}
}

/**
 * Call once at app startup. Sets up channels, action types, and the action
 * listener so OS notification buttons ("Mark done", "Snooze") reach the app.
 */
export async function initReminderActions() {
	if (!isTauri()) return;
	await ensureChannels();
	await registerActionTypeS();

	// onAction(cb): the native layer hands the original notification Options
	// back (with its `extra` payload) whenever an action button is pressed.
	// On Android the raw event envelope also carries the pressed button's
	// `actionId`; the JS type omits it, so we reach it through a cast.
	try {
		await onAction((notification) => {
			const actionId = (notification as unknown as { actionId?: string })
				.actionId;
			const payload = parseActionPayload(notification?.extra);
			if (!payload) return;
			if (payload.kind === "mark-done-habit" && actionId === "mark-done") {
				dispatchReminderAction(payload);
			} else if (
				payload.kind === "snooze-habit" &&
				(actionId === "snooze-30" || actionId === "snooze-60")
			) {
				dispatchReminderAction({
					...payload,
					minutes: actionId === "snooze-30" ? 30 : 60,
				});
			} else if (
				payload.kind === "mark-done-todo" &&
				actionId === "mark-done"
			) {
				dispatchReminderAction(payload);
			}
		});
	} catch {
		// Listener registration failures are non-fatal on desktop.
	}

	await consumePendingActions();
}

async function consumePendingActions() {
	try {
		const raw = localStorage.getItem(PENDING_ACTIONS_KEY);
		const payload = parseActionPayload(raw);
		if (payload) {
			dispatchReminderAction(payload);
			localStorage.removeItem(PENDING_ACTIONS_KEY);
		}
	} catch {
		// Queue drain is best-effort.
	}
}
