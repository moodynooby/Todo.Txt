import { Paper, Tooltip } from "@mantine/core";
import { Plus } from "lucide-react";
import type { PetMood } from "@/hooks/useEditorPlay";

/**
 * Playful pet companion (M3 "delight" layer).
 *
 * A tiny companion at the bottom of the editor that reacts to the document's
 * rhythm: it bounces when a task is added, dances when one is completed, and
 * idles with a gentle breathe otherwise. Tapping it nudges a fresh task line
 * into the document so writing can continue without touching the toolbar.
 */

type PetStripProps = {
	mood: PetMood;
	onNudge: () => void;
};

const PET_FACES: Record<PetMood, string> = {
	idle: "🌱",
	add: "🌿",
	celebrate: "🎉",
	cheer: "✨",
};

export default function PetStrip({ mood, onNudge }: PetStripProps) {
	return (
		<Paper
			className="pet-strip"
			radius="xl"
			style={{
				position: "absolute",
				bottom: 8,
				right: 8,
				display: "flex",
				alignItems: "center",
				gap: 6,
				padding: "4px 10px",
				cursor: "pointer",
				userSelect: "none",
				zIndex: 5,
			}}
			onClick={onNudge}
		>
			<Tooltip label="Add a task" withArrow position="top">
				<span
					style={{
						display: "inline-block",
						fontSize: 18,
						lineHeight: 1,
						animation:
							mood === "celebrate"
								? "pet-dance 600ms var(--m3-ease-spatial-fast)"
								: mood === "add"
									? "pet-bounce 400ms var(--m3-ease-spatial-fast)"
									: "pet-breathe 3s ease-in-out infinite",
					}}
				>
					{PET_FACES[mood]}
				</span>
			</Tooltip>
			<Plus size={13} color="var(--app-ink-muted)" strokeWidth={2.5} />
		</Paper>
	);
}
