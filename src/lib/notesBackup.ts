import type { Note } from "@/types/notes";

const NOTES_BACKUP_KEY = "notes_backup";

export interface NotesBackupData {
	notes: Note[];
	/** Fix S3: the server-side timestamp of the snapshot that produced this
	 *  mirror — required so startup reconciliation compares server clocks
	 *  against the cloud, never a local wall clock. `syncedAt: 0` means the
	 *  mirror was only ever written by local edits (nothing synced yet). */
	updatedAt: number;
	syncedAt?: number;
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

/** Timestamped reader for startup reconciliation (fix S3). */
export function readNotesBackupWithTs(): NotesBackupData | null {
	try {
		const raw = localStorage.getItem(NOTES_BACKUP_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (
			parsed &&
			typeof parsed === "object" &&
			Array.isArray((parsed as { notes?: unknown }).notes)
		) {
			return parsed as NotesBackupData;
		}
		return null;
	} catch {
		return null;
	}
}

export function writeNotesBackup(notes: Note[], syncedAt?: number): void {
	try {
		const data: NotesBackupData = {
			notes,
			// The mirror clock records the server timestamp of the snapshot
			// that produced it (when known), so the seed is server-relative.
			updatedAt: syncedAt ?? Date.now(),
			syncedAt,
		};
		localStorage.setItem(NOTES_BACKUP_KEY, JSON.stringify(data));
	} catch {}
}
