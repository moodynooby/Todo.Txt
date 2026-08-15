import { useEffect } from "react";
import { useHabitsContext } from "@/context/HabitsContext";
import { useNotesContext } from "@/context/NotesContext";
import { type TimerState, useTimerContext } from "@/context/TimerContext";
import {
	EXCALIDRAW_DOC,
	GROQ_SETTINGS_DOC,
	HABITS_DOC,
	NOTES_DOC,
	TIMERS_DOC,
} from "@/lib/syncPaths";
import { useSyncedDocument } from "@/lib/useSyncedDocument";
import type { Habit } from "@/types/habits";
import type { Note } from "@/types/notes";
import type { ExcalidrawData } from "@/types/sync";

/**
 * Feature adapters — the ONLY place where features meet the sync engine.
 *
 * Each adapter is a plain component/hook call that maps local state to the
 * generic `useSyncedDocument` primitive. Syncing a NEW feature (habits, ...)
 * means writing one block like the ones below — no touch to the engine, the
 * provider, or any other feature.
 */

/** Notes: local-first array sync (`notes/main`). */
export function useSyncedNotes(): void {
	const { state, dispatchNotes } = useNotesContext();
	useSyncedDocument<Note[]>({
		path: NOTES_DOC,
		value: state.notes,
		applyRemote: (notes) =>
			dispatchNotes({ type: "SET_NOTES", payload: notes }),
		localKey: "notes_backup",
		decode: (r) => (Array.isArray(r.value) ? (r.value as Note[]) : undefined),
	});
}

/** Timers: idle-snapshot sync (`timers/main`).
 *
 *  - `beforeWrite`: running timers are dropped — runtime state is per-device.
 *  - `afterRead`: timers arriving from another device are force-reset to idle
 *    so a frozen stopwatch can never be resumed on a different machine.
 */
export function useSyncedTimers(): void {
	const { state, dispatchTimer } = useTimerContext();
	useSyncedDocument<TimerState[]>({
		path: TIMERS_DOC,
		value: state.timers,
		applyRemote: (timers) =>
			dispatchTimer({ type: "SET_TIMERS", payload: timers }),
		beforeWrite: (timers) => timers.filter((t) => !t.isActive && !t.startTime),
		afterRead: (timers) =>
			timers.map((t) => ({ ...t, isActive: false, startTime: null })),
	});
}

/** Habits: local-first daily records synced through the shared write queue. */
export function useSyncedHabits(): void {
	const { state, dispatchHabits } = useHabitsContext();
	useSyncedDocument<Habit[]>({
		path: HABITS_DOC,
		value: state.habits,
		applyRemote: (habits) =>
			dispatchHabits({ type: "SET_HABITS", payload: habits }),
		localKey: "habits_backup",
		encode: (habits) => ({ habits }),
		decode: (record) =>
			Array.isArray(record.habits)
				? (record.habits as unknown as Habit[])
				: undefined,
		afterRead: (habits) =>
			habits.map((habit) => ({
				...habit,
				completedDates: Array.isArray(habit.completedDates)
					? habit.completedDates
					: [],
				archived: Boolean(habit.archived),
			})),
	});
}

/** Props-based adapters for app-level state threaded through SyncProvider. */
export function useSyncedExcalidraw(
	data: ExcalidrawData | null,
	onChange: (data: ExcalidrawData | null) => void,
): void {
	useSyncedDocument<ExcalidrawData | null>({
		path: EXCALIDRAW_DOC,
		value: data,
		applyRemote: onChange,
		encode: (v) => ({ data: v }),
		decode: (r) =>
			"data" in r ? (r.data as ExcalidrawData | null | undefined) : undefined,
	});
}

export function useSyncedGroqApiKey(
	key: string,
	onChange: (key: string) => void,
): void {
	useSyncedDocument<string>({
		path: GROQ_SETTINGS_DOC,
		value: key,
		applyRemote: onChange,
		encode: (v) => ({ apiKey: v }),
		decode: (r) =>
			"apiKey" in r ? (r.apiKey as string | undefined) : undefined,
	});
}

/**
 * Mount every feature adapter in one place so the provider tree stays flat.
 * Drop a new `useSyncedX` call here to register a feature.
 */
export function SyncFeatures({
	excalidrawData,
	groqApiKey,
	onExcalidrawChange,
	onGroqApiKeyChange,
}: {
	excalidrawData: ExcalidrawData | null;
	groqApiKey: string;
	onExcalidrawChange: (data: ExcalidrawData | null) => void;
	onGroqApiKeyChange: (key: string) => void;
}) {
	useSyncedNotes();
	useSyncedTimers();
	useSyncedHabits();
	useSyncedExcalidraw(excalidrawData, onExcalidrawChange);
	useSyncedGroqApiKey(groqApiKey, onGroqApiKeyChange);

	// No-op render: the hooks own the integration; this component exists
	// purely to hang them under the engine context.
	useEffect(() => {
		// Intentionally empty — lifecycle belongs to the hooks above.
	}, []);

	return null;
}
