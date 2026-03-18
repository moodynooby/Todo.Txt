import {
	DraftingCompass,
	FolderOpen,
	Plus,
	Sparkles,
	SquarePen,
	Timer as TimerIcon,
} from "lucide-react";
import FullscreenToggle, { toggleFullscreen } from "../FullscreenToggle";
import Help from "../Help/Help";
import SaveMenu from "../SaveMenu/SaveMenu";
import ThemeToggle from "../ThemeToggle";

interface AppHeaderProps {
	viewMode: string;
	setViewMode: (mode: string) => void;
	onAddTimer: () => void;
	onOpenRepo: () => void;
	onSave: (format: string) => void;
	onAiTools: () => void;
}

const AppHeader = ({
	viewMode,
	setViewMode,
	onAddTimer,
	onOpenRepo,
	onSave,
	onAiTools,
}: AppHeaderProps) => {
	return (
		<header className="navbar bg-base-200 border-b border-base-300 fixed top-0 z-50 h-12 px-4">
			<div className="flex-1">
				<h1 className="text-xl font-bold text-primary">T0do.Txt</h1>
			</div>

			<div className="flex-none flex items-center gap-2">
				{/* Open & Save */}
				<div className="flex items-center gap-1">
					<button
						type="button"
						onClick={onOpenRepo}
						className="btn btn-ghost btn-sm"
						title="Open Repository"
					>
						<FolderOpen size={18} />
						<span className="hidden sm:inline">Open</span>
					</button>
					<SaveMenu onSave={onSave} />
				</div>

				<div className="divider divider-horizontal my-0 mx-1" />

				{/* View Toggle */}
				<div className="join">
					<label
						className={`join-item btn btn-ghost btn-sm ${
							viewMode === "text" ? "btn-active" : "opacity-70"
						}`}
					>
						<input
							type="radio"
							checked={viewMode === "text"}
							onChange={() => setViewMode("text")}
							aria-label="Text View"
							name="view-options"
							className="sr-only"
						/>
						<SquarePen size={18} />
						<span className="hidden sm:inline ml-1 text-xs">Text</span>
					</label>
					<label
						className={`join-item btn btn-ghost btn-sm ${
							viewMode === "excalidraw" ? "btn-active" : "opacity-70"
						}`}
					>
						<input
							type="radio"
							checked={viewMode === "excalidraw"}
							onChange={() => setViewMode("excalidraw")}
							aria-label="Excalidraw View"
							name="view-options"
							className="sr-only"
						/>
						<DraftingCompass size={18} />
						<span className="hidden sm:inline ml-1 text-xs">Draw</span>
					</label>
				</div>

				<div className="divider divider-horizontal my-0 mx-1" />

				{/* Timer & AI */}
				<div className="flex items-center gap-1">
					<button
						type="button"
						onClick={onAddTimer}
						className="btn btn-ghost btn-sm"
						title="Add Timer"
					>
						<TimerIcon size={18} />
						<Plus size={12} className="-ml-1 -mt-1" />
					</button>
					<button
						type="button"
						onClick={onAiTools}
						className="btn btn-ghost btn-sm"
						title="AI Tools"
					>
						<Sparkles size={18} />
					</button>
				</div>

				<div className="divider divider-horizontal my-0 mx-1" />

				{/* Theme, Fullscreen, Help */}
				<div className="flex items-center gap-1">
					<ThemeToggle />
					<button
						type="button"
						onClick={() => toggleFullscreen()}
						className="btn btn-ghost btn-sm"
						title="Fullscreen"
					>
						<FullscreenToggle />
					</button>
					<Help />
				</div>
			</div>
		</header>
	);
};

export default AppHeader;
