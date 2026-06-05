import { ActionIcon, Drawer, Flex, Transition } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { Filter as FilterIcon } from "lucide-react";
import { useEffect } from "react";
import { Editor } from "@/components/Editor";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useTodoContext } from "@/context/TodoContext";
import { useViewContext } from "@/context/ViewContext";
import { useSidebarState } from "@/hooks/useSidebarState";
import type { SaveFormat } from "@/lib/documentExport";
import type { Filter, ParsedTodoContent } from "@/types/todo";

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
					direction="column"
					style={{
						flexShrink: 0,
						width: sidebarCollapsed
							? "var(--sidebar-collapsed-width)"
							: "var(--sidebar-width)",
						overflow: "hidden",
						transition: "width 250ms cubic-bezier(0.4, 0, 0.2, 1)",
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

			<Drawer
				opened={drawerOpened}
				onClose={closeDrawer}
				title="Filters"
				padding={0}
				size={280}
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

			<Flex direction="column" style={{ flex: 1, minWidth: 0 }}>
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
			</Flex>

			{isMobile ? (
				<ActionIcon
					variant="filled"
					size="xl"
					radius="xl"
					onClick={openDrawer}
					aria-label="Open Filters"
					style={{
						position: "fixed",
						bottom: "20px",
						right: "20px",
						zIndex: 100,
						boxShadow: "var(--mantine-shadow-md)",
					}}
				>
					<FilterIcon size={24} />
				</ActionIcon>
			) : (
				<Transition
					mounted={sidebarCollapsed}
					transition="slide-up"
					duration={300}
					timingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
				>
					{(transitionStyles) => (
						<ActionIcon
							variant="filled"
							size="xl"
							radius="xl"
							onClick={onToggleSidebar}
							aria-label="Toggle Filters"
							style={{
								position: "fixed",
								bottom: "20px",
								right: "20px",
								zIndex: 100,
								boxShadow: "var(--mantine-shadow-md)",
								transition: "transform 150ms ease, background-color 150ms ease",
								...transitionStyles,
							}}
						>
							<FilterIcon size={24} />
						</ActionIcon>
					)}
				</Transition>
			)}
		</Flex>
	);
};

export default TodoPage;
