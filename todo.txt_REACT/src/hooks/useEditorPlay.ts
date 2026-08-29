import type { Editor as TipTapEditor } from "@tiptap/core";
import { useEffect, useRef, useState } from "react";

/**
 * Playfulness hooks for the editor surface.
 *
 * - `useWarmPlaceholder`: cycles inviting, handwritten-feel prompts instead of
 *   the static "Start writing your todos..." void.
 * - `useTaskActivity`: watches the parsed document and emits a mood the pet
 *   and other delight layers can consume (added / completed / idle).
 */

const WARM_PROMPTS = [
	"What's on your mind?",
	"One small thing first…",
	"Anything you'd like to remember?",
	"What will make today feel done?",
	"Start anywhere — no line is too small.",
	"Your future self will thank you.",
];

/** Rotating warm placeholder — swaps softly every few seconds of idleness. */
export function useWarmPlaceholder() {
	const [prompt, setPrompt] = useState(0);
	useEffect(() => {
		const t = window.setInterval(() => {
			setPrompt((p) => (p + 1) % WARM_PROMPTS.length);
		}, 7000);
		return () => window.clearInterval(t);
	}, []);
	return WARM_PROMPTS[prompt];
}

export type PetMood = "idle" | "add" | "celebrate" | "cheer";

/**
 * Derives the pet's mood from document activity:
 *  - mood "add"      → task count rose
 *  - mood "celebrate"→ a task was completed
 *  - mood "cheer"    → all tasks done
 *  - mood "idle"     → everything else (settles after 1.5s)
 */
export function useTaskActivity(
	editor: TipTapEditor | null,
	taskCount: number,
	doneCount: number,
) {
	const [mood, setMood] = useState<PetMood>("idle");
	const prevRef = useRef({ taskCount, doneCount });

	useEffect(() => {
		const prev = prevRef.current;
		if (taskCount !== prev.taskCount) {
			if (taskCount > prev.taskCount) setMood("add");
		} else if (doneCount !== prev.doneCount) {
			if (doneCount > prev.doneCount) {
				setMood(
					doneCount === taskCount && taskCount > 0 ? "cheer" : "celebrate",
				);
			}
		}
		prevRef.current = { taskCount, doneCount };

		const t = window.setTimeout(() => setMood("idle"), 1500);
		return () => window.clearTimeout(t);
	}, [taskCount, doneCount]);

	// Keep editor and prop counts in sync even when content re-parses silently.
	useEffect(() => {
		if (editor) prevRef.current = { taskCount, doneCount };
	}, [editor, taskCount, doneCount]);

	return mood;
}
