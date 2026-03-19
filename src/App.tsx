import "./App.css";
import { ArrowRight, BookOpen, FilePlus, Paperclip } from "lucide-react";
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
import AiToolsDialog from "./components/AiTools/AiToolsDialog";
import AppHeader from "./components/AppHeader/AppHeader";
import { DescriptionSvg } from "./components/DescriptionSvg";
import FilteredView from "./components/FilteredView";
import Sidebar from "./components/Sidebar/Sidebar";
import { useTheme } from "./contexts/ThemeContext";
import { useDueNotifications } from "./hooks/useDueNotifications";
import { useFileHandler } from "./hooks/useFileHandler";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useQuill } from "./hooks/useQuill";
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
	() => import("./components/ExcalidrawPage/ExcalidrawPage.tsx"),
);

interface AppProps {
	viewMode: string;
	setViewMode: (mode: string) => void;
	onAddTimer: () => void;
}

const isEmptyContent = (content: string): boolean => {
	return !content || content.trim() === "" || content === "<p></p>";
};

const App = ({ viewMode, setViewMode, onAddTimer }: AppProps) => {
	const { isDark } = useTheme();
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [activeFilter, setActiveFilter] = useState<Filter | null>(null);
	const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

	const [rteContent, setRteContentState] = useLocalStorage<string>(
		"rteContent",
		"",
	);
	const [debouncedRteContent, setDebouncedRteContent] = useState(rteContent);

	const showWelcome = isEmptyContent(rteContent);
	// Sync content to localStorage with debounce
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedRteContent(rteContent);
		}, DEBOUNCE_DELAY);

		return () => clearTimeout(timer);
	}, [rteContent]);

	const handleContentChange = useCallback(
		(content: string) => {
			setRteContentState(content);
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
			quillInstanceRef,
		});

	const taskData: ParsedTodoContent = useMemo(
		() => parseTodoContent(debouncedRteContent),
		[debouncedRteContent],
	);

	useDueNotifications(taskData.tasks);

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
		setIsAiDialogOpen(true);
	};

	const handleAiInsert = (text: string, mode: "replace" | "append") => {
		if (!quillInstanceRef.current) return;

		const quill = quillInstanceRef.current;
		const range = quill.getSelection();

		if (mode === "replace" && range && range.length > 0) {
			quill.deleteText(range.index, range.length);
			quill.insertText(range.index, text);
		} else if (mode === "append") {
			const length = quill.getLength();
			quill.insertText(length, `\n${text}`);
		} else {
			// Default to replacing all if no selection and replace mode
			quill.setText(text);
		}
		setIsAiDialogOpen(false);
	};

	const filteredTasks: Task[] = useMemo(() => {
		return applyFilter(taskData.tasks, activeFilter);
	}, [activeFilter, taskData]);

	const quickActions = [
		{
			id: "new-file",
			icon: FilePlus,
			title: "New File",
			description: "Create a new todo.txt file",
			color: "var(--color-secondary)",
			action: handleNewFile,
		},
		{
			id: "open-repo",
			icon: Paperclip,
			title: "Open File",
			description: "Open an existing todo.txt file",
			color: "var(--color-success)",
			action: handleOpenRepo,
		},
		{
			id: "help",
			icon: BookOpen,
			title: "Documentation",
			description: "Learn about todo.txt format",
			color: "var(--color-accent)",
			action: () =>
				window.open("https://github.com/todotxt/todo.txt", "_blank"),
		},
	];

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
			<AiToolsDialog
				isOpen={isAiDialogOpen}
				onClose={() => setIsAiDialogOpen(false)}
				initialContent={
					quillInstanceRef.current?.getSelection()?.length
						? quillInstanceRef.current.getText(
								quillInstanceRef.current.getSelection()?.index,
								quillInstanceRef.current.getSelection()?.length,
							)
						: quillInstanceRef.current?.getText() || ""
				}
				onInsert={handleAiInsert}
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
						{showWelcome ? (
							<div className="welcome-screen flex flex-col items-center justify-center min-h-[calc(100vh-76px)] p-8">
								<div className="text-center mb-12">
									<div className="flex justify-center mb-4">
										<img
											src="/todotxt2.svg"
											alt="Todo.txt Logo"
											className="h-20 w-20"
										/>
									</div>
									<h1 className="text-5xl font-bold mb-3 gradient-text">
										Welcome to Todo.txt
									</h1>
									<p className="text-lg opacity-70 max-w-md mx-auto">
										A simple, plain text task management system based on the{" "}
										<a
											href="https://github.com/todotxt/todo.txt"
											target="_blank"
											rel="noopener noreferrer"
											className="link link-primary"
										>
											todo.txt
										</a>{" "}
										philosophy
									</p>
								</div>

								<div className="quick-actions-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl w-full mb-12">
									{quickActions.map((action) => (
										<button
											key={action.id}
											type="button"
											onClick={action.action}
											className="card bg-base-200 hover:bg-base-300 border border-base-300 hover:border-primary hover:shadow-2xl transition-all duration-300 text-left p-6 group cursor-pointer"
										>
											<div className="flex items-start gap-4">
												<div
													className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300"
													style={{
														backgroundColor: `${action.color}25`,
													}}
												>
													<action.icon
														size={28}
														style={{ color: action.color }}
														className="group-hover:rotate-6 transition-transform duration-300"
													/>
												</div>
												<div className="flex-1">
													<div className="font-bold text-lg mb-1 flex items-center gap-2 group-hover:text-primary transition-colors">
														{action.title}
														<ArrowRight
															size={16}
															className="opacity-0 group-hover:opacity-60 transform group-hover:translate-x-1 transition-all duration-300"
														/>
													</div>
													<div className="text-sm opacity-60 group-hover:opacity-80">
														{action.description}
													</div>
												</div>
											</div>
										</button>
									))}
								</div>

								<div className="preview-card card bg-base-200 border border-base-300 max-w-3xl w-full p-6 shadow-lg">
									<div className="preview-header flex justify-between items-center mb-4">
										<span className="text-xs uppercase tracking-wider opacity-60 font-semibold">
											BASIC INFO
										</span>
									</div>

									<div className="bg-base-300 rounded-lg p-4 font-mono text-sm border-base-300">
										<DescriptionSvg />
									</div>
								</div>
							</div>
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
