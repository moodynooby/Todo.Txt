export const NOTE_COLORS = [
	"#fff475",
	"#a7ffeb",
	"#cbf0f8",
	"#d7aefb",
	"#fdcfe8",
	"#c2e7ff",
] as const;

export type NoteColor = (typeof NOTE_COLORS)[number];

export interface Note {
	id: string;
	title: string;
	content: string;
	color: NoteColor;
	pinned: boolean;
	archived: boolean;
	createdAt: number;
	updatedAt: number;
}
