import { useCallback, useEffect, useRef, useState } from "react";
import { useFirestoreSync } from "@/hooks/useFirestoreSync";
import { useNotes } from "@/hooks/useNotes";
import { useTimers } from "@/hooks/useTimers";
import { useTipTap } from "@/hooks/useTipTap";
import type { ExcalidrawData } from "@/lib/excalidrawSync";
import {
	syncExcalidrawToText,
	syncTextToExcalidraw,
} from "@/lib/excalidrawSync";
import { readBackup } from "@/lib/persistedState";
import type { Note } from "@/types/notes";

export function useDataManagement(viewMode?: string) {
	const initialContent = readBackup()?.data?.content ?? "";
	const [rteContent, setRteContentState] = useState(initialContent);
	const rteContentRef = useRef(rteContent);

	useEffect(() => {
		rteContentRef.current = rteContent;
	}, [rteContent]);

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

	const handleRemoteExcalidraw = useCallback((data: ExcalidrawData | null) => {
		setExcalidrawData(data);
	}, []);

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

	const { timers, addTimer, removeTimer, updateTimer } = useTimers();

	const prevViewMode = useRef(viewMode);

	useEffect(() => {
		if (viewMode === undefined) return;
		const prev = prevViewMode.current;
		prevViewMode.current = viewMode;
		if (viewMode === prev) return;

		if (viewMode === "excalidraw") {
			const current = excalidrawDataRef.current;
			const result = syncTextToExcalidraw(
				rteContentRef.current,
				current?.elements ?? [],
				(current?.appState as Record<string, unknown>) ?? {},
			);
			setExcalidrawData({
				elements: result.elements,
				appState: result.appState as ExcalidrawData["appState"],
			});
		} else if (viewMode === "todo" && prev === "excalidraw") {
			const html = syncExcalidrawToText(
				excalidrawDataRef.current?.elements ?? [],
			);
			if (html) {
				setExternalContent(html);
				setRteContentState(html);
			}
		}
	}, [viewMode, setExternalContent]);

	const handleRemoteState = useCallback(
		(state: {
			content: string;
			notes?: Note[];
			excalidraw?: ExcalidrawData | null;
			groqApiKey?: string;
		}) => {
			if (state.content !== undefined) handleRemoteContent(state.content);
			if (state.notes !== undefined) handleRemoteNotes(state.notes);
			if (state.excalidraw !== undefined)
				handleRemoteExcalidraw(state.excalidraw);
			if (state.groqApiKey !== undefined)
				handleRemoteGroqApiKey(state.groqApiKey);
		},
		[
			handleRemoteContent,
			handleRemoteNotes,
			handleRemoteExcalidraw,
			handleRemoteGroqApiKey,
		],
	);

	const { syncStatus, isConnected, user, authError, connect, disconnect } =
		useFirestoreSync({
			localState: {
				content: rteContent,
				notes,
				excalidraw: excalidrawData,
				groqApiKey,
			},
			onRemoteState: handleRemoteState,
		});

	return {
		editor,
		setExternalContent,
		rteContent,
		setRteContentState,
		rteContentRef,
		handleContentChange,
		excalidrawData,
		setExcalidrawData,
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
		authError,
		connect,
		disconnect,
	};
}
