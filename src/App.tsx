import "@/styles/App.css";
import { AppShell, Box } from "@mantine/core";
import {
	lazy,
	Suspense,
	useCallback,
	useDeferredValue,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import AppHeader from "@/components/AppHeader/AppHeader";
import BottomNav from "@/components/AppHeader/BottomNav";
import CommandPalette from "@/components/CommandPalette";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import ShortcutsCheatsheet, {
	OPEN_SHORTCUTS_EVENT,
} from "@/components/ShortcutsCheatsheet";
import ViewLoading from "@/components/ViewLoading";
import { AuthProvider } from "@/context/AuthContext";
import { HabitsProvider } from "@/context/HabitsContext";
import { NotesProvider, readNotesBackup } from "@/context/NotesContext";
import { readContentBackupJson, SyncProvider } from "@/context/SyncContext";
import { TimerProvider, useTimerContext } from "@/context/TimerContext";
import { TodoProvider, useTodoContext } from "@/context/TodoContext";
import { useViewContext, ViewProvider } from "@/context/ViewContext";
import AiToolsDialog from "@/features/ai/AiToolsDialog";
import Timer from "@/features/timer/Timer";
import { useDueReminders } from "@/hooks/useDueReminders";
import { type SaveFormat, saveEditorContent } from "@/lib/documentExport";
import { readHabitsBackup } from "@/lib/habitsBackup";
import HabitsPage from "@/pages/HabitsPage";
import NotesPage from "@/pages/NotesPage";
import TodoPage from "@/pages/TodoPage";
import type { ExcalidrawData } from "@/types/sync";
import type { Filter, ParsedTodoContent } from "@/types/todo";
import { parseTodoContent } from "@/utils/todoParser";

/* Lazy-loaded because its @todotxt/core dependency would otherwise push
 * the index chunk past workbox's 2 MiB PWA precache limit. */
const ExcalidrawPage = lazy(() => import("@/pages/ExcalidrawPage"));
const P2pSyncPage = lazy(() => import("@/pages/P2pSyncPage"));

interface AppContentProps {
	activeFilter: Filter | null;
	onFilterChange: (filter: Filter | null) => void;
}

function AppContent({ activeFilter, onFilterChange }: AppContentProps) {
	const { state: viewState } = useViewContext();
	const viewMode = viewState.viewMode;
	const {
		state: todoState,
		editor,
		dispatchTodo,
		handleAiInsert,
	} = useTodoContext();
	const content = todoState.content;
	const { state: timersState, dispatchTimer } = useTimerContext();

	const [excalidrawData, setExcalidrawData] = useState<ExcalidrawData | null>(
		null,
	);
	const [groqApiKey, setGroqApiKey] = useState("");
	const [aiToolsOpen, setAiToolsOpen] = useState(false);
	const [shortcutsOpen, setShortcutsOpen] = useState(false);

	/* Density preference drives a root attribute consumed by App.css. */
	useEffect(() => {
		document.documentElement.dataset.density = viewState.density;
	}, [viewState.density]);

	const handleRemoteExcalidraw = useCallback((data: ExcalidrawData | null) => {
		setExcalidrawData(data);
	}, []);

	const handleRemoteGroqApiKey = useCallback((key: string) => {
		setGroqApiKey(key);
	}, []);

	const handleFileLoaded = useCallback(
		(content: string) => {
			dispatchTodo({
				type: "SET_CONTENT",
				payload: { content, timestamp: Date.now() },
			});
		},
		[dispatchTodo],
	);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const handleOpenRepo = useCallback((): void => {
		fileInputRef.current?.click();
	}, []);
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (ev) => {
			const result = ev.target?.result;
			if (typeof result !== "string") return;
			handleFileLoaded(result);
		};
		reader.readAsText(file);
	};

	const deferredRteContent = useDeferredValue(content);

	/* Global hotkeys: `?` opens the cheatsheet (outside of typing surfaces),
	 * Ctrl/Cmd+O opens a todo.txt file — the binding the editor tooltip
	 * has always promised. */
	useEffect(() => {
		const isTypingTarget = (target: EventTarget | null): boolean => {
			if (!(target instanceof HTMLElement)) return false;
			return (
				target.tagName === "INPUT" ||
				target.tagName === "TEXTAREA" ||
				target.tagName === "SELECT" ||
				target.isContentEditable
			);
		};
		const onKeyDown = (e: KeyboardEvent): void => {
			if (
				e.key === "?" &&
				!e.ctrlKey &&
				!e.metaKey &&
				!isTypingTarget(e.target)
			) {
				e.preventDefault();
				setShortcutsOpen(true);
				return;
			}
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "o") {
				e.preventDefault();
				fileInputRef.current?.click();
			}
		};
		const openShortcuts = (): void => setShortcutsOpen(true);
		window.addEventListener("keydown", onKeyDown);
		window.addEventListener(OPEN_SHORTCUTS_EVENT, openShortcuts);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener(OPEN_SHORTCUTS_EVENT, openShortcuts);
		};
	}, []);

	const taskData: ParsedTodoContent = useMemo(
		() => parseTodoContent(deferredRteContent),
		[deferredRteContent],
	);

	/* Auto-reminders for tasks with a due date (plus optional time): a
	 * notification + beep fires when the due moment arrives while the app
	 * is open, e.g. `due:today@17:00` or `due:2026-08-16T14:30`. */
	useDueReminders(taskData);

	/* Ask for notification permission once the user has loaded a document, so
	 * the due reminders above can fire as soon as permission is granted. */
	useEffect(() => {
		if (!("Notification" in window)) return;
		if (Notification.permission === "default") {
			Notification.requestPermission().catch(() => undefined);
		}
	}, []);

	const handleSave = useCallback(
		(format: SaveFormat): void => {
			saveEditorContent(editor, format);
		},
		[editor],
	);

	const handleAiTools = useCallback((): void => {
		setAiToolsOpen(true);
	}, []);

	const handleRemoveTimer = useCallback(
		(id: number) => {
			dispatchTimer({ type: "REMOVE_TIMER", payload: id });
		},
		[dispatchTimer],
	);

	const handleUpdateTimer = useCallback(
		(
			id: number,
			updates: Partial<Omit<import("@/context/TimerContext").TimerState, "id">>,
		) => {
			dispatchTimer({ type: "UPDATE_TIMER", payload: { id, updates } });
		},
		[dispatchTimer],
	);

	return (
		<SyncProvider
			excalidrawData={excalidrawData}
			groqApiKey={groqApiKey}
			onExcalidrawChange={handleRemoteExcalidraw}
			onGroqApiKeyChange={handleRemoteGroqApiKey}
		>
			<AppShell header={{ height: 48 }} padding={0}>
				<AppShell.Header>
					<AppHeader />
				</AppShell.Header>
				<CommandPalette
					taskData={taskData}
					activeFilter={activeFilter}
					onFilterChange={onFilterChange}
				/>

				<AppShell.Main
					pos="relative"
					style={{
						overflow: "hidden",
						...(viewMode === "todo"
							? { display: "flex", flexDirection: "column" }
							: {}),
						paddingBottom: "env(safe-area-inset-bottom)",
					}}
				>
					<ErrorBoundary>
						<ShortcutsCheatsheet
							opened={shortcutsOpen}
							onClose={() => {
								setShortcutsOpen(false);
							}}
						/>
						<AiToolsDialog
							isOpen={aiToolsOpen}
							onClose={() => {
								setAiToolsOpen(false);
							}}
							initialContent={
								editor?.state.selection.empty
									? (editor?.getText() ?? "")
									: (editor?.state.doc.textBetween(
											editor.state.selection.from,
											editor.state.selection.to,
											"\n",
										) ?? "")
							}
							onInsert={(text, mode) => {
								handleAiInsert(text, mode);
								setAiToolsOpen(false);
							}}
							groqApiKey={groqApiKey}
							onGroqApiKeyChange={setGroqApiKey}
						/>
						<input
							type="file"
							ref={fileInputRef}
							className="file-input"
							accept=".txt,.md,.html"
							onChange={handleFileChange}
						/>
						<Box className="app-view-frame app-view-enter">
							{viewMode === "excalidraw" && (
								<Suspense fallback={<ViewLoading />}>
									<ExcalidrawPage
										initialData={excalidrawData}
										onChange={(data) => setExcalidrawData(data)}
									/>
								</Suspense>
							)}
							{viewMode === "notes" && <NotesPage />}
							{viewMode === "habits" && <HabitsPage />}
							{viewMode === "sync" && <P2pSyncPage />}
							{viewMode === "todo" && (
								<TodoPage
									taskData={taskData}
									activeFilter={activeFilter}
									onFilterChange={onFilterChange}
									onSave={handleSave}
									onOpen={handleOpenRepo}
									onAiTools={handleAiTools}
								/>
							)}
						</Box>
					</ErrorBoundary>

					{/* M3 bottom navigation — mobile only, clears with safe-area inset */}
					<BottomNav />
					<Box
						hiddenFrom="md"
						className="bottom-nav-spacer"
						style={{ height: "calc(64px + env(safe-area-inset-bottom))" }}
					/>
				</AppShell.Main>
			</AppShell>

			{timersState.timers.map((timer) => (
				<Timer
					key={timer.id}
					timer={timer}
					onRemove={handleRemoveTimer}
					onUpdate={handleUpdateTimer}
				/>
			))}
		</SyncProvider>
	);
}

const App = () => {
	const initialContent = readContentBackupJson() ?? "";
	const initialNotes = readNotesBackup();
	const initialHabits = readHabitsBackup();
	const [activeFilter, setActiveFilter] = useState<Filter | null>(null);
	const handleTagFilterClick = useCallback((type: string, value: string) => {
		setActiveFilter((prev) => {
			if (prev?.type === type && prev?.value === value) return null;
			return { type: type as Filter["type"], value };
		});
	}, []);

	return (
		<AuthProvider>
			<TodoProvider
				initialContent={initialContent}
				onFilterClick={handleTagFilterClick}
			>
				<NotesProvider initialNotes={initialNotes}>
					<HabitsProvider initialHabits={initialHabits}>
						<TimerProvider>
							<ViewProvider>
								<AppContent
									activeFilter={activeFilter}
									onFilterChange={setActiveFilter}
								/>
							</ViewProvider>
						</TimerProvider>
					</HabitsProvider>
				</NotesProvider>
			</TodoProvider>
		</AuthProvider>
	);
};

export default App;
