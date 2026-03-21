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
import { LAYOUT } from "./providers/layout";
import type { Filter, ParsedTodoContent } from "./types/todo";
import { parseTodoContent } from "./utils/todoParser";

const DEBOUNCE_DELAY = 1000;

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
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [activeFilter, setActiveFilter] = useState<Filter | null>(null);
	const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);

	const [rteContent, setRteContentState] = useLocalStorage({
		key: "rteContent",
		defaultValue: "",
	});
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

	return (
		<AppShell
			header={{ height: LAYOUT.HEADER_HEIGHT }}
			aside={{
				width: sidebarCollapsed
					? LAYOUT.SIDEBAR_COLLAPSED_WIDTH
					: LAYOUT.SIDEBAR_WIDTH,
				collapsed: { mobile: true, desktop: false },
				breakpoint: "sm",
			}}
			padding="md"
		>
			<AppShell.Header>
				<AppHeader
					viewMode={viewMode}
					setViewMode={setViewMode}
					onAddTimer={onAddTimer}
					onAiTools={handleAiTools}
				/>
			</AppShell.Header>

			<AppShell.Aside>
				<Sidebar
					isCollapsed={sidebarCollapsed}
					onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
					taskData={taskData}
					activeFilter={activeFilter}
					onFilterChange={setActiveFilter}
				/>
			</AppShell.Aside>

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
				{viewMode === "text" && (
					<TextModeContent
						editor={editor}
						showWelcome={showWelcome}
						quickActions={quickActions}
						onSave={handleSave}
						onOpen={handleOpenRepo}
						onAiTools={handleAiTools}
					/>
				)}
			</AppShell.Main>
		</AppShell>
	);
};

export default App;
