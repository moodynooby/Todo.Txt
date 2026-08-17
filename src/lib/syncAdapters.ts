import { useEffect } from "react";
import { useHabitsContext } from "@/context/HabitsContext";
import { useNotesContext } from "@/context/NotesContext";
import { type TimerState, useTimerContext } from "@/context/TimerContext";
import { useTodoContext } from "@/context/TodoContext";
import { writeHabitsBackup } from "@/lib/habitsBackup";
import { writeNotesBackup } from "@/lib/notesBackup";
import {
	EXCALIDRAW_DOC,
	GROQ_SETTINGS_DOC,
	HABITS_DOC,
	NOTES_DOC,
	TIMERS_DOC,
	TODO_DOC,
} from "@/lib/syncPaths";
import { readTodoBackup, writeTodoBackup } from "@/lib/todoBackup";
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

/** Todo document: local-first string sync (`todos/main`).
 *
 *  Fix F1: the todo workspace was never registered with the sync engine —
 *  notes, habits, timers, excalidraw, and settings synced, but the product's
 *  namesake feature persisted only in React memory, and the one-time
 *  migration deleted its local backup. This adapter mirrors the notes
 *  pattern: localStorage backup on every change (via the shared `localKey`
 *  mechanism plus the canonical `todoBackup` reader) and a debounced
 *  content write through the single shared queue.
 */
export function useSyncedTodo(): void {
	const { state, dispatchTodo } = useTodoContext();
	useSyncedDocument<string>({
		path: TODO_DOC,
		value: state.content,
		applyRemote: (content) =>
			dispatchTodo({
				type: "SET_CONTENT",
				payload: { content, timestamp: Date.now() },
			}),
		// Fix (regression): the adapter previously relied on the engine's
		// default `localKey` mirror, which wrote `{ data, updatedAt }` — but
		// the todo backup reader expects `{ content, updatedAt }`. After the
		// first local edit the backup became unreadable, so a reload lost the
		// editor content (and on some paths rendered the raw stored JSON).
		// An explicit mirror keeps the shape identical to `todoBackup.ts`.
		mirror: (content, syncedAt) =>
			writeTodoBackup(
				content,
				typeof syncedAt === "number" ? syncedAt : undefined,
			),
		decode: (record) =>
			typeof record.content === "string" ? record.content : undefined,
	});
}

/** Startup helper: seed the todo adapter from the legacy backup once. */
export function getInitialTodoContent(): string {
	return readTodoBackup()?.content ?? "";
}

/** Notes: local-first array sync (`notes/main`). */
export function useSyncedNotes(): void {
	const { state, dispatchNotes } = useNotesContext();
	useSyncedDocument<Note[]>({
		path: NOTES_DOC,
		value: state.notes,
		applyRemote: (notes) =>
			dispatchNotes({ type: "SET_NOTES", payload: notes }),
		// Fix F1 (notes leg): the previously dead `writeNotesBackup` writer is
		// now invoked on every change through the engine's mirror hook, so the
		// offline startup seed is always current.
		mirror: (notes) => writeNotesBackup(notes),
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
		// Fix F1 (habits leg): habits had a backup reader but no writer path
		// at all; the mirror hook keeps the offline seed current on change.
		mirror: (habits) => writeHabitsBackup(habits),
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
	useSyncedTodo();
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

// ---------------------------------------------------------------------------
// Backup writers exported for external callers (tests, deep-link import),
// so the writer functions can never again be declared but never called.
// ---------------------------------------------------------------------------

export { writeHabitsBackup, writeNotesBackup };
