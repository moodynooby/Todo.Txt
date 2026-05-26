import { useDebouncedValue } from "@mantine/hooks";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFirestoreSync } from "@/hooks/useFirestoreSync";
import { useNotes } from "@/hooks/useNotes";
import type { TimerData } from "@/hooks/useTimers";
import { useTimers } from "@/hooks/useTimers";
import { useTipTap } from "@/hooks/useTipTap";
import type { ExcalidrawData } from "@/lib/excalidrawSync";
import {
	syncExcalidrawToText,
	syncTextToExcalidraw,
} from "@/lib/excalidrawSync";
import type { Note } from "@/types/notes";

/** Quick JSON hash of an object — good enough for change detection. */
function hash(v: unknown): string {
	return JSON.stringify(v);
}

export function useDataManagement(viewMode?: string) {
	const [rteContent, setRteContentState] = useState("");
	const rteContentRef = useRef(rteContent);

	useEffect(() => {
		rteContentRef.current = rteContent;
	}, [rteContent]);

	const [debouncedRteContent] = useDebouncedValue(rteContent, 1000);

	const handleContentChange = useCallback((content: string) => {
		setRteContentState(content);
	}, []);

	const { editor, setExternalContent } = useTipTap({
		initialContent: rteContent,
		onContentChange: handleContentChange,
	});

	const excalidrawDataRef = useRef<ExcalidrawData | null>(null);
	const [excalidrawData, setExcalidrawData] = useState<ExcalidrawData | null>(
		null,
	);
	excalidrawDataRef.current = excalidrawData;

	// Track data hashes to prevent redundant setExcalidrawData calls
	const excalidrawHashRef = useRef<string>("");

	// Wrap setExcalidrawData to skip redundant updates (breaks infinite loops).
	const setExcalidrawDataSafe = useCallback(
		(data: ExcalidrawData | null | ((prev: ExcalidrawData | null) => ExcalidrawData | null)) => {
			const resolved =
				typeof data === "function"
					? data(excalidrawDataRef.current)
					: data;

			const h = hash(resolved);
			if (h === excalidrawHashRef.current) return;
			excalidrawHashRef.current = h;

			setExcalidrawData(resolved);
		},
		[],
	);

	const [debouncedExcalidraw] = useDebouncedValue(excalidrawData, 3000);

	const handleRemoteExcalidraw = useCallback((data: ExcalidrawData | null) => {
		setExcalidrawDataSafe(data);
	}, [setExcalidrawDataSafe]);

	const handleRemoteContent = useCallback(
		(content: string) => {
			setExternalContent(content);
			setRteContentState(content);
		},
		[setExternalContent],
	);

	const {
		notes,
		setNotesFromRemote,
		upsertNote,
		deleteNote,
		archiveNote,
		togglePin,
		setNoteColor,
	} = useNotes();

	const [debouncedNotes] = useDebouncedValue(notes, 2000);

	const handleRemoteNotes = useCallback(
		(remoteNotes: Note[]) => {
			setNotesFromRemote(remoteNotes);
		},
		[setNotesFromRemote],
	);

	const [groqApiKey, setGroqApiKey] = useState("");

	const handleRemoteGroqApiKey = useCallback((key: string) => {
		setGroqApiKey(key);
	}, []);

	const handleGroqApiKeyChange = useCallback((key: string) => {
		setGroqApiKey(key);
	}, []);

	const { timers, setTimersFromRemote, addTimer, removeTimer, updateTimer } =
		useTimers();

	const timerData = useMemo(
		() =>
			timers.map(({ id, elapsed, isActive, startTime }) => ({
				id,
				elapsed,
				isActive,
				startTime,
			})),
		[timers],
	);

	const handleRemoteTimers = useCallback(
		(remote: TimerData[]) => {
			setTimersFromRemote(remote);
		},
		[setTimersFromRemote],
	);

	const prevViewMode = useRef(viewMode);

	useEffect(() => {
		if (viewMode === undefined) return;
		const prev = prevViewMode.current;
		prevViewMode.current = viewMode;
		if (viewMode === prev) return;

		if (viewMode === "excalidraw") {
			const current = excalidrawDataRef.current;
			// When switching to excalidraw, sync text content into drawing
			const hasText = rteContentRef.current?.trim();
			if (!hasText) return;

			const result = syncTextToExcalidraw(
				rteContentRef.current,
				current?.elements ?? [],
				(current?.appState as Record<string, unknown>) ?? {},
			);
			setExcalidrawDataSafe({
				elements: result.elements,
				appState: result.appState as ExcalidrawData["appState"],
			});
		} else if (viewMode === "text" && prev === "excalidraw") {
			const html = syncExcalidrawToText(
				excalidrawDataRef.current?.elements ?? [],
			);
			if (html) {
				setExternalContent(html);
				setRteContentState(html);
			}
		}
	}, [viewMode, setExternalContent, setExcalidrawDataSafe]);

	const { syncStatus, isConnected, user, connect, disconnect } =
		useFirestoreSync({
			content: debouncedRteContent,
			onRemoteContent: handleRemoteContent,
			notes: debouncedNotes,
			onRemoteNotes: handleRemoteNotes,
			excalidraw: debouncedExcalidraw,
			onRemoteExcalidraw: handleRemoteExcalidraw,
			groqApiKey,
			onRemoteGroqApiKey: handleRemoteGroqApiKey,
			timers: timerData,
			onRemoteTimers: handleRemoteTimers,
		});

	return {
		editor,
		setExternalContent,
		rteContent,
		setRteContentState,
		rteContentRef,
		handleContentChange,
		excalidrawData,
		setExcalidrawData: setExcalidrawDataSafe,
		excalidrawDataRef,
		notes,
		setNotesFromRemote,
		upsertNote,
		deleteNote,
		archiveNote,
		togglePin,
		setNoteColor,
		groqApiKey,
		handleGroqApiKeyChange,
		timers,
		addTimer,
		removeTimer,
		updateTimer,
		syncStatus,
		isConnected,
		user,
		connect,
		disconnect,
	};
}
