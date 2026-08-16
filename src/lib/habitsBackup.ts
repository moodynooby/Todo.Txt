/** Field Notes Ritual: keep the daily practice available offline before sync connects. */

import type { Habit } from "@/types/habits";

const HABITS_BACKUP_KEY = "habits_backup";

/** Fix F1 (habits leg): habits previously had a backup reader but no writer —
 *  offline edits could be lost. Mirrors the notes backup shape `{ data,
 *  updatedAt }` for consistency with the engine's default mirror. */
export function writeHabitsBackup(habits: Habit[]): void {
	try {
		localStorage.setItem(
			HABITS_BACKUP_KEY,
			JSON.stringify({ data: habits, updatedAt: Date.now() }),
		);
	} catch {
		// Storage full or blocked — the cloud remains the source of truth.
	}
}

export function readHabitsBackup(): Habit[] {
	try {
		const raw = localStorage.getItem(HABITS_BACKUP_KEY);
		if (!raw) return [];
		const parsed: unknown = JSON.parse(raw);
		if (
			parsed &&
			typeof parsed === "object" &&
			Array.isArray((parsed as { data?: unknown }).data)
		) {
			return (parsed as { data: Habit[] }).data;
		}
		return Array.isArray(parsed) ? (parsed as Habit[]) : [];
	} catch {
		return [];
	}
}
