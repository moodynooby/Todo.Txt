import { useCallback, useState } from "react";

export interface TimerState {
	id: number;
	elapsed: number;
	isActive: boolean;
	startTime: number | null;
	position: { top: number; left: number };
}

export interface TimerData {
	id: number;
	elapsed: number;
	isActive: boolean;
	startTime: number | null;
}

const BASE_TOP = 100;
const BASE_LEFT = 20;
const TOP_OFFSET = 30;
const LEFT_OFFSET = 20;

const MAX_TIMERS = 5;
let nextId = 0;

function generatePosition(id: number): { top: number; left: number } {
	return {
		top: BASE_TOP + (id % 10) * TOP_OFFSET,
		left: BASE_LEFT + (id % 5) * LEFT_OFFSET,
	};
}

export const useTimers = () => {
	const [timers, setTimers] = useState<TimerState[]>([]);

	const setTimersFromRemote = useCallback((data: TimerData[]) => {
		setTimers(data.map((t) => ({ ...t, position: generatePosition(t.id) })));
	}, []);

	const addTimer = useCallback(() => {
		setTimers((prev) => {
			if (prev.length >= MAX_TIMERS) return prev;
			const id = Date.now() + nextId++;
			const newTimer: TimerState = {
				id,
				elapsed: 0,
				isActive: false,
				startTime: null,
				position: generatePosition(id),
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

	return {
		timers,
		setTimersFromRemote,
		addTimer,
		removeTimer,
		updateTimer,
	};
};
