import { useCallback, useEffect, useState } from "react";
import { computeElapsed } from "../utils/formatTime";

const STORAGE_KEY = "timers";

const BASE_TOP = 100;
const BASE_LEFT = 20;
const TOP_OFFSET = 30;
const LEFT_OFFSET = 20;

export interface TimerState {
	id: number;
	elapsed: number;
	isActive: boolean;
	startTime: number | null;
	position: { top: number; left: number };
}

function loadTimers(): TimerState[] {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const timers: TimerState[] = JSON.parse(stored);
			const now = Date.now();
			return timers.map((t) => {
				if (t.isActive && t.startTime !== null) {
					return {
						...t,
						elapsed: computeElapsed(t.elapsed, t.startTime),
						startTime: now,
					};
				}
				return t;
			});
		}
	} catch (e) {
		console.error("Failed to load timers from localStorage:", e);
	}
	return [];
}

function saveTimers(timers: TimerState[]) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
	} catch (e) {
		console.error("Failed to save timers to localStorage:", e);
	}
}

let nextId = Date.now();

export const useTimers = () => {
	const [timers, setTimers] = useState<TimerState[]>(loadTimers);

	useEffect(() => {
		saveTimers(timers);
	}, [timers]);

	const addTimer = useCallback(() => {
		const id = nextId++;
		const newTimer: TimerState = {
			id,
			elapsed: 0,
			isActive: false,
			startTime: null,
			position: {
				top: BASE_TOP + (id % 10) * TOP_OFFSET,
				left: BASE_LEFT + (id % 5) * LEFT_OFFSET,
			},
		};
		setTimers((prev) => [...prev, newTimer]);
	}, []);

	const removeTimer = useCallback((id: number) => {
		setTimers((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const updateTimer = useCallback(
		(id: number, updates: Partial<Omit<TimerState, "id">>) => {
			setTimers((prev) =>
				prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
			);
		},
		[],
	);

	return { timers, addTimer, removeTimer, updateTimer };
};
