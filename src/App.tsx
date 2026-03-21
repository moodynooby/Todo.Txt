import "./App.css";
import {
	ActionIcon,
	Anchor,
	AppShell,
	Box,
	Card,
	Group,
	Image,
	Paper,
	SimpleGrid,
	Stack,
	Text,
	ThemeIcon,
	Title,
	useComputedColorScheme,
} from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import { ArrowRight, BookOpen, FilePlus, Paperclip } from "lucide-react";
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
import { DescriptionSvg } from "./components/DescriptionSvg";
import Sidebar from "./components/Sidebar/Sidebar";
import { useDueNotifications } from "./hooks/useDueNotifications";
import { useFileHandler } from "./hooks/useFileHandler";
import { useQuill } from "./hooks/useQuill";
import { LAYOUT } from "./providers/layout";
import type { Filter } from "./utils/filterUtils";
import saveService from "./utils/saveService";
import { type ParsedTodoContent, parseTodoContent } from "./utils/todoParser";

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
	const computedColorScheme = useComputedColorScheme("light");
	const isDark = computedColorScheme === "dark";
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

	useHotkeys([
		["mod+m", () => handleSave("markdown")],
		["mod+t", () => handleSave("text")],
		["mod+h", () => handleSave("html")],
	]);

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
					onOpenRepo={handleOpenRepo}
					onSave={handleSave}
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
				{viewMode === "excalidraw" && (
					<Suspense fallback={<Box p="md">Loading Excalidraw...</Box>}>
						<ExcalidrawPage />
					</Suspense>
				)}
				{viewMode === "text" && (
					<Box className="rte-editor-container">
						{showWelcome ? (
							<Stack align="center" className="welcome-screen" gap="xl" py="xl">
								<Stack align="center" gap="md">
									<Image
										src="/todotxt2.svg"
										alt="Todo.txt Logo"
										w={80}
										h={80}
									/>
									<Title order={1} className="gradient-text" ta="center">
										Welcome to Todo.txt
									</Title>
									<Text size="lg" c="dimmed" maw={400} ta="center">
										A simple, plain text task management system based on the{" "}
										<Anchor
											href="https://github.com/todotxt/todo.txt"
											target="_blank"
											rel="noreferrer"
										>
											todo.txt
										</Anchor>{" "}
										philosophy
									</Text>
								</Stack>

								<SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} maw={900} w="100%">
									{quickActions.map((action) => {
										const Icon = action.icon;
										return (
											<Card
												key={action.id}
												withBorder
												padding="lg"
												radius="md"
												style={{ cursor: "pointer" }}
												onClick={action.action}
											>
												<Group>
													<ThemeIcon size="xl" radius="md" variant="light">
														<Icon size={24} />
													</ThemeIcon>
													<Box style={{ flex: 1 }}>
														<Text fw={600} size="lg">
															{action.title}
														</Text>
														<Text size="sm" c="dimmed">
															{action.description}
														</Text>
													</Box>
													<ActionIcon variant="subtle" size="sm">
														<ArrowRight size={16} />
													</ActionIcon>
												</Group>
											</Card>
										);
									})}
								</SimpleGrid>

								<Paper withBorder p="lg" radius="md" maw={600} w="100%">
									<Text size="xs" fw={700} tt="uppercase" c="dimmed" mb="sm">
										Basic Info
									</Text>
									<Paper p="md" radius="sm">
										<DescriptionSvg />
									</Paper>
								</Paper>
							</Stack>
						) : (
							<Box
								ref={quillContainerRef}
								className={`quill-container quill-theme-${isDark ? "dark" : "light"}`}
							/>
						)}
					</Box>
				)}
			</AppShell.Main>
		</AppShell>
	);
};

export default App;
