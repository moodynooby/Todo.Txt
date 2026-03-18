import "./AppHeader.css";
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
		<header>
			<div className="header-inner">
				<div className="logo-cont">
					<h1>T0do.Txt</h1>
				</div>

				<div className="ctrl-cont">
					<div className="toolbar-group">
						<button
							type="button"
							onClick={onOpenRepo}
							className="btn btn-sm btn-ghost p-4 m-2"
							title="Open Repository"
						>
							<FolderOpen size={18} />
							Open
						</button>
						<SaveMenu onSave={onSave} />
					</div>

					<div className="toolbar-divider" />

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
								className="radio"
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
								className="radio"
							/>
							<DraftingCompass size={18} />
							<span className="hidden sm:inline ml-1 text-xs">Draw</span>
						</label>
					</div>

					<div className="toolbar-divider" />

					<div className="toolbar-group">
						<button
							type="button"
							onClick={onAddTimer}
							className="btn btn-sm btn-ghost p-1"
							title="Add Timer"
						>
							<TimerIcon size={18} />
							<Plus size={12} className="-ml-1 -mt-1" />
						</button>
						<button
							type="button"
							onClick={onAiTools}
							className="btn btn-sm btn-ghost p-1"
							title="AI Tools"
						>
							<Sparkles size={18} />
						</button>
					</div>

					<div className="toolbar-divider" />

					<div className="toolbar-group">
						<ThemeToggle />
						<button
							type="button"
							onClick={() => toggleFullscreen()}
							className="btn btn-sm btn-ghost p-1"
							title="Fullscreen"
						>
							<FullscreenToggle />
						</button>
						<Help />
					</div>
				</div>
			</div>
		</header>
	);
};

export default AppHeader;
