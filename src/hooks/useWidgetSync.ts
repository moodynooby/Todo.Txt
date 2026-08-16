/** Field Notes Ritual: debounced bridge from app state to home-screen widgets. */
import { useEffect, useRef } from "react";
import { useHabitsContext } from "@/context/HabitsContext";
import { useTodoContext } from "@/context/TodoContext";
import { isTauri } from "@/lib/nativeReminders";
import type { WidgetTaskProjection } from "@/lib/widgetDataBridge";
import { projectHabits, pushWidgetData } from "@/lib/widgetDataBridge";
import { parseTodoContent } from "@/utils/todoParser";

/** Milliseconds to wait after the last change before syncing the widget mirror. */
const SYNC_DEBOUNCE_MS = 500;

/**
 * Projects the raw todo document into the compact widget task projection.
 * Uses the same parser the rest of the app uses so done-state never drifts.
 */
function projectTasks(content: string): WidgetTaskProjection[] {
	return parseTodoContent(content).tasks.map((task) => ({
		id: task.id,
		text: task.text,
		done: task.completed,
		due: task.due,
	}));
}

export function useWidgetSync(): void {
	const { state: habitsState } = useHabitsContext();
	const { state: todoState } = useTodoContext();
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (!isTauri()) return;
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => {
			const habits = projectHabits(habitsState.habits);
			const best = habits.reduce(
				(pick, habit) => (habit.streak > pick.streak ? habit : pick),
				habits[0] ?? { streak: 0, name: "" },
			);
			const payload = {
				date: new Date().toISOString().slice(0, 10),
				tasks: projectTasks(todoState.content),
				habits,
				momentum: {
					bestStreak: best.streak,
					bestHabitName: "streak" in best ? (best.name ?? "") : "",
					avgRate28: habits.length
						? Math.round(
								habits.reduce((sum, habit) => sum + habit.rate28, 0) /
									habits.length,
							)
						: 0,
					habitsDoneToday: habits.filter((habit) => habit.completedToday)
						.length,
					habitsTotal: habits.length,
				},
			};
			void pushWidgetData(payload);
		}, SYNC_DEBOUNCE_MS);
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
		// Any habit or todo change re-schedules the debounced push.
	}, [habitsState, todoState]);
}
