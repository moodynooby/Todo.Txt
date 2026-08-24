import { ActionIcon, Drawer, Flex, Paper, Transition } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { RichTextEditor } from "@mantine/tiptap";
import { Code2, Filter as FilterIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import AdvancedToolsDialog from "@/components/AdvancedToolsDialog";
import { Editor } from "@/components/Editor";
import EditorPlay from "@/components/Editor/EditorPlay";
import { QuickAddBar } from "@/components/QuickAddBar";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useTodoContext } from "@/context/TodoContext";
import { useViewContext } from "@/context/ViewContext";
import { useTaskActivity } from "@/hooks/useEditorPlay";
import { useSidebarState } from "@/hooks/useSidebarState";
import type { SaveFormat } from "@/lib/documentExport";
import type { Filter, ParsedTodoContent } from "@/types/todo";

/**
 * Todo workspace — Material 3 Expressive layout.
 *
 * Desktop: sidebar + raised editor surface side by side, with the
 * quick-add bar as the hero moment at the top of the editor.
 * Mobile: full-width editor, filters reachable through a spring-animated
 * bottom sheet, and a prominent fully-rounded primary FAB.
 */
interface TodoPageProps {
	taskData: ParsedTodoContent;
	activeFilter: Filter | null;
	onFilterChange: (filter: Filter | null) => void;
	onSave?: (format: SaveFormat) => void;
	onOpen?: () => void;
	onAiTools?: () => void;
}

