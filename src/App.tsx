import "./App.css";
import { AppShell, Box } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import {
	lazy,
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import AiToolsDialog from "./components/AiTools/AiToolsDialog";
import AppHeader from "./components/AppHeader/AppHeader";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";
import NotesPage from "./components/NotesPage/NotesPage";

import TextModeContent from "./components/TextModeContent/TextModeContent";
import { useDocumentSave } from "./hooks/useDocumentSave";
import { useDueNotifications } from "./hooks/useDueNotifications";
import { useFileHandler } from "./hooks/useFileHandler";
import { useFirestoreSync } from "./hooks/useFirestoreSync";
import { useTipTap } from "./hooks/useTipTap";
import { EditorContext } from "./providers/EditorContext";
import { useViewMode } from "./providers/ViewModeContext";
import type { Note } from "./types/notes";
import type { Filter, ParsedTodoContent } from "./types/todo";
import {
	syncExcalidrawToText,
	syncTextToExcalidraw,
} from "./utils/excalidrawStorageService";
import { useNotes } from "./utils/notesStorage";
import { parseTodoContent } from "./utils/todoParser";

const DEBOUNCE_DELAY = 1000;

const ExcalidrawPage = lazy(
	() => import("./components/ExcalidrawPage/ExcalidrawPage"),
);

const App = () => {
	const { viewMode } = useViewMode();
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [activeFilter, setActiveFilter] = useState<Filter | null>(null);
	const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

	const [rteContent, setRteContentState] = useLocalStorage({
		key: "rteContent",
		defaultValue: "",
	});
	const [debouncedRteContent, setDebouncedRteContent] = useState(rteContent);
	const rteContentRef = useRef(rteContent);

	useEffect(() => {
		rteContentRef.current = rteContent;
	}, [rteContent]);

	const prevViewMode = useRef(viewMode);

	const handleContentChange = useCallback(
		(content: string) => {
			setRteContentState(content);
		},
		[setRteContentState],
	);

	const { editor, setExternalContent } = useTipTap({
		initialContent: rteContent,
		onContentChange: handleContentChange,
	});

	useEffect(() => {
		const prev = prevViewMode.current;
		prevViewMode.current = viewMode;

		if (viewMode === prev) return;

		if (viewMode === "excalidraw") {
			syncTextToExcalidraw(rteContentRef.current);
		} else if (viewMode === "text" && prev === "excalidraw") {
			const excalidrawHtml = syncExcalidrawToText();
			if (excalidrawHtml) {
				setExternalContent(excalidrawHtml);
				setRteContentState(excalidrawHtml);
			}
		}
	}, [viewMode, setExternalContent, setRteContentState]);

	const handleRemoteContent = useCallback(
		(content: string) => {
			setExternalContent(content);
			setRteContentState(content);
		},
		[setExternalContent, setRteContentState],
	);

	const {
		notes,
		setNotes,
		upsertNote,
		deleteNote,
		archiveNote,
		togglePin,
		setNoteColor,
	} = useNotes();
	const [debouncedNotes, setDebouncedNotes] = useState(notes);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedRteContent(rteContent);
		}, DEBOUNCE_DELAY);
		return () => clearTimeout(timer);
	}, [rteContent]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedNotes(notes);
		}, DEBOUNCE_DELAY * 2);
		return () => clearTimeout(timer);
	}, [notes]);

	const handleRemoteNotes = useCallback(
		(remoteNotes: Note[]) => {
			setNotes(remoteNotes);
		},
		[setNotes],
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
	});

	const handleFileLoaded = useCallback(
		(html: string) => {
			setExternalContent(html);
			setRteContentState(html);
		},
		[setExternalContent, setRteContentState],
	);

	const { fileInputRef, handleOpenRepo, handleFileChange } = useFileHandler({
		onFileLoaded: handleFileLoaded,
	});

	const taskData: ParsedTodoContent = useMemo(
		() => parseTodoContent(rteContent),
		[rteContent],
	);

	useDueNotifications(taskData.tasks);

	const handleSave = useDocumentSave(editor, rteContent);

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
		}),
		[
			editor,
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
								<ExcalidrawPage />
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
		</EditorContext.Provider>
	);
};

export default App;
