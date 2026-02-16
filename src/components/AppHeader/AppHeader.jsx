import "./AppHeader.css";
import PropTypes from 'prop-types';
import {
  DraftingCompass,
  SquarePen,
  Timer as TimerIcon,
  Plus,
  FolderOpen,
  Sparkles,
} from "lucide-react";
import Theme from "../../utils/theme.jsx";
import FullscreenIcon, { toggleFullscreen } from "../../utils/fullscreen.jsx";
import Help from "../Help/Help";
import SaveMenu from "../SaveMenu/SaveMenu";

const AppHeader = ({ viewMode, setViewMode, onAddTimer, onOpenRepo, onSave, onAiTools }) => {
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
              className="btn btn-sm btn-ghost p-4 m-2"
              title="Open Repository"
              variant="outlined"
            >
              <FolderOpen size={18} />
              Open
            </button>
            <SaveMenu
              onSave={onSave}
            />
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

AppHeader.propTypes = {
  viewMode: PropTypes.string.isRequired,
  setViewMode: PropTypes.func.isRequired,
  onAddTimer: PropTypes.func.isRequired,
  onOpenRepo: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onAiTools: PropTypes.func.isRequired,
};

export default AppHeader;
