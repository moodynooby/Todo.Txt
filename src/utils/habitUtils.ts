/** Field Notes Ritual: lightweight, local-date helpers for daily habit rhythm. */

import type { Habit } from "@/types/habits";

export function formatLocalDate(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function getLastDays(count: number): Date[] {
	return Array.from({ length: count }, (_, index) => {
		const date = new Date();
		date.setHours(0, 0, 0, 0);
		date.setDate(date.getDate() - (count - 1 - index));
		return date;
	});
}

export function isHabitCompleteOn(habit: Habit, date: string): boolean {
	return habit.completedDates.includes(date);
}

export function getHabitStreak(habit: Habit): number {
	const completed = new Set(habit.completedDates);
	const cursor = new Date();
	cursor.setHours(0, 0, 0, 0);
	if (!completed.has(formatLocalDate(cursor)))
		cursor.setDate(cursor.getDate() - 1);

	let streak = 0;
	while (completed.has(formatLocalDate(cursor))) {
		streak += 1;
		cursor.setDate(cursor.getDate() - 1);
	}
	return streak;
}

/**
 * Longest consecutive completed-day run ever recorded for the habit.
 * Walks the sorted completed dates forward, counting contiguous streaks
 * separated by exactly one day.
 */
export function getBestStreak(habit: Habit): number {
	const dates = [...habit.completedDates].sort();
	let best = 0;
	let current = 0;
	let previous = "";
	for (const date of dates) {
		if (previous === "") {
			current = 1;
		} else {
			const prevTime = new Date(`${previous}T00:00:00`).getTime();
			const curTime = new Date(`${date}T00:00:00`).getTime();
			if (curTime - prevTime === 86_400_000) current += 1;
			else current = 1;
		}
		if (current > best) best = current;
		previous = date;
	}
	return best;
}

export function getCompletionRate(habit: Habit, days = 28): number {
	const dates = getLastDays(days).map(formatLocalDate);
	return Math.round(
		(dates.filter((date) => habit.completedDates.includes(date)).length /
			days) *
			100,
	);
}
