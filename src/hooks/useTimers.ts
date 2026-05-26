import { useCallback, useEffect, useState } from "react";
import { computeElapsed } from "@/utils/formatTime";
import { safeGetItem, safeSetItem } from "@/utils/storage";

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
	const stored = safeGetItem<TimerState[]>(STORAGE_KEY, []);
	const now = Date.now();
	return stored.map((t) => {
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

function saveTimers(timers: TimerState[]) {
	safeSetItem(STORAGE_KEY, timers);
}

const MAX_TIMERS = 5;
let nextId = 0;

export const useTimers = () => {
	const [timers, setTimers] = useState<TimerState[]>(loadTimers);

	useEffect(() => {
		saveTimers(timers);
	}, [timers]);

	const addTimer = useCallback(() => {
		setTimers((prev) => {
			if (prev.length >= MAX_TIMERS) return prev;
			const id = Date.now() + nextId++;
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
			return [...prev, newTimer];
		});
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
