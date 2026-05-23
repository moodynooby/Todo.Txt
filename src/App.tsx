import "./App.css";
import { AppShell, Box } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import {
	lazy,
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import AiToolsDialog from "./components/AiTools/AiToolsDialog";
import AppHeader from "./components/AppHeader/AppHeader";
import Sidebar from "./components/Sidebar/Sidebar";
import TextModeContent from "./components/TextModeContent/TextModeContent";
import { useDocumentSave } from "./hooks/useDocumentSave";
import { useDueNotifications } from "./hooks/useDueNotifications";
import { useFileHandler } from "./hooks/useFileHandler";
import { useQuickActions } from "./hooks/useQuickActions";
import { useTipTap } from "./hooks/useTipTap";
import { EditorContext } from "./providers/EditorContext";
import { LAYOUT } from "./providers/layout";
import { useViewMode } from "./providers/ViewModeContext";
import type { Filter, ParsedTodoContent } from "./types/todo";
import { parseTodoContent } from "./utils/todoParser";

const DEBOUNCE_DELAY = 1000;

const ExcalidrawPage = lazy(
	() => import("./components/ExcalidrawPage/ExcalidrawPage.tsx"),
);

const isEmptyContent = (content: string): boolean => {
	return !content || content.trim() === "" || content === "<p></p>";
};

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

	const showWelcome = isEmptyContent(rteContent);
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

	const { editor } = useTipTap({
		viewMode,
		activeFilter,
		initialContent: rteContent,
		onContentChange: handleContentChange,
	});

	const { fileInputRef, handleOpenRepo, handleFileChange, handleNewFile } =
		useFileHandler({
			setRteContent: setRteContentState,
			editor,
		});

	const taskData: ParsedTodoContent = useMemo(
		() => parseTodoContent(debouncedRteContent),
		[debouncedRteContent],
	);

	useDueNotifications(taskData.tasks);

	const handleSave = useDocumentSave(editor, rteContent);

	useHotkeys([
		["mod+o", handleOpenRepo],
		["mod+m", () => handleSave("markdown")],
		["mod+t", () => handleSave("text")],
		["mod+h", () => handleSave("html")],
	]);

	const handleAiTools = (): void => {
		setIsAiDialogOpen(true);
	};

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

	const quickActions = useQuickActions({
		onNewFile: handleNewFile,
		onOpenFile: handleOpenRepo,
	});

	const editorContextValue = {
		editor,
		onSave: handleSave,
		onOpen: handleOpenRepo,
		onAiTools: handleAiTools,
		sidebarCollapsed,
		onToggleSidebar: () => setSidebarCollapsed(!sidebarCollapsed),
		quickActions,
	};

	return (
		<AppShell
			header={{ height: LAYOUT.HEADER_HEIGHT }}
			aside={{
				width: LAYOUT.SIDEBAR_WIDTH,
				collapsed: {
					mobile: true,
					desktop: sidebarCollapsed || viewMode === "excalidraw",
				},
				breakpoint: "sm",
			}}
			padding="md"
		>
			<AppShell.Header>
				<AppHeader />
			</AppShell.Header>

			{viewMode === "text" && (
				<AppShell.Aside>
					<Sidebar
						isCollapsed={sidebarCollapsed}
						onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
						taskData={taskData}
						activeFilter={activeFilter}
						onFilterChange={setActiveFilter}
					/>
				</AppShell.Aside>
			)}

			<EditorContext.Provider value={editorContextValue}>
				<AppShell.Main>
					<AiToolsDialog
						isOpen={isAiDialogOpen}
						onClose={() => setIsAiDialogOpen(false)}
						initialContent={
							editor?.state.selection.empty
								? editor?.getText() || ""
								: editor?.state.doc.textBetween(
										editor.state.selection.from,
										editor.state.selection.to,
										"\n",
									) || ""
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
					{viewMode === "excalidraw" && (
						<Suspense fallback={<Box p="md">Loading Excalidraw...</Box>}>
							<ExcalidrawPage />
						</Suspense>
					)}
					{viewMode === "text" && <TextModeContent showWelcome={showWelcome} />}
				</AppShell.Main>
			</EditorContext.Provider>
		</AppShell>
	);
};

export default App;
