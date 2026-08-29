/** Field Notes Ritual: durable local mirror of the todo document.
 *
 * The todo workspace's content is kept in Firestore once sync connects, but
 * before connect (offline, logged out, first launch) and as a crash-recovery
 * fallback, the full document is mirrored to localStorage under a single
 * versioned key. This module is the ONLY reader/writer for that mirror so
 * every consumer sees the same shape: `{ content, updatedAt }`.
 *
 * Fix F1: previously the todo backup was read once at migration, deleted,
 * and never rewritten — offline edits lived only in React memory. Both the
 * sync adapter (below) and the in-session backup effect now write through
 * this module on every change.
 */
import type { BackupData } from "@/types/sync";

export const TODO_BACKUP_KEY = "todo_content_backup";

/** Canonical todo backup reader. Parse JSON once, in one place. */
export function readTodoBackup(): BackupData | null {
	try {
		const raw = localStorage.getItem(TODO_BACKUP_KEY);
		if (!raw) return null;
		try {
			const parsed = JSON.parse(raw);
			if (
				parsed &&
				typeof parsed === "object" &&
				"content" in parsed &&
				typeof (parsed as { content: unknown }).content === "string"
			) {
				return parsed as BackupData;
			}
		} catch {
			// Legacy format: a plain string survived an old format transition.
		}
		// Accept a raw string as a zero-timestamp backup rather than losing it.
		if (typeof raw === "string" && raw.length > 0) {
			return { content: raw, updatedAt: 0 };
		}
		return null;
	} catch {
		return null;
	}
}

/** Write the current document (and its clock) to the local mirror. */
export function writeTodoBackup(content: string, updatedAt = Date.now()): void {
	try {
		localStorage.setItem(
			TODO_BACKUP_KEY,
			JSON.stringify({ content, updatedAt } satisfies BackupData),
		);
	} catch {
		// Storage full or blocked (private browsing quota) — the cloud remains
		// the source of truth; this mirror is a best-effort fallback.
	}
}
