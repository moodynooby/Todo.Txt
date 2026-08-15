import { Group, Paper, Text, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Playful pet companion strip (M3 "delight" layer).
 *
 * A tiny companion that lives at the bottom of the editor and reacts to the
 * document's rhythm: it bounces when a task is added, does a little dance
 * when one is completed, and settles into a gentle idle breathe when
 * nothing is happening. Tapping it is a shortcut — it nudges a fresh task
 * line into the document so the user can keep writing without touching the
 * toolbar.
 */

export type PetMood = "idle" | "add" | "celebrate" | "cheer";

type PetStripProps = {
	mood: PetMood;
	taskCount: number;
	doneCount: number;
	onNudge: () => void;
};

const PET_FACES: Record<PetMood, string> = {
	idle: "🌱",
	add: "🌿",
	celebrate: "🎉",
	cheer: "✨",
};

const PET_SPEAK: Record<PetMood, string[]> = {
	idle: ["", "", ""],
	add: ["New task! 🎈", "Got it!", "On the list!"],
	celebrate: ["Nice work!", "One down!", "Keep going!"],
	cheer: ["You're on fire! 🔥", "Great streak!", "Look at you go!"],
};

export default function PetStrip({
	mood,
	taskCount,
	doneCount,
	onNudge,
}: PetStripProps) {
	const isMobile = useMediaQuery("(max-width: 768px)");
	const [bubble, setBubble] = useState<string | null>(null);

	// Speak a short, rotating line whenever the mood changes (never spam).
	useEffect(() => {
		const lines = PET_SPEAK[mood];
		const line =
			mood === "idle" ? null : lines[Math.floor(Math.random() * lines.length)];
		setBubble(line);
		if (line) {
			const t = window.setTimeout(() => setBubble(null), 2200);
			return () => window.clearTimeout(t);
		}
		return undefined;
	}, [mood]);

	const progress =
		taskCount > 0 ? Math.round((doneCount / taskCount) * 100) : 0;

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
			{/* The speech bubble surfaces the pet's short reaction line. */}
			{bubble && (
				<Text
					size="xs"
					fw={600}
					c="dimmed"
					style={{
						animation: "pet-fade-in 200ms var(--m3-ease-effects)",
						whiteSpace: "nowrap",
					}}
				>
					{bubble}
				</Text>
			)}

			<Group gap={4} wrap="nowrap">
				<Text
					size="lg"
					style={{
						display: "inline-block",
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
				</Text>

				{/* A tiny rhythm progress readout keeps the pet honest. */}
				{taskCount > 0 && !isMobile && (
					<Text size="xs" c="dimmed" style={{ whiteSpace: "nowrap" }}>
						{doneCount}/{taskCount} · {progress}%
					</Text>
				)}

				<Tooltip label="Add a task" withArrow position="top">
					<Plus size={13} color="var(--app-ink-muted)" strokeWidth={2.5} />
				</Tooltip>
			</Group>
		</Paper>
	);
}
