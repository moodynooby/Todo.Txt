import "./App.css";
import {
	lazy,
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import "quill/dist/quill.snow.css";
import "quilljs-markdown/dist/quilljs-markdown-common-style.css";
import AppHeader from "./components/AppHeader/AppHeader";
import FilteredView from "./components/FilteredView";
import Sidebar from "./components/Sidebar/Sidebar";
import { useTheme } from "./contexts/ThemeContext";
import { useFileHandler } from "./hooks/useFileHandler";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useQuill } from "./hooks/useQuill";
import WelcomeScreen from "./pages/WelcomeScreen/WelcomeScreen";
import { applyFilter, type Filter } from "./utils/filterUtils";
import saveService from "./utils/saveService";
import {
	type ParsedTodoContent,
	parseTodoContent,
	type Task,
} from "./utils/todoParser";

const DEBOUNCE_DELAY = 1000;

const stripHtml = (html: string, replacement = ""): string =>
	html?.replace(/<[^>]*>/g, replacement) || "";

const ExcalidrawPage = lazy(
	() => import("./pages/ExcalidrawPage/ExcalidrawPage"),
);

interface AppProps {
	viewMode: string;
	setViewMode: (mode: string) => void;
	onAddTimer: () => void;
}

const App = ({ viewMode, setViewMode, onAddTimer }: AppProps) => {
	const { isDark } = useTheme();
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [showWelcome, setShowWelcome] = useState(true);
	const [activeFilter, setActiveFilter] = useState<Filter | null>(null);

	const [rteContent, setRteContentState] = useLocalStorage<string>(
		"rteContent",
		"",
	);
	const [debouncedRteContent, setDebouncedRteContent] = useState(rteContent);

	// Sync content to localStorage with debounce
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedRteContent(rteContent);
			setRteContentState(rteContent);
		}, DEBOUNCE_DELAY);

		return () => clearTimeout(timer);
	}, [rteContent, setRteContentState]);

	const handleContentChange = useCallback(
		(content: string) => {
			setRteContentState(content);
			setShowWelcome(false);
		},
		[setRteContentState],
	);

	const { quillContainerRef, quillInstanceRef } = useQuill({
		viewMode,
		activeFilter,
		initialContent: rteContent,
		onContentChange: handleContentChange,
	});

	const { fileInputRef, handleOpenRepo, handleFileChange, handleNewFile } =
		useFileHandler({
			setRteContent: setRteContentState,
			setShowWelcome,
		});

	const taskData: ParsedTodoContent = useMemo(
		() => parseTodoContent(debouncedRteContent),
		[debouncedRteContent],
	);

	const handleSave = useCallback(
		(type: string) => {
			const saveActions: Record<string, () => void> = {
				markdown: () => saveService.saveAsMarkdown(rteContent),
				text: () =>
					saveService.saveAsText(
						quillInstanceRef.current?.getText() || stripHtml(rteContent, ""),
					),
				html: () => saveService.saveAsHtml(rteContent),
			};

			if (saveActions[type]) {
				saveActions[type]();
			} else {
				console.warn("Unknown save type:", type);
			}
		},
		[rteContent, quillInstanceRef],
	);

	const keyActions = useMemo(
		() => ({
			m: () => handleSave("markdown"),
			t: () => handleSave("text"),
			h: () => handleSave("html"),
		}),
		[handleSave],
	);

	useKeyboardShortcuts(keyActions);

	const handleAiTools = (): void => {
		const formatted = rteContent.replace(/([A-Z])(?=[^\s])/g, "$1 ");
		setRteContentState(formatted);
		quillInstanceRef.current?.clipboard.dangerouslyPasteHTML(formatted);
	};

	const filteredTasks: Task[] = useMemo(() => {
		return applyFilter(taskData.tasks, activeFilter);
	}, [activeFilter, taskData]);

	return (
		<>
			<AppHeader
				viewMode={viewMode}
				setViewMode={setViewMode}
				onAddTimer={onAddTimer}
				onOpenRepo={handleOpenRepo}
				onSave={handleSave}
				onAiTools={handleAiTools}
			/>
			<input
				type="file"
				ref={fileInputRef}
				className="file-input"
				accept=".txt"
				onChange={handleFileChange}
			/>
			<Sidebar
				isCollapsed={sidebarCollapsed}
				onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
				taskData={taskData}
				activeFilter={activeFilter}
				onFilterChange={setActiveFilter}
			/>
			<div
				className={`app-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
			>
				{viewMode === "excalidraw" && (
					<Suspense fallback={<div className="p-4">Loading Excalidraw...</div>}>
						<ExcalidrawPage />
					</Suspense>
				)}
				{viewMode === "text" && (
					<div className="rte-editor-container">
						{showWelcome && !rteContent ? (
							<WelcomeScreen
								onNewFile={handleNewFile}
								onOpenRepo={handleOpenRepo}
							/>
						) : activeFilter ? (
							<FilteredView
								activeFilter={activeFilter}
								filteredTasks={filteredTasks}
								onClearFilter={() => setActiveFilter(null)}
							/>
						) : (
							<div
								ref={quillContainerRef}
								className={`quill-container quill-theme-${isDark ? "dark" : "light"}`}
							/>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default App;
