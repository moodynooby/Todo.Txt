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
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/context/AuthContext";
import { NotesProvider, readNotesBackup } from "@/context/NotesContext";
import { SyncProvider } from "@/context/SyncContext";
import { TimerProvider, useTimerContext } from "@/context/TimerContext";
import { TodoProvider, useTodoContext } from "@/context/TodoContext";
import { useViewContext, ViewProvider } from "@/context/ViewContext";
import AiToolsDialog from "@/features/ai/AiToolsDialog";
import Timer from "@/features/timer/Timer";
import { playBeep } from "@/lib/beep";
import { type SaveFormat, saveEditorContent } from "@/lib/documentExport";
import NotesPage from "@/pages/NotesPage";
import TodoPage from "@/pages/TodoPage";
import type { ExcalidrawData } from "@/types/sync";
import type { Filter, ParsedTodoContent, Task } from "@/types/todo";
import { getToday } from "@/utils/dateUtils";
import { parseTodoContent } from "@/utils/todoParser";

const ExcalidrawPage = lazy(() => import("@/pages/ExcalidrawPage"));

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

	const taskData: ParsedTodoContent = useMemo(
		() => parseTodoContent(deferredRteContent),
		[deferredRteContent],
	);

	const lastCheckedDateRef = useRef("");
	const notifiedIdsRef = useRef(new Set<number>());
	useEffect(() => {
		if (!("Notification" in window)) return;
		const tasks: Task[] = taskData.tasks;
		const today = getToday();
		if (lastCheckedDateRef.current !== today) {
			lastCheckedDateRef.current = today;
			notifiedIdsRef.current.clear();
		}
		let cancelled = false;
		const checkDueTasks = async () => {
			if (Notification.permission === "default") {
				await Notification.requestPermission();
			}
			if (cancelled) return;
			if (Notification.permission !== "granted") return;
			const dueTasks = tasks.filter(
				(task) => task.due === today && !notifiedIdsRef.current.has(task.id),
			);
			if (dueTasks.length === 0) return;
			dueTasks.forEach((task) => {
				try {
					new Notification("Todo Due Today", {
						body: task.text,
						icon: "/icon192.png",
					});
				} catch (e) {
					console.warn("Failed to show notification:", e);
				}
				notifiedIdsRef.current.add(task.id);
			});
			playBeep();
		};
		checkDueTasks().catch((e) =>
			console.error("Due notification check failed:", e),
		);
		return () => {
			cancelled = true;
		};
	}, [taskData.tasks]);

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
						{viewMode === "excalidraw" && (
							<Suspense fallback={<Box p="md">Loading Excalidraw...</Box>}>
								<ExcalidrawPage
									initialData={excalidrawData}
									onChange={(data) => setExcalidrawData(data)}
								/>
							</Suspense>
						)}
						{viewMode === "notes" && <NotesPage />}
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
					</ErrorBoundary>
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

const readContentBackup = (): string | null => {
	try {
		return localStorage.getItem("todo_content_backup");
	} catch {
		return null;
	}
};

const App = () => {
	const initialContent = readContentBackup() ?? "";
	const initialNotes = readNotesBackup();
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
					<TimerProvider>
						<ViewProvider>
							<AppContent
								activeFilter={activeFilter}
								onFilterChange={setActiveFilter}
							/>
						</ViewProvider>
					</TimerProvider>
				</NotesProvider>
			</TodoProvider>
		</AuthProvider>
	);
};

export default App;
