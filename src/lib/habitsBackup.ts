/** Field Notes Ritual: keep the daily practice available offline before sync connects. */

import type { Habit } from "@/types/habits";

const HABITS_BACKUP_KEY = "habits_backup";

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
