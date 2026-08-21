import BroomIcon from "@/assets/3dicons-broom-dynamic-color.webp";
import NotebookIcon from "@/assets/3dicons-notebook-dynamic-color.webp";
import DrawingIcon from "@/assets/3dicons-painting-kit-dynamic-color.webp";
import TicIcon from "@/assets/3dicons-tick-dynamic-color.webp";

export interface ViewTab {
	value: string;
	label: string;
	tooltip: string;
	src: string;
}

/** Single source of truth for workspace navigation (header switchers + bottom nav). */
export const VIEW_TABS: ViewTab[] = [
	{ value: "todo", label: "Todo", tooltip: "Todo List", src: TicIcon },
	{ value: "habits", label: "Habits", tooltip: "Habits", src: BroomIcon },
	{ value: "notes", label: "Notes", tooltip: "Notes", src: NotebookIcon },
	{
		value: "excalidraw",
		label: "Draw",
		tooltip: "Drawing Canvas",
		src: DrawingIcon,
	},
];
