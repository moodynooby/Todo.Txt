import { Box, Paper, Text } from "@mantine/core";
import { Pencil } from "lucide-react";
import type { PetMood } from "@/hooks/useEditorPlay";
import { useWarmPlaceholder } from "@/hooks/useEditorPlay";
import PetStrip from "./PetStrip";

/**
 * Playful chrome that wraps the writing surface — keeps the TipTap content
 * untouched while layering delight around it:
 *
 *  - Warm cycling placeholder (replaces the empty void)
 *  - Task-rhythm strip: a heartbeat of dots showing progress per task
 *  - Empty-state art: a little seedling + pencil doodle when the doc is bare
 *  - The pet companion strip at the bottom-right
 */

type EditorPlayProps = {
	mood: PetMood;
	taskCount: number;
	doneCount: number;
	isEmpty: boolean;
	contentStyle: React.CSSProperties;
	onPetNudge: () => void;
	children: React.ReactNode;
};

export default function EditorPlay({
	mood,
	taskCount,
	doneCount,
	isEmpty,
	contentStyle,
	onPetNudge,
	children,
}: EditorPlayProps) {
	const warmPrompt = useWarmPlaceholder();

	return (
		<Box
			pos="relative"
			style={{
				flex: 1,
				display: "flex",
				flexDirection: "column",
				minHeight: 0,
			}}
		>
			{/* Task-rhythm strip — one capsule per task; filled = completed.
			    Appears only when there is something to celebrate. */}
			{taskCount > 0 && (
				<Box
					className="task-rhythm-strip"
					style={{
						display: "flex",
						gap: 4,
						padding: "6px 20px 0",
						flexWrap: "wrap",
					}}
				>
					{Array.from({ length: taskCount }).map((_, dotIndex) => (
						<Paper
							key={`dot-${taskCount}-${doneCount}-${dotIndex}`}
							radius="xl"
							withBorder
							className={
								dotIndex < doneCount
									? "task-rhythm-dot task-rhythm-done"
									: "task-rhythm-dot"
							}
							style={{ width: 14, height: 7 }}
						/>
					))}
				</Box>
			)}

			<Paper
				radius="lg"
				shadow="sm"
				p="lg"
				className="tiptap-container"
				style={{
					...contentStyle,
					minHeight: 0,
					overflow: "auto",
				}}
			>
				{children}

				{/* Empty-state art: a sprouting seedling gives the void warmth. */}
				{isEmpty && (
					<Box
						className="empty-state-art"
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: 8,
							margin: "8px 0 0",
							animation: "pet-breathe 3s ease-in-out infinite",
						}}
					>
						<span style={{ fontSize: 34, lineHeight: 1 }}>🌱</span>
						<Pencil
							size={18}
							color="var(--app-ink-muted)"
							style={{ transform: "rotate(-12deg)" }}
						/>
						<Text className="warm-placeholder" size="sm" c="dimmed">
							{warmPrompt}
						</Text>
					</Box>
				)}
			</Paper>

			<PetStrip
				mood={mood}
				taskCount={taskCount}
				doneCount={doneCount}
				onNudge={onPetNudge}
			/>
		</Box>
	);
}
