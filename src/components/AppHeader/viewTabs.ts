import BroomIcon from "@/assets/3dicons-broom-dynamic-color.webp";
import NotebookIcon from "@/assets/3dicons-notebook-dynamic-color.webp";
import DrawingIcon from "@/assets/3dicons-painting-kit-dynamic-color.webp";
import TicIcon from "@/assets/3dicons-tick-dynamic-color.webp";

/* Inline SVG keeps the tab asset-free while matching the evergreen accent.
 * Same glyph family as the lucide `refresh-cw` icon used elsewhere. */
const SYNC_ICON =
	"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232f6f61' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8'/%3E%3Cpath d='M21 3v5h-5'/%3E%3Cpath d='M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16'/%3E%3Cpath d='M8 16H3v5'/%3E%3C/svg%3E";

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
	{
		value: "sync",
		label: "Sync",
		tooltip: "P2P Sync (local network)",
		src: SYNC_ICON,
	},
];
