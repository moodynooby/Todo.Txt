import "@/styles/App.css";
import { AppShell, Box } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import {
	lazy,
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import AppHeader from "@/components/AppHeader/AppHeader";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { EditorContext } from "@/context/EditorContext";
import { useViewMode } from "@/context/ViewModeContext";
import AiToolsDialog from "@/features/ai/AiToolsDialog";
import TextModeContent from "@/features/editor/TextModeContent";
import NotesPage from "@/features/notes/NotesPage";
import Timer from "@/features/timer/Timer";
import { useDocumentSave } from "@/hooks/useDocumentSave";
import { useDueNotifications } from "@/hooks/useDueNotifications";
import { useFileHandler } from "@/hooks/useFileHandler";
import { useFirestoreSync } from "@/hooks/useFirestoreSync";
import { type TimerData, useTimers } from "@/hooks/useTimers";
import { useTipTap } from "@/hooks/useTipTap";
import type { Note } from "@/types/notes";
import type { Filter, ParsedTodoContent } from "@/types/todo";
import type { ExcalidrawData } from "@/utils/excalidrawStorageService";
import {
	syncExcalidrawToText,
	syncTextToExcalidraw,
} from "@/utils/excalidrawStorageService";
import { useNotes } from "@/utils/notesStorage";
import { parseTodoContent } from "@/utils/todoParser";

const ExcalidrawPage = lazy(
	() => import("@/features/excalidraw/ExcalidrawPage"),
);

const App = () => {
	const { viewMode } = useViewMode();
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [activeFilter, setActiveFilter] = useState<Filter | null>(null);
	const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

	const [rteContent, setRteContentState] = useState("");
	const rteContentRef = useRef(rteContent);

	useEffect(() => {
		rteContentRef.current = rteContent;
	}, [rteContent]);

	const [debouncedRteContent] = useDebouncedValue(rteContent, 1000);

	const prevViewMode = useRef(viewMode);

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

	useEffect(() => {
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
		} else if (viewMode === "text" && prev === "excalidraw") {
			const html = syncExcalidrawToText(
				excalidrawDataRef.current?.elements ?? [],
			);
			if (html) {
				setExternalContent(html);
				setRteContentState(html);
			}
		}
	}, [viewMode, setExternalContent]);

	const handleRemoteExcalidraw = useCallback((data: ExcalidrawData | null) => {
		setExcalidrawData(data);
	}, []);

	const [debouncedExcalidraw] = useDebouncedValue(excalidrawData, 3000);

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

	const {
		syncStatus,
		isConnected: isSynced,
		user,
		connect: connectSync,
		disconnect: disconnectSync,
	} = useFirestoreSync({
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

	const handleFileLoaded = useCallback(
		(html: string) => {
			setExternalContent(html);
			setRteContentState(html);
		},
		[setExternalContent],
	);

	const { fileInputRef, handleOpenRepo, handleFileChange } = useFileHandler({
		onFileLoaded: handleFileLoaded,
	});

	const taskData: ParsedTodoContent = useMemo(
		() => parseTodoContent(rteContent),
		[rteContent],
	);

	useDueNotifications(taskData.tasks);

	const handleSave = useDocumentSave(editor);

	const handleAiTools = useCallback((): void => {
		setIsAiDialogOpen(true);
	}, []);

	const handleToggleSidebar = useCallback(() => {
		setSidebarCollapsed((prev) => !prev);
	}, []);

	const handleAiInsert = (text: string, mode: "replace" | "append") => {
		if (!editor) return;

		if (mode === "replace" && !editor.state.selection.empty) {
			editor.chain().focus().deleteSelection().insertContent(text).run();
		} else if (mode === "append") {
			editor.chain().focus().insertContent(`\n${text}`).run();
		} else {
			editor.chain().focus().setContent(text).run();
		}
		setIsAiDialogOpen(false);
	};

	const editorContextValue = useMemo(
		() => ({
			editor,
			addTimer,
			onSave: handleSave,
			onOpen: handleOpenRepo,
			onAiTools: handleAiTools,
			sidebarCollapsed,
			onToggleSidebar: handleToggleSidebar,
			syncStatus,
			isSynced,
			user,
			onConnect: connectSync,
			onDisconnectSync: disconnectSync,
			groqApiKey,
			onGroqApiKeyChange: handleGroqApiKeyChange,
		}),
		[
			editor,
			addTimer,
			handleSave,
			handleOpenRepo,
			handleAiTools,
			sidebarCollapsed,
			handleToggleSidebar,
			syncStatus,
			isSynced,
			user,
			connectSync,
			disconnectSync,
			groqApiKey,
			handleGroqApiKeyChange,
		],
	);

	return (
		<EditorContext.Provider value={editorContextValue}>
			<AppShell header={{ height: 38 }} padding={0}>
				<AppShell.Header>
					<AppHeader />
				</AppShell.Header>

				<AppShell.Main
					pos="relative"
					style={{
						overflow: "hidden",
						...(viewMode === "text"
							? { display: "flex", flexDirection: "column" }
							: {}),
					}}
				>
					<ErrorBoundary>
						<AiToolsDialog
							isOpen={isAiDialogOpen}
							onClose={() => setIsAiDialogOpen(false)}
							initialContent={
								editor?.state.selection.empty
									? (editor?.getText() ?? "")
									: (editor?.state.doc.textBetween(
											editor.state.selection.from,
											editor.state.selection.to,
											"\n",
										) ?? "")
							}
							onInsert={handleAiInsert}
						/>
						<input
							type="file"
							ref={fileInputRef}
							className="file-input"
							accept=".txt,.md,.html"
							onChange={handleFileChange}
						/>
						{viewMode === "excalidraw" && (
							<Suspense fallback={<Box p="md">Loading Excalidraw...</Box>}>
								<ExcalidrawPage
									initialData={excalidrawData}
									onChange={(data) => setExcalidrawData(data)}
								/>
							</Suspense>
						)}
						{viewMode === "notes" && (
							<NotesPage
								notes={notes}
								upsertNote={upsertNote}
								deleteNote={deleteNote}
								archiveNote={archiveNote}
								togglePin={togglePin}
								setNoteColor={setNoteColor}
							/>
						)}
						{viewMode === "text" && (
							<TextModeContent
								taskData={taskData}
								activeFilter={activeFilter}
								onFilterChange={setActiveFilter}
							/>
						)}
					</ErrorBoundary>
				</AppShell.Main>
			</AppShell>

			{timers.map((timer) => (
				<Timer
					key={timer.id}
					timer={timer}
					onRemove={removeTimer}
					onUpdate={updateTimer}
				/>
			))}
		</EditorContext.Provider>
	);
};

export default App;
