/** Field Notes Ritual: calm, growing habits expressed as compact daily records. */

export const HABIT_COLORS = [
	"#2f6f61",
	"#d9784f",
	"#748f6c",
	"#9f6a4d",
	"#536d8d",
	"#9a7fbd",
] as const;

export type HabitColor = (typeof HABIT_COLORS)[number];

export interface Habit {
	id: string;
	name: string;
	color: HabitColor;
	reminderEnabled: boolean;
	reminderTime: string;
	completedDates: string[];
	archived: boolean;
	createdAt: number;
	updatedAt: number;
}

export interface HabitDraft {
	name: string;
	color: HabitColor;
	reminderEnabled: boolean;
	reminderTime: string;
}
