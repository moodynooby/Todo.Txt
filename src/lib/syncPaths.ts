import type { UserDocPath } from "@/lib/firestoreClient";

/**
 * Central registry of all synced documents. Every feature that gets synced
 * (todos, excalidraw, settings, habits, ...) adds its path here so the
 * sync layer and consumers reference the same constants.
 */

export const TODO_DOC: UserDocPath = { collection: "todos", id: "main" };
export const EXCALIDRAW_DOC: UserDocPath = {
	collection: "excalidraw",
	id: "main",
};
export const GROQ_SETTINGS_DOC: UserDocPath = {
	collection: "settings",
	id: "groq",
} as const;

export const NOTES_DOC: UserDocPath = { collection: "notes", id: "main" };
export const TIMERS_DOC: UserDocPath = { collection: "timers", id: "main" };
export const PREFERENCES_DOC: UserDocPath = {
	collection: "settings",
	id: "preferences",
};
