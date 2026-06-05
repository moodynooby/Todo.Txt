import { createContext, type ReactNode, useContext, useReducer } from "react";
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

export interface NotesState {
	notes: Note[];
}

export type NotesAction =
	| { type: "SET_NOTES"; payload: Note[] }
	| { type: "UPSERT_NOTE"; payload: Partial<Note> & { id: string } }
	| { type: "DELETE_NOTE"; payload: string }
	| { type: "ARCHIVE_NOTE"; payload: string }
	| { type: "TOGGLE_PIN"; payload: string }
	| { type: "SET_NOTE_COLOR"; payload: { id: string; color: NoteColor } };

export function notesReducer(
	state: NotesState,
	action: NotesAction,
): NotesState {
	switch (action.type) {
		case "SET_NOTES":
			return { ...state, notes: action.payload };
		case "UPSERT_NOTE": {
			const idx = state.notes.findIndex((n) => n.id === action.payload.id);
			if (idx >= 0) {
				return {
					...state,
					notes: state.notes.map((n, i) =>
						i === idx ? { ...n, ...action.payload, updatedAt: Date.now() } : n,
					),
				};
			}
			return {
				...state,
				notes: [
					...state.notes,
					{ ...action.payload, updatedAt: Date.now() } as Note,
				],
			};
		}
		case "DELETE_NOTE":
			return {
				...state,
				notes: state.notes.filter((n) => n.id !== action.payload),
			};
		case "ARCHIVE_NOTE":
			return {
				...state,
				notes: state.notes.map((n) =>
					n.id === action.payload
						? { ...n, archived: !n.archived, updatedAt: Date.now() }
						: n,
				),
			};
		case "TOGGLE_PIN":
			return {
				...state,
				notes: state.notes.map((n) =>
					n.id === action.payload
						? { ...n, pinned: !n.pinned, updatedAt: Date.now() }
						: n,
				),
			};
		case "SET_NOTE_COLOR":
			return {
				...state,
				notes: state.notes.map((n) =>
					n.id === action.payload.id
						? { ...n, color: action.payload.color, updatedAt: Date.now() }
						: n,
				),
			};
		default:
			return state;
	}
}

export const initialNotesState: NotesState = {
	notes: [],
};

export interface NotesContextValue {
	state: NotesState;
	dispatchNotes: (action: NotesAction) => void;
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

interface NotesProviderProps {
	children: ReactNode;
	initialNotes?: Note[];
}

export function NotesProvider({
	children,
	initialNotes = [],
}: NotesProviderProps) {
	const [state, dispatchNotes] = useReducer(notesReducer, {
		notes: initialNotes,
	});

	return (
		<NotesContext.Provider value={{ state, dispatchNotes }}>
			{children}
		</NotesContext.Provider>
	);
}