const TodoPage = ({
	taskData,
	activeFilter,
	onFilterChange,
	onSave,
	onOpen,
	onAiTools,
}: TodoPageProps) => {
	const {
		editor,
		requestEditor,
		state: todoState,
		dispatchTodo,
	} = useTodoContext();
	const { state: viewState, dispatchView } = useViewContext();
	const sidebarCollapsed = viewState.sidebarCollapsed;
	const onToggleSidebar = () => dispatchView({ type: "TOGGLE_SIDEBAR" });

	const isMobile = useMediaQuery("(max-width: 768px)");
	const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
		useDisclosure(false);
	const [
		advancedToolsOpened,
		{ open: openAdvancedTools, close: closeAdvancedTools },
	] = useDisclosure(false);

	const sidebarState = useSidebarState({
		taskData,
		activeFilter,
		onFilterChange,
	});

	/* Pull in the TipTap stack now that the document surface is actually
	 * on screen (see TodoContext — editor creation is deferred). */
	useEffect(() => {
		requestEditor();
	}, [requestEditor]);

	/* Raw todo.txt source view: the plain text is the actual storage format,
	 * so power users can read/edit exactly what sync sees, with the rich
	 * surface as the friendly default. Edits dispatch through the same
	 * SET_CONTENT path as remote updates, so the editor converges on blur. */
	const [sourceMode, setSourceMode] = useState(false);
	const handleSourceChange = (value: string) =>
		dispatchTodo({ type: "SET_CONTENT", payload: { content: value } });

	/* Quick-added lines land as markdown task items at the end of the
	 * document — same write path as typing, so filters and parsing see it. */
	const handleQuickAdd = useCallback(
		(text: string) => {
			if (!editor || editor.isDestroyed) return;
			editor.commands.focus("end");
			const prefix = editor.getText().length > 0 ? "\n" : "";
			editor.commands.insertContent(`${prefix}- [ ] ${text}\n`);
		},
		[editor],
	);

	/* Playfulness layer: empty-state art and the pet companion */
	const taskCount = taskData.tasks.length;
	const doneCount = taskData.tasks.filter((t) => t.completed).length;
	const mood = useTaskActivity(editor, taskCount, doneCount);
	const isEmpty = taskCount === 0;

	/* Pet nudge: drop a fresh list line at the end so writing continues
	 * without reaching for the toolbar. */
	const handlePetNudge = () => {
		if (!editor || editor.isDestroyed) return;
		editor
			.chain()
			.focus()
			.setTextSelection(editor.state.doc.content.size)
			.insertContent("\n• ")
			.run();
	};

	useEffect(() => {
		const storage = editor?.storage as {
			taskFilter?: {
				activeFilter: Filter | null;
				searchQuery: string;
				showCompleted: boolean;
			};
		};
		if (editor && !editor.isDestroyed && storage?.taskFilter) {
			storage.taskFilter.activeFilter = activeFilter;
			storage.taskFilter.searchQuery = sidebarState.searchQuery;
			storage.taskFilter.showCompleted = sidebarState.showCompleted;
			editor.view.dispatch(editor.state.tr.setMeta("filterUpdate", Date.now()));
		}
	}, [
		editor,
		activeFilter,
		sidebarState.searchQuery,
		sidebarState.showCompleted,
	]);

	if (!editor) return null;

	return (
		<Flex
			className="app-workspace todo-workspace"
			direction="row"
			style={{
				flex: 1,
				minHeight: 0,
				overflow: "hidden",
				position: "relative",
			}}
		>
			{!isMobile && (
				<Flex
					className="todo-sidebar-frame"
					direction="column"
					style={{
						flexShrink: 0,
						width: sidebarCollapsed
							? "var(--sidebar-collapsed-width)"
							: "var(--sidebar-width)",
						overflow: "hidden",
						transition: `width 250ms var(--m3-ease-effects)`,
					}}
				>
					<Sidebar
						isCollapsed={sidebarCollapsed}
						onToggle={onToggleSidebar}
						taskData={taskData}
						activeFilter={activeFilter}
						sidebarState={sidebarState}
					/>
				</Flex>
			)}

			{/* M3 Expressive bottom-sheet filters on mobile (position: bottom, xxl radius) */}
			<Drawer
				opened={drawerOpened}
				onClose={closeDrawer}
				title="Filters"
				padding={0}
				position="bottom"
				size="82%"
				radius="xxl"
				zIndex={200}
			>
				<Sidebar
					isCollapsed={false}
					onToggle={closeDrawer}
					taskData={taskData}
					activeFilter={activeFilter}
					sidebarState={sidebarState}
				/>
			</Drawer>

			<Flex
				className="todo-editor-frame"
				direction="column"
				style={{ flex: 1, minWidth: 0, overflow: "hidden" }}
			>
				{/* Single writing surface — the quick-add strip below the toolbar
						is the guided path; typing directly in the editor is the power
						path. The play layer adds rhythm dots, empty-state art,
						and the pet. The source view swaps the rich surface for the
						raw todo.txt text. */}
				<Editor
					editor={editor}
					toolbarVariant="full"
					onSave={onSave}
					onOpen={onOpen}
					onAiTools={onAiTools}
					onAdvancedTools={openAdvancedTools}
					className="tiptap-container"
					style={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						minHeight: 0,
					}}
					aboveContent={<QuickAddBar onAdd={handleQuickAdd} />}
					toolbarExtra={
						<RichTextEditor.Control
							onClick={() => setSourceMode((s) => !s)}
							active={sourceMode}
							aria-label="Toggle raw todo.txt source"
						>
							<Code2 size={16} />
						</RichTextEditor.Control>
					}
					playLayer={
						sourceMode ? (
							<Paper
								radius="lg"
								p="lg"
								className="tiptap-container todo-source-view"
								style={{
									flex: 1,
									display: "flex",
									flexDirection: "column",
									minHeight: 0,
									overflow: "auto",
								}}
							>
								<textarea
									className="todo-source-input"
									aria-label="Raw todo.txt source"
									spellCheck={false}
									value={todoState.content}
									onChange={(e) => handleSourceChange(e.currentTarget.value)}
								/>
							</Paper>
						) : (
							<EditorPlay
								mood={mood}
								isEmpty={isEmpty}
								onPetNudge={handlePetNudge}
								contentStyle={{
									flex: 1,
									display: "flex",
									flexDirection: "column",
								}}
							>
								<RichTextEditor.Content />
							</EditorPlay>
						)
					}
				/>

				{/* Desktop: collapsed-sidebar toggle rides on a smooth spring */}
				{!isMobile && (
					<Transition
						mounted={sidebarCollapsed}
						transition="slide-up"
						duration={300}
						timingFunction="var(--m3-ease-spatial-fast)"
					>
						{(transitionStyles) => (
							<ActionIcon
								className="app-floating-action todo-filter-action"
								variant="filled"
								color="evergreen"
								size="xl"
								onClick={onToggleSidebar}
								aria-label="Toggle Filters"
								style={{
									position: "fixed",
									bottom: "20px",
									right: "20px",
									zIndex: 100,
									transition:
										"transform 150ms ease, background-color 150ms ease",
									...transitionStyles,
								}}
							>
								<FilterIcon size={24} />
							</ActionIcon>
						)}
					</Transition>
				)}
			</Flex>

			<AdvancedToolsDialog
				opened={advancedToolsOpened}
				onClose={closeAdvancedTools}
				taskData={taskData}
			/>

			{/* Mobile: bottom-sheet filter FAB (secondary control), lifted
					above the bottom navigation bar and its safe-area inset */}
			{isMobile && (
				<ActionIcon
					className="app-floating-action todo-filter-action"
					variant="filled"
					color="evergreen"
					size="xl"
					onClick={openDrawer}
					aria-label="Open Filters"
					style={{
						position: "fixed",
						bottom: "calc(76px + env(safe-area-inset-bottom))",
						right: "20px",
						zIndex: 100,
					}}
				>
					<FilterIcon size={24} />
				</ActionIcon>
			)}
		</Flex>
	);
};

export default TodoPage;
