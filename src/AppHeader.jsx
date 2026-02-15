import "./AppHeader.css";
import {
  DraftingCompass,
  SquarePen,
  Maximize2,
  Timer as TimerIcon,
  Plus,
} from "lucide-react";
import Theme from "./theme";
import FullscreenIcon, { toggleFullscreen } from "./fullscreen";
import Help from "./Help";

const AppHeader = ({ viewMode, setViewMode, onAddTimer }) => {
  const renderControls = () => (
    <>
      <div className="join">
        <label
          className={`join-item btn btn-ghost btn-sm ${
            viewMode === "text" ? "text-primary" : "opacity-50"
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
          <SquarePen size={20} />
        </label>
        <label
          className={`join-item btn btn-ghost btn-sm ${
            viewMode === "excalidraw" ? "text-primary" : "opacity-50"
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
          <DraftingCompass size={20} />
        </label>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={onAddTimer}
          className="btn btn-sm btn-ghost p-1 text-primary"
          title="Add Timer"
        >
          <TimerIcon size={20} />
          <Plus size={10} className="-ml-1" />
        </button>
        <Theme />
        <button onClick={toggleFullscreen} className="btn btn-sm btn-ghost p-1">
          <FullscreenIcon />
        </button>
        <Help />
      </div>
    </>
  );

  return (
    <header>
      <div className="header-inner">
        <div className="logo-cont">
          <h1>T0do.Txt</h1>
        </div>
        <div className="ctrl-cont">{renderControls()}</div>
      </div>
    </header>
  );
};

export default AppHeader;
