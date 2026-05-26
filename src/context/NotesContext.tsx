import { createContext, useContext } from "react";
import type { Note, NoteColor } from "@/types/notes";

export interface NotesContextValue {
	notes: Note[];
	setNotesFromRemote: (remote: Note[]) => void;
	upsertNote: (partial: Partial<Note> & { id: string }) => void;
	deleteNote: (id: string) => void;
	archiveNote: (id: string) => void;
	togglePin: (id: string) => void;
	setNoteColor: (id: string, color: NoteColor) => void;
}

export const NotesContext = createContext<NotesContextValue | null>(null);

export const useNotesContext = (): NotesContextValue => {
	const ctx = useContext(NotesContext);
	if (!ctx) {
		throw new Error(
			"useNotesContext must be used within NotesContext.Provider",
		);
	}
	return ctx;
};
