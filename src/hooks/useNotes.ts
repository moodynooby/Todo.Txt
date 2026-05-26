import { useCallback, useState } from "react";
import type { Note, NoteColor } from "@/types/notes";

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

export function useNotes() {
	const [notes, setNotes] = useState<Note[]>([]);

	const setNotesFromRemote = useCallback((remote: Note[]) => {
		setNotes(remote);
	}, []);

	const upsertNote = useCallback((partial: Partial<Note> & { id: string }) => {
		setNotes((prev) => {
			const idx = prev.findIndex((n) => n.id === partial.id);
			return idx >= 0
				? prev.map((n, i) =>
						i === idx ? { ...n, ...partial, updatedAt: Date.now() } : n,
					)
				: [...prev, createNote({ ...partial, updatedAt: Date.now() })];
		});
	}, []);

	const deleteNote = useCallback((id: string) => {
		setNotes((prev) => prev.filter((n) => n.id !== id));
	}, []);

	const archiveNote = useCallback((id: string) => {
		setNotes((prev) => {
			const note = prev.find((n) => n.id === id);
			if (!note) return prev;
			return prev.map((n) =>
				n.id === id
					? { ...n, archived: !n.archived, updatedAt: Date.now() }
					: n,
			);
		});
	}, []);

	const togglePin = useCallback((id: string) => {
		setNotes((prev) => {
			const note = prev.find((n) => n.id === id);
			if (!note) return prev;
			return prev.map((n) =>
				n.id === id ? { ...n, pinned: !n.pinned, updatedAt: Date.now() } : n,
			);
		});
	}, []);

	const setNoteColor = useCallback(
		(id: string, color: NoteColor) => upsertNote({ id, color }),
		[upsertNote],
	);

	return {
		notes,
		setNotesFromRemote,
		upsertNote,
		deleteNote,
		archiveNote,
		togglePin,
		setNoteColor,
	};
}
