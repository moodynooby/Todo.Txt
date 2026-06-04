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
import { AuthProvider, useAuthContext } from "@/context/AuthContext";
import {
	EditorContext,
	EditorStateProvider,
	useEditorContext,
} from "@/context/EditorContext";
import { NotesProvider } from "@/context/NotesContext";
import { SyncProvider } from "@/context/SyncContext";
import { TimerProvider, useTimerContext } from "@/context/TimerContext";
import { useViewContext, ViewProvider } from "@/context/ViewContext";
import AiToolsDialog from "@/features/ai/AiToolsDialog";
import Timer from "@/features/timer/Timer";
import { useTipTap } from "@/hooks/useTipTap";
import { playBeep } from "@/lib/beep";
import { type SaveFormat, saveEditorContent } from "@/lib/documentExport";
import type { ExcalidrawData } from "@/lib/excalidrawSync";
import { readBackup } from "@/lib/persistedState";
import NotesPage from "@/pages/NotesPage";
import TodoPage from "@/pages/TodoPage";
import type { Filter, ParsedTodoContent, Task } from "@/types/todo";
import { getToday } from "@/utils/dateUtils";
import { parseTodoContent } from "@/utils/todoParser";

const ExcalidrawPage = lazy(() => import("@/pages/ExcalidrawPage"));

function AppContent() {
	const { state: viewState, dispatchView } = useViewContext();
	const viewMode = viewState.viewMode;
	const { state: editorState, dispatchEditor } = useEditorContext();
	const content = editorState.content;
	const { state: authState } = useAuthContext();
	const { state: timersState, dispatchTimer } = useTimerContext();

	const [excalidrawData, setExcalidrawData] = useState<ExcalidrawData | null>(
		null,
	);
	const [groqApiKey, setGroqApiKey] = useState("");
	const [activeFilter, setActiveFilter] = useState<Filter | null>(null);
	const [aiToolsOpen, setAiToolsOpen] = useState(false);

	const handleTagFilterClick = useCallback((type: string, value: string) => {
		setActiveFilter((prev) => {
			if (prev?.type === type && prev?.value === value) {
				return null;
			}
			return { type: type as Filter["type"], value };
		});
	}, []);

	const handleContentChange = useCallback(
		(content: string) => {
			dispatchEditor({
				type: "SYNC_COMPLETE",
				payload: { content, timestamp: Date.now() },
			});
		},
		[dispatchEditor],
	);

	const { editor, setExternalContent } = useTipTap({
		initialContent: editorState.content,
		onContentChange: handleContentChange,
		onFilterClick: handleTagFilterClick,
	});

	const handleRemoteExcalidraw = useCallback((data: ExcalidrawData | null) => {
		setExcalidrawData(data);
	}, []);

	const handleRemoteGroqApiKey = useCallback((key: string) => {
		setGroqApiKey(key);
	}, []);

	const handleFileLoaded = useCallback(
		(html: string) => {
			setExternalContent(html);
			dispatchEditor({
				type: "SYNC_COMPLETE",
				payload: { content: html, timestamp: Date.now() },
			});
		},
		[setExternalContent, dispatchEditor],
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

	const handleAddTimer = useCallback(() => {
		dispatchTimer({ type: "ADD_TIMER" });
	}, [dispatchTimer]);

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

	useEffect(() => {
		if (viewMode === undefined) return;
		if (viewState.viewMode === viewMode) return;
		dispatchView({ type: "SET_VIEW_MODE", payload: viewMode });
	}, [viewMode, viewState.viewMode, dispatchView]);

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

	const editorContextValue = useMemo(
		() => ({
			editor,
			addTimer: handleAddTimer,
			onSave: handleSave,
			onOpen: handleOpenRepo,
			onAiTools: handleAiTools,
			syncStatus: authState.syncStatus,
			isSynced: authState.isConnected,
			user: authState.user,
			authError: authState.authError,
			viewMode: viewState.viewMode,
		}),
		[
			editor,
			handleAddTimer,
			handleSave,
			handleOpenRepo,
			handleAiTools,
			authState.syncStatus,
			authState.isConnected,
			authState.user,
			authState.authError,
			viewState.viewMode,
		],
	);

	return (
		<SyncProvider
			excalidrawData={excalidrawData}
			groqApiKey={groqApiKey}
			onExcalidrawChange={handleRemoteExcalidraw}
			onGroqApiKeyChange={handleRemoteGroqApiKey}
			onExternalContent={setExternalContent}
		>
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
									onFilterChange={setActiveFilter}
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
			</EditorContext.Provider>
		</SyncProvider>
	);
}

const App = () => {
	const initialContent = readBackup()?.data?.content ?? "";

	return (
		<AuthProvider>
			<EditorStateProvider initialContent={initialContent}>
				<NotesProvider>
					<TimerProvider>
						<ViewProvider>
							<AppContent />
						</ViewProvider>
					</TimerProvider>
				</NotesProvider>
			</EditorStateProvider>
		</AuthProvider>
	);
};

export default App;
