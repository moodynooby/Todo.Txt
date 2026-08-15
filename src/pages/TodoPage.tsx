import { ActionIcon, Drawer, Flex, Transition } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { Filter as FilterIcon } from "lucide-react";
import { useEffect } from "react";
import { Editor } from "@/components/Editor";
import { QuickAddBar } from "@/components/QuickAddBar";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useTodoContext } from "@/context/TodoContext";
import { useViewContext } from "@/context/ViewContext";
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
	const { editor } = useTodoContext();
	const { state: viewState, dispatchView } = useViewContext();
	const sidebarCollapsed = viewState.sidebarCollapsed;
	const onToggleSidebar = () => dispatchView({ type: "TOGGLE_SIDEBAR" });

	const isMobile = useMediaQuery("(max-width: 768px)");
	const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
		useDisclosure(false);

	const sidebarState = useSidebarState({
		taskData,
		activeFilter,
		onFilterChange,
	});

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
				size="100%"
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
				<QuickAddBar editor={editor} />

				<Editor
					editor={editor}
					toolbarVariant="full"
					onSave={onSave}
					onOpen={onOpen}
					onAiTools={onAiTools}
					className="tiptap-container"
					style={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						minHeight: 0,
					}}
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

			{/* Mobile: bottom-sheet filter FAB (secondary control) */}
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
						bottom: "20px",
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
