import { useCallback, useEffect, useRef, useState } from "react";
import type { Note, NoteColor } from "@/types/notes";
import { safeGetItem, safeSetItem } from "./storage";

const STORAGE_KEY = "notes-data";
const DEBOUNCE_MS = 500;

function generateId(): string {
	return `note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function createNote(partial?: Partial<Note>): Note {
	const now = Date.now();
	return {
		id: generateId(),
		title: "",
		content: "",
		color: "#fff475" as NoteColor,
		pinned: false,
		archived: false,
		createdAt: now,
		updatedAt: now,
		...partial,
	};
}

export function loadNotes(): Note[] {
	return safeGetItem<Note[]>(STORAGE_KEY, []);
}

export function saveNotes(notes: Note[]): void {
	safeSetItem(STORAGE_KEY, notes);
}

export function useNotes() {
	const [notes, setNotes] = useState<Note[]>(loadNotes);
	const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
	const scheduleSave = useCallback((updated: Note[]) => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			saveNotes(updated);
		}, DEBOUNCE_MS);
	}, []);

	const upsertNote = useCallback(
		(partial: Partial<Note> & { id: string }) => {
			setNotes((prev) => {
				const idx = prev.findIndex((n) => n.id === partial.id);
				const updated =
					idx >= 0
						? prev.map((n, i) =>
								i === idx ? { ...n, ...partial, updatedAt: Date.now() } : n,
							)
						: [...prev, createNote({ ...partial, updatedAt: Date.now() })];
				scheduleSave(updated);
				return updated;
			});
		},
		[scheduleSave],
	);

	const deleteNote = useCallback(
		(id: string) => {
			setNotes((prev) => {
				const updated = prev.filter((n) => n.id !== id);
				scheduleSave(updated);
				return updated;
			});
		},
		[scheduleSave],
	);

	const archiveNote = useCallback(
		(id: string) => {
			setNotes((prev) => {
				const note = prev.find((n) => n.id === id);
				if (!note) return prev;
				const updated = prev.map((n) =>
					n.id === id
						? { ...n, archived: !n.archived, updatedAt: Date.now() }
						: n,
				);
				scheduleSave(updated);
				return updated;
			});
		},
		[scheduleSave],
	);

	const togglePin = useCallback(
		(id: string) => {
			setNotes((prev) => {
				const note = prev.find((n) => n.id === id);
				if (!note) return prev;
				const updated = prev.map((n) =>
					n.id === id ? { ...n, pinned: !n.pinned, updatedAt: Date.now() } : n,
				);
				scheduleSave(updated);
				return updated;
			});
		},
		[scheduleSave],
	);

	const setNoteColor = useCallback(
		(id: string, color: NoteColor) => upsertNote({ id, color }),
		[upsertNote],
	);

	useEffect(() => {
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, []);

	return {
		notes,
		setNotes,
		upsertNote,
		deleteNote,
		archiveNote,
		togglePin,
		setNoteColor,
	};
}
