import "@/styles/App.css";
import { AppShell, Box } from "@mantine/core";
import {
	lazy,
	Suspense,
	useCallback,
	useDeferredValue,
	useMemo,
	useState,
} from "react";
import AppHeader from "@/components/AppHeader/AppHeader";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { EditorContext } from "@/context/EditorContext";
import { NotesContext } from "@/context/NotesContext";
import { useViewMode } from "@/context/ViewModeContext";
import AiToolsDialog from "@/features/ai/AiToolsDialog";
import Timer from "@/features/timer/Timer";
import { useDataManagement } from "@/hooks/useDataManagement";
import { useDocumentSave } from "@/hooks/useDocumentSave";
import { useDueNotifications } from "@/hooks/useDueNotifications";
import { useFileHandler } from "@/hooks/useFileHandler";
import NotesPage from "@/pages/NotesPage";
import TodoPage from "@/pages/TodoPage";
import type { Filter, ParsedTodoContent } from "@/types/todo";
import { parseTodoContent } from "@/utils/todoParser";

const ExcalidrawPage = lazy(() => import("@/pages/ExcalidrawPage"));

const App = () => {
	const { viewMode } = useViewMode();

	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [activeFilter, setActiveFilter] = useState<Filter | null>(null);
	const [aiToolsOpen, setAiToolsOpen] = useState(false);

	const {
		editor,
		setExternalContent,
		rteContent,
		setRteContentState,
		excalidrawData,
		setExcalidrawData,
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
		isConnected: isSynced,
		user,
		authError,
		connect,
		disconnect,
	} = useDataManagement(viewMode);

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

	const deferredRteContent = useDeferredValue(rteContent);

	const taskData: ParsedTodoContent = useMemo(
		() => parseTodoContent(deferredRteContent),
		[deferredRteContent],
	);

	useDueNotifications(taskData.tasks);

	const handleSave = useDocumentSave(editor);

	const handleAiTools = useCallback((): void => {
		setAiToolsOpen(true);
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
		setAiToolsOpen(false);
	};

	const notesContextValue = useMemo(
		() => ({
			notes,
			setNotesFromRemote,
			upsertNote,
			deleteNote,
			archiveNote,
			togglePin,
			setNoteColor,
		}),
		[
			notes,
			setNotesFromRemote,
			upsertNote,
			deleteNote,
			archiveNote,
			togglePin,
			setNoteColor,
		],
	);

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
			authError,
			onConnect: connect,
			onDisconnectSync: disconnect,
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
			authError,
			connect,
			disconnect,
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
						...(viewMode === "todo"
							? { display: "flex", flexDirection: "column" }
							: {}),
					}}
				>
					<ErrorBoundary>
						<AiToolsDialog
							isOpen={aiToolsOpen}
							onClose={() => setAiToolsOpen(false)}
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
							groqApiKey={groqApiKey}
							onGroqApiKeyChange={handleGroqApiKeyChange}
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
							<NotesContext.Provider value={notesContextValue}>
								<NotesPage />
							</NotesContext.Provider>
						)}
						{viewMode === "todo" && (
							<TodoPage
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
