/** Field Notes Ritual: local-first daily habit state, designed for quiet repetition. */

import { createContext, type ReactNode, useContext, useReducer } from "react";
import type { Habit, HabitDraft } from "@/types/habits";

function generateHabitId(): string {
	return `habit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function createHabit(draft: HabitDraft): Habit {
	const now = Date.now();
	return {
		id: generateHabitId(),
		name: draft.name.trim(),
		color: draft.color,
		reminderEnabled: draft.reminderEnabled,
		reminderTime: draft.reminderTime,
		completedDates: [],
		archived: false,
		createdAt: now,
		updatedAt: now,
	};
}

export interface HabitsState {
	habits: Habit[];
}

export type HabitsAction =
	| { type: "SET_HABITS"; payload: Habit[] }
	| { type: "ADD_HABIT"; payload: HabitDraft }
	| {
			type: "UPDATE_HABIT";
			payload: { id: string; updates: Partial<HabitDraft> };
	  }
	| { type: "TOGGLE_COMPLETION"; payload: { id: string; date: string } }
	| { type: "ARCHIVE_HABIT"; payload: string }
	| { type: "DELETE_HABIT"; payload: string }
	| { type: "RESTORE_HABIT"; payload: Habit };

export function habitsReducer(
	state: HabitsState,
	action: HabitsAction,
): HabitsState {
	switch (action.type) {
		case "SET_HABITS":
			return { ...state, habits: action.payload };
		case "ADD_HABIT":
			return {
				...state,
				habits: [...state.habits, createHabit(action.payload)],
			};
		case "UPDATE_HABIT":
			return {
				...state,
				habits: state.habits.map((habit) =>
					habit.id === action.payload.id
						? { ...habit, ...action.payload.updates, updatedAt: Date.now() }
						: habit,
				),
			};
		case "TOGGLE_COMPLETION":
			return {
				...state,
				habits: state.habits.map((habit) => {
					if (habit.id !== action.payload.id) return habit;
					const isComplete = habit.completedDates.includes(action.payload.date);
					return {
						...habit,
						completedDates: isComplete
							? habit.completedDates.filter(
									(date) => date !== action.payload.date,
								)
							: [...habit.completedDates, action.payload.date],
						updatedAt: Date.now(),
					};
				}),
			};
		case "ARCHIVE_HABIT":
			return {
				...state,
				habits: state.habits.map((habit) =>
					habit.id === action.payload
						? { ...habit, archived: !habit.archived, updatedAt: Date.now() }
						: habit,
				),
			};
		case "DELETE_HABIT":
			return {
				...state,
				habits: state.habits.filter((habit) => habit.id !== action.payload),
			};
		case "RESTORE_HABIT": {
			/* Undo path for DELETE_HABIT: re-insert the full habit (same id,
			 * completion history intact) at its original position. */
			if (state.habits.some((habit) => habit.id === action.payload.id)) {
				return state;
			}
			const idx = state.habits.findIndex(
				(habit) => habit.createdAt > action.payload.createdAt,
			);
			if (idx < 0) {
				return { ...state, habits: [...state.habits, action.payload] };
			}
			const habits = [...state.habits];
			habits.splice(idx, 0, action.payload);
			return { ...state, habits };
		}
		default:
			return state;
	}
}

const HabitsContext = createContext<{
	state: HabitsState;
	dispatchHabits: (action: HabitsAction) => void;
} | null>(null);

export function useHabitsContext() {
	const context = useContext(HabitsContext);
	if (!context) {
		throw new Error("useHabitsContext must be used within HabitsProvider");
	}
	return context;
}

export function HabitsProvider({
	children,
	initialHabits = [],
}: {
	children: ReactNode;
	initialHabits?: Habit[];
}) {
	const [state, dispatchHabits] = useReducer(habitsReducer, {
		habits: initialHabits,
	});

	return (
		<HabitsContext.Provider value={{ state, dispatchHabits }}>
			{children}
		</HabitsContext.Provider>
	);
}
