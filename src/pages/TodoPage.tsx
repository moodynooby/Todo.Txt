import { ActionIcon, Flex, Transition } from "@mantine/core";
import { Filter as FilterIcon } from "lucide-react";
import { memo, useMemo } from "react";
import { Editor } from "@/components/Editor";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useEditor } from "@/context/EditorContext";
import type { Filter, ParsedTodoContent } from "@/types/todo";

interface TodoPageProps {
	taskData: ParsedTodoContent;
	activeFilter: Filter | null;
	onFilterChange: (filter: Filter | null) => void;
}

const TodoPage = memo(
	({ taskData, activeFilter, onFilterChange }: TodoPageProps) => {
		const { editor, sidebarCollapsed, onToggleSidebar } = useEditor();

		const flexStyle = useMemo(
			() => ({
				flex: 1,
				minHeight: 0,
				overflow: "hidden" as const,
				position: "relative" as const,
			}),
			[],
		);

		const sidebarStyle = useMemo(
			() => ({
				flexShrink: 0,
				width: sidebarCollapsed ? 0 : "var(--sidebar-width)",
				opacity: sidebarCollapsed ? 0 : 1,
				overflow: "hidden",
				transition:
					"width 250ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease",
			}),
			[sidebarCollapsed],
		);

		const editorFlexStyle = useMemo(() => ({ flex: 1, minWidth: 0 }), []);

		const editorStyle = useMemo(
			() => ({
				flex: 1,
				display: "flex",
				flexDirection: "column" as const,
				minHeight: 0,
			}),
			[],
		);

		const fabStyle = useMemo(
			() => ({
				position: "fixed" as const,
				bottom: "20px",
				right: "20px",
				zIndex: 100,
				boxShadow: "var(--mantine-shadow-md)",
				transition: "transform 150ms ease, background-color 150ms ease",
			}),
			[],
		);

		if (!editor) return null;

		return (
			<Flex direction="row" style={flexStyle}>
				<Flex direction="column" style={sidebarStyle}>
					<Sidebar
						isCollapsed={false}
						onToggle={onToggleSidebar}
						taskData={taskData}
						activeFilter={activeFilter}
						onFilterChange={onFilterChange}
					/>
				</Flex>
				<Flex direction="column" style={editorFlexStyle}>
					<Editor
						editor={editor}
						toolbarVariant="full"
						className="tiptap-container"
						style={editorStyle}
					/>
				</Flex>
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
								...fabStyle,
								...transitionStyles,
							}}
							className="fab-hover-effect"
						>
							<FilterIcon size={24} />
						</ActionIcon>
					)}
				</Transition>
			</Flex>
		);
	},
);

export default TodoPage;
