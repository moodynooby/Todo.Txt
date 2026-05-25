export const NOTE_COLORS = [
	"#fff475",
	"#a7ffeb",
	"#cbf0f8",
	"#d7aefb",
	"#fdcfe8",
	"#c2e7ff",
] as const;

export type NoteColor = (typeof NOTE_COLORS)[number];

export const NOTE_TEXT_COLORS: Record<string, string> = {
	"#fff475": "#000",
	"#a7ffeb": "#000",
	"#cbf0f8": "#000",
	"#d7aefb": "#000",
	"#fdcfe8": "#000",
	"#c2e7ff": "#000",
};

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
