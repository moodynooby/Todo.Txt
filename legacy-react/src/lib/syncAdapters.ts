import { useEffect } from "react";
import { useHabitsContext } from "@/context/HabitsContext";
import { useNotesContext } from "@/context/NotesContext";
import { type TimerState, useTimerContext } from "@/context/TimerContext";
import { useTodoContext } from "@/context/TodoContext";
import { writeHabitsBackup } from "@/lib/habitsBackup";
import { writeNotesBackup } from "@/lib/notesBackup";
import {
	EXCALIDRAW_DOC,
	HABITS_DOC,
	NOTES_DOC,
	TIMERS_DOC,
	TODO_DOC,
} from "@/lib/syncPaths";
import { readTodoBackup, writeTodoBackup } from "@/lib/todoBackup";
import { type AnyRecord, useSyncedDocument } from "@/lib/useSyncedDocument";
import type { Habit } from "@/types/habits";
import type { Note } from "@/types/notes";
import type { ExcalidrawData } from "@/types/sync";

/**
 * Feature adapters — the ONLY place where features meet the sync engine.
 *
 * Each adapter maps local state onto the generic `useSyncedDocument`
 * primitive through a per-document CODEC. Syncing a NEW feature means
 * writing one codec plus one hook call below — no touch to the engine, the
 * provider, or any other feature.
 */

/**
 * Wire shape + normalization rules for one synced document.
 *
 * Both consumers of a document's cloud form go through the same codec: the
 * live-sync adapter (decode/afterRead/encode options) and startup
 * reconciliation in `SyncContext.connect()` — so a pulled snapshot can never
 * reach feature state by rules different from the ones live updates follow.
 */
export interface SyncCodec<T> {
	/** Firestore field carrying this document's value. */
	valueKey: string;
	/** Firestore fields -> local value. `undefined` = leave local state alone
	 *  (never apply a malformed payload over good local data). */
	decode: (record: AnyRecord) => T | undefined;
	/** Local value -> Firestore fields. */
	encode: (value: T) => AnyRecord;
	/** Repair legacy/partial payloads right after decoding. */
	afterRead?: (value: T) => T;
}

export const TODO_CODEC: SyncCodec<string> = {
	valueKey: "content",
	decode: (r) => (typeof r.content === "string" ? r.content : undefined),
	encode: (content) => ({ content }),
};

export const NOTES_CODEC: SyncCodec<Note[]> = {
	valueKey: "value",
	decode: (r) => (Array.isArray(r.value) ? (r.value as Note[]) : undefined),
	encode: (notes) => ({ value: notes }),
};

export const TIMERS_CODEC: SyncCodec<TimerState[]> = {
	valueKey: "value",
	// Timers arriving from another device are force-reset to idle so a frozen
	// stopwatch can never be resumed on a different machine (per-device
	// runtime state).
	decode: (r) =>
		Array.isArray(r.value) ? (r.value as TimerState[]) : undefined,
	encode: (timers) => ({ value: timers }),
	afterRead: (timers) =>
		timers.map((t) => ({ ...t, isActive: false, startTime: null })),
};

export const HABITS_CODEC: SyncCodec<Habit[]> = {
	valueKey: "habits",
	decode: (r) =>
		Array.isArray(r.habits) ? (r.habits as unknown as Habit[]) : undefined,
	encode: (habits) => ({ habits }),
	// The habits UI assumes `completedDates` is a string array and `archived`
	// is a boolean — drop malformed entries and repair partial ones here so
	// neither the live path nor reconciliation can crash the view.
	afterRead: (habits) =>
		habits
			.filter(
				(h): h is Habit =>
					Boolean(h) && typeof h === "object" && typeof h.id === "string",
			)
			.map((habit) => ({
				...habit,
				completedDates: Array.isArray(habit.completedDates)
					? habit.completedDates.filter(
							(d): d is string => typeof d === "string",
						)
					: [],
				archived: Boolean(habit.archived),
			})),
};

export const EXCALIDRAW_CODEC: SyncCodec<ExcalidrawData | null> = {
	valueKey: "data",
	decode: (r) =>
		"data" in r ? (r.data as ExcalidrawData | null | undefined) : undefined,
	encode: (data) => ({ data }),
};

/** Run a raw cloud FIELD value (the shape startup reconciliation sees)
 *  through a codec's full decode + afterRead chain. */
export function normalizeFieldValue<T>(
	codec: SyncCodec<T>,
	raw: unknown,
): T | undefined {
	const decoded = codec.decode({ [codec.valueKey]: raw });
	if (decoded === undefined) return undefined;
	return codec.afterRead ? codec.afterRead(decoded) : decoded;
}

/** Todo document: local-first string sync (`todos/main`). */
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
		// The explicit mirror keeps the backup shape identical to
		// `todoBackup.ts`; the engine default would write `{ data }`.
		mirror: (content, syncedAt) =>
			writeTodoBackup(
				content,
				typeof syncedAt === "number" ? syncedAt : undefined,
			),
		encode: TODO_CODEC.encode,
		decode: TODO_CODEC.decode,
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
		encode: NOTES_CODEC.encode,
		decode: NOTES_CODEC.decode,
	});
}

/** Timers: idle-snapshot sync (`timers/main`). Running timers are dropped
 *  on write — see TIMERS_CODEC.afterRead for the read-side reset. */
export function useSyncedTimers(): void {
	const { state, dispatchTimer } = useTimerContext();
	useSyncedDocument<TimerState[]>({
		path: TIMERS_DOC,
		value: state.timers,
		applyRemote: (timers) =>
			dispatchTimer({ type: "SET_TIMERS", payload: timers }),
		beforeWrite: (timers) => timers.filter((t) => !t.isActive && !t.startTime),
		encode: TIMERS_CODEC.encode,
		decode: TIMERS_CODEC.decode,
		afterRead: TIMERS_CODEC.afterRead,
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
		encode: HABITS_CODEC.encode,
		decode: HABITS_CODEC.decode,
		afterRead: HABITS_CODEC.afterRead,
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
		encode: EXCALIDRAW_CODEC.encode,
		decode: EXCALIDRAW_CODEC.decode,
	});
}

/**
 * Mount every feature adapter in one place so the provider tree stays flat.
 * Drop a new `useSyncedX` call here to register a feature.
 */
export function SyncFeatures({
	excalidrawData,
	onExcalidrawChange,
}: {
	excalidrawData: ExcalidrawData | null;
	onExcalidrawChange: (data: ExcalidrawData | null) => void;
}) {
	useSyncedTodo();
	useSyncedNotes();
	useSyncedTimers();
	useSyncedHabits();
	useSyncedExcalidraw(excalidrawData, onExcalidrawChange);

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
