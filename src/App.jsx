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
import Sidebar from "./components/Sidebar/Sidebar";
import FilteredView from "./components/FilteredView";
import { useTheme } from "./contexts/ThemeContext";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useQuill } from "./hooks/useQuill";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useFileHandler } from "./hooks/useFileHandler";
import WelcomeScreen from "./pages/WelcomeScreen/WelcomeScreen";
import { saveAsHtml, saveAsMarkdown, saveAsText } from "./utils/fileSaveUtils";
import { applyFilter } from "./utils/filterUtils";
import { parseTodoContent } from "./utils/todoParser";

const SIDEBAR_EXPANDED_WIDTH = 280;
const SIDEBAR_COLLAPSED_WIDTH = 60;
const HEADER_HEIGHT = 48;
const FOOTER_HEIGHT = 28;
const DEBOUNCE_DELAY = 1000;
const TRANSITION_DURATION = "0.2s";
const TRANSITION_TIMING = "ease";

const stripHtml = (html, replacement = "") =>
	html?.replace(/<[^>]*>/g, replacement) || "";

const ExcalidrawPage = lazy(
	() => import("./pages/ExcalidrawPage/ExcalidrawPage"),
);

const App = ({ viewMode, setViewMode, onAddTimer }) => {
	const { isDark } = useTheme();
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [showWelcome, setShowWelcome] = useState(true);
	const [activeFilter, setActiveFilter] = useState(null);

	const [rteContent, setRteContentState] = useLocalStorage("rteContent", "");
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
		(content) => {
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

	const taskData = useMemo(
		() => parseTodoContent(debouncedRteContent),
		[debouncedRteContent],
	);

	const handleSave = useCallback(
		(type) => {
			const saveActions = {
				markdown: () => saveAsMarkdown(rteContent),
				text: () =>
					saveAsText(
						quillInstanceRef.current?.getText() || stripHtml(rteContent, ""),
					),
				html: () => saveAsHtml(rteContent),
			};

			saveActions[type]?.() || console.warn("Unknown save type:", type);
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

	const handleAiTools = () => {
		const formatted = rteContent.replace(/([A-Z])(?=[^\s])/g, "$1 ");
		setRteContentState(formatted);
		quillInstanceRef.current?.clipboard.dangerouslyPasteHTML(formatted);
	};

	const filteredTasks = useMemo(() => {
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
				style={{ display: "none" }}
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
				style={{
					marginLeft: sidebarCollapsed
						? `${SIDEBAR_COLLAPSED_WIDTH}px`
						: `${SIDEBAR_EXPANDED_WIDTH}px`,
					marginTop: `${HEADER_HEIGHT}px`,
					marginBottom: `${FOOTER_HEIGHT}px`,
					transition: `margin-left ${TRANSITION_DURATION} ${TRANSITION_TIMING}`,
					minHeight: `calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT}px)`,
				}}
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
								style={{ minHeight: "70vh" }}
								className={`quill-theme-${isDark ? "dark" : "light"}`}
							/>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default App;
