import { createContext, type ReactNode, useContext, useReducer } from "react";
import type { SyncStatus } from "@/hooks/useFirestoreSync";

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

export const MAX_TIMERS = 5;

export function generatePosition(id: number): { top: number; left: number } {
	return {
		top: BASE_TOP + (id % 10) * TOP_OFFSET,
		left: BASE_LEFT + (id % 5) * LEFT_OFFSET,
	};
}

export interface TimersState {
	timers: TimerState[];
	syncStatus: SyncStatus;
	lastSyncAt: number | null;
}

export type TimerAction =
	| { type: "SET_TIMERS"; payload: TimerState[] }
	| { type: "ADD_TIMER" }
	| { type: "REMOVE_TIMER"; payload: number }
	| {
			type: "UPDATE_TIMER";
			payload: { id: number; updates: Partial<Omit<TimerState, "id">> };
	  }
	| { type: "SYNC_START" }
	| {
			type: "SYNC_COMPLETE";
			payload: { timers: TimerState[]; timestamp: number };
	  }
	| { type: "SYNC_ERROR" };

let nextTimerId = 0;

export function timerReducer(
	state: TimersState,
	action: TimerAction,
): TimersState {
	switch (action.type) {
		case "SET_TIMERS":
			return { ...state, timers: action.payload };
		case "ADD_TIMER": {
			if (state.timers.length >= MAX_TIMERS) return state;
			const id = Date.now() + nextTimerId++;
			const newTimer: TimerState = {
				id,
				elapsed: 0,
				isActive: false,
				startTime: null,
				position: generatePosition(id),
			};
			return { ...state, timers: [...state.timers, newTimer] };
		}
		case "REMOVE_TIMER":
			return {
				...state,
				timers: state.timers.filter((t) => t.id !== action.payload),
			};
		case "UPDATE_TIMER":
			return {
				...state,
				timers: state.timers.map((t) =>
					t.id === action.payload.id ? { ...t, ...action.payload.updates } : t,
				),
			};
		case "SYNC_START":
			return { ...state, syncStatus: "syncing" };
		case "SYNC_COMPLETE":
			return {
				...state,
				timers: action.payload.timers,
				syncStatus: "synced",
				lastSyncAt: action.payload.timestamp,
			};
		case "SYNC_ERROR":
			return { ...state, syncStatus: "error" };
		default:
			return state;
	}
}

export const initialTimersState: TimersState = {
	timers: [],
	syncStatus: "disconnected",
	lastSyncAt: null,
};

interface TimerContextValue {
	state: TimersState;
	dispatchTimer: (action: TimerAction) => void;
}

export const TimerContext = createContext<TimerContextValue | null>(null);

export const useTimerContext = (): TimerContextValue => {
	const ctx = useContext(TimerContext);
	if (!ctx) {
		throw new Error(
			"useTimerContext must be used within TimerContext.Provider",
		);
	}
	return ctx;
};

interface TimerProviderProps {
	children: ReactNode;
	initialTimers?: TimerState[];
}

export function TimerProvider({
	children,
	initialTimers = [],
}: TimerProviderProps) {
	const [state, dispatchTimer] = useReducer(timerReducer, {
		timers: initialTimers,
		syncStatus: "disconnected",
		lastSyncAt: null,
	});

	return (
		<TimerContext.Provider value={{ state, dispatchTimer }}>
			{children}
		</TimerContext.Provider>
	);
}
