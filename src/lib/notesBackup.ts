import type { Note } from "@/types/notes";

const NOTES_BACKUP_KEY = "notes_backup";

export interface NotesBackupData {
	notes: Note[];
	updatedAt: number;
}

/** Canonical notes backup reader. Parse JSON once, in one place. */
export function readNotesBackup(): Note[] {
	try {
		const raw = localStorage.getItem(NOTES_BACKUP_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (
			parsed &&
			typeof parsed === "object" &&
			Array.isArray((parsed as { notes?: unknown }).notes)
		) {
			return (parsed as NotesBackupData).notes;
		}
		if (Array.isArray(parsed)) {
			// Legacy format: raw array of notes
			return parsed as Note[];
		}
		return [];
	} catch {
		return [];
	}
}

export function writeNotesBackup(notes: Note[]): void {
	try {
		const data: NotesBackupData = { notes, updatedAt: Date.now() };
		localStorage.setItem(NOTES_BACKUP_KEY, JSON.stringify(data));
	} catch {}
}
