import { useCallback, useEffect, useState } from "react";
import { computeElapsed } from "../utils/formatTime";

const STORAGE_KEY = "timers";

const BASE_X = 20;
const BASE_Y = 100;
const X_OFFSET = 20;
const Y_OFFSET = 30;

export interface TimerState {
	id: number;
	elapsed: number;
	isActive: boolean;
	startTime: number | null;
	position: { x: number; y: number };
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
	} catch {
		// Invalid stored data
	}
	return [];
}

function saveTimers(timers: TimerState[]) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(timers));
	} catch {
		// Storage full or unavailable
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
				x: BASE_X + (id % 5) * X_OFFSET,
				y: BASE_Y + (id % 10) * Y_OFFSET,
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
