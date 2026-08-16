/** Field Notes Ritual: exact-alarm routing for Android 12+.
 *
 * Wraps habit-reminder scheduling so reminders use Android's exact
 * scheduling (`AlarmManager.setExactAndAllowWhileIdle` / `setAlarmClock`)
 * when the exact-alarm plugin reports it is allowed. Falls back to the
 * notification plugin's inexact `Schedule.at(..., allowWhileIdle)` path
 * otherwise, so reminders always fire — just possibly with OS-induced
 * drift on restricted devices.
 *
 * Web/PWA builds are unaffected: every function here is a no-op outside
 * the Tauri runtime.
 *
 * NOTE: this module must NOT statically import `./nativeReminders` —
 * `nativeReminders.scheduleHabitReminder` lazy-loads this module on
 * Android, so a static import would form a cycle. All cross-references
 * happen through lazy `import()` calls.
 */
import {
	cancel,
	Schedule,
	sendNotification,
} from "@tauri-apps/plugin-notification";

export interface ExactAlarmSchedule {
	id: string;
	epochMs: number;
	title: string;
	body: string;
	repeatDaily: boolean;
	repeatIntervalMs?: number;
	channelId: string;
}

export interface CanScheduleResult {
	allowed: boolean;
	requested: boolean;
	requiresRuntimeGrant: boolean;
	openSettingsIntent: boolean;
}

let cachedCanSchedule: CanScheduleResult | null = null;

async function tauriInvoke() {
	const core = await import("@tauri-apps/api/core");
	return core.invoke;
}

/** Is the app running inside a Tauri shell? (same check as nativeReminders.) */
function isTauriRuntime(): boolean {
	return "__TAURI__" in window || "__TAURI_INTERNALS__" in window || false;
}

/** Compute the next reminder time exactly as `scheduleHabitReminder` does. */
function computeNextTriggerTime(reminderTime: string): Date {
	const [hours, minutes] = reminderTime.split(":").map(Number);
	const atTime = new Date();
	atTime.setHours(hours, minutes, 0, 0);
	if (atTime.getTime() <= Date.now()) {
		atTime.setDate(atTime.getDate() + 1);
	}
	return atTime;
}

function makeFallbackSchedule(
	habit: { id: string; name: string },
	atTime: Date,
) {
	return {
		id: Math.abs(hashStable(`habit_${habit.id}`)),
		title: "A small moment for you",
		body: `Time for ${habit.name}. One small mark is still momentum.`,
		channelId: "habits",
		sound: "default" as const,
		actionTypeId: "habit-action",
		schedule: Schedule.at(atTime, true, true),
		extra: { kind: "habit", id: habit.id },
	};
}

/** Deterministic string hash — mirrors nativeReminders.hashId exactly. */
function hashStable(input: string): number {
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		hash = (hash << 5) - hash + input.charCodeAt(i);
		hash |= 0;
	}
	return hash;
}

/** Ask the native plugin whether exact alarms can be scheduled now. */
export async function canScheduleExactAlarms(): Promise<CanScheduleResult> {
	if (!isTauriRuntime()) {
		return {
			allowed: false,
			requested: false,
			requiresRuntimeGrant: false,
			openSettingsIntent: false,
		};
	}
	try {
		const invoke = await tauriInvoke();
		const result = (await invoke(
			"plugin:exact-alarms|can-schedule",
		)) as CanScheduleResult;
		cachedCanSchedule = result;
		return result;
	} catch {
		cachedCanSchedule = {
			allowed: false,
			requested: false,
			requiresRuntimeGrant: false,
			openSettingsIntent: false,
		};
		return cachedCanSchedule;
	}
}

/** Open the OS screen where the user can grant exact-alarm permission. */
export async function openExactAlarmSettings(): Promise<void> {
	if (!isTauriRuntime()) return;
	try {
		const invoke = await tauriInvoke();
		await invoke("plugin:exact-alarms|open-exact-alarm-settings");
	} catch (error) {
		console.warn("Exact-alarm settings could not be opened:", error);
	}
}

/**
 * Schedule a habit reminder, preferring exact scheduling when allowed.
 * Returns true if the exact path was used.
 */
export async function scheduleHabitReminderExact(habit: {
	id: string;
	name: string;
	reminderEnabled: boolean;
	reminderTime: string;
}): Promise<boolean> {
	if (!habit.reminderEnabled) {
		await cancelHabitReminderExact(habit.id);
		return false;
	}
	if (!isTauriRuntime()) return false;

	const allowed =
		cachedCanSchedule?.allowed ?? (await canScheduleExactAlarms()).allowed;
	if (!allowed) {
		// Inexact fallback: the original notification-plugin path, unchanged.
		const atTime = computeNextTriggerTime(habit.reminderTime);
		await sendNotification(makeFallbackSchedule(habit, atTime));
		return false;
	}

	// Exact path: hand scheduling fully to the Kotlin plugin so it owns
	// chaining tomorrow's alarm and boot re-apply.
	try {
		const invoke = await tauriInvoke();
		const atTime = computeNextTriggerTime(habit.reminderTime);
		await invoke("plugin:exact-alarms|schedule", {
			id: `habit_${habit.id}`,
			epochMs: atTime.getTime(),
			title: "A small moment for you",
			body: `Time for ${habit.name}. One small mark is still momentum.`,
			repeatDaily: true,
			channelId: "habits",
		} as unknown as Record<string, unknown>);
		return true;
	} catch (error) {
		console.warn("Exact alarm could not be scheduled, falling back:", error);
		const atTime = computeNextTriggerTime(habit.reminderTime);
		await sendNotification(makeFallbackSchedule(habit, atTime));
		return false;
	}
}

/** Cancel a habit reminder on whichever path scheduled it. */
export async function cancelHabitReminderExact(habitId: string): Promise<void> {
	if (!isTauriRuntime()) return;
	// The exact plugin cancels by id regardless of whether an exact alarm
	// exists for it (idempotent), so one call covers both scheduling paths.
	try {
		const invoke = await tauriInvoke();
		await invoke("plugin:exact-alarms|cancel", {
			id: `habit_${habitId}`,
		} as unknown as Record<string, unknown>);
		// The notification plugin's fallback notification shares the same
		// key, so cancel the OS-level notification registration too.
		await cancel([Math.abs(hashStable(`habit_${habitId}`))]);
	} catch {
		// Non-fatal; the old inexact notification may linger until expiry.
	}
}

/**
 * Reconcile every active reminder with the native exact-alarm store at app
 * launch. Idempotent: removes orphaned native alarms and posts missing ones.
 */
export async function syncExactAlarms(
	habits: Array<{
		id: string;
		name: string;
		reminderEnabled: boolean;
		reminderTime: string;
	}>,
): Promise<void> {
	if (!isTauriRuntime()) return;
	try {
		const allowed = await canScheduleExactAlarms();
		if (!allowed.allowed) return;
		const reminders = habits
			.filter((habit) => habit.reminderEnabled)
			.map((habit) => {
				const atTime = computeNextTriggerTime(habit.reminderTime);
				return {
					id: `habit_${habit.id}`,
					epochMs: atTime.getTime(),
					title: "A small moment for you",
					body: `Time for ${habit.name}. One small mark is still momentum.`,
					repeatDaily: true,
					channelId: "habits",
				} as ExactAlarmSchedule;
			});
		const invoke = await tauriInvoke();
		await invoke("plugin:exact-alarms|sync", {
			reminders,
		} as unknown as Record<string, unknown>);
	} catch (error) {
		console.warn("Exact-alarm sync could not run:", error);
	}
}
