import "./AppHeader.css";
import {
  DraftingCompass,
  SquarePen,
  Timer as TimerIcon,
  Plus,
  FolderOpen,
  Save,
  Sparkles,
} from "lucide-react";
import Theme from "../../utils/theme.jsx";
import FullscreenIcon, { toggleFullscreen } from "../../utils/fullscreen.jsx";
import Help from "../Help/Help";

const AppHeader = ({ viewMode, setViewMode, onAddTimer, onOpenRepo, onSaveAsMd, onSaveAsTxt, onSaveAsHtml, onAiTools }) => {
  return (
    <header>
      <div className="header-inner">
        <div className="logo-cont">
          <h1>T0do.Txt</h1>
        </div>

     
        <div className="ctrl-cont">
          <div className="toolbar-group">
            <button
              onClick={onOpenRepo}
              className="btn btn-sm btn-ghost p-1"
              title="Open Repository"
            >
              <FolderOpen size={18} />
            </button>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-sm btn-ghost p-1 m-1" title="Save">
                <Save size={18} />
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32 ">
                <li><button type="button" onClick={onSaveAsMd}>Save as Markdown (.md)</button></li>
                <li><button type="button" onClick={onSaveAsTxt}>Save as Plain Text (.txt)</button></li>
                <li><button type="button" onClick={onSaveAsHtml}>Save as HTML (.html)</button></li>
              </ul>
            </div>
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
              onClick={onAddTimer}
              className="btn btn-sm btn-ghost p-1"
              title="Add Timer"
            >
              <TimerIcon size={18} />
              <Plus size={12} className="-ml-1 -mt-1" />
            </button>
            <button
              onClick={onAiTools}
              className="btn btn-sm btn-ghost p-1"
              title="AI Tools"
            >
              <Sparkles size={18} />
            </button>
       
          </div>

          <div className="toolbar-divider" />

          <div className="toolbar-group">
            <Theme />
            <button
              onClick={toggleFullscreen}
              className="btn btn-sm btn-ghost p-1"
              title="Fullscreen"
            >
              <FullscreenIcon />
            </button>
            <Help />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
