import { useState } from "react";
import { Menu } from "lucide-react";
import "./App.scss";
import "./sidebar.scss";

import {
  PencilRuler,
  Sun,
  Moon,
  ALargeSmall,
  WholeWord,
  BookOpenText,
  FileDown,
  X,
  Info,
} from "lucide-react";
import IsDark from "./theme";
import Fullscreen from "./fullscreen";
import Export from "./Export";
import { useState, useEffect, useRef } from "react";
import HelpModal from "./helpModal";

const Sidebar = ({ viewMode, setViewMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isdark, setIsdark] = IsDark();
  const [md, setMD] = useState(() => {
    const savedMD = localStorage.getItem("markdownContent");
    return savedMD !== null ? savedMD : "Start Writing";
  });

  return (
    <div className="menu rounded-box menu-horizontal">
      <div className="join">
        <label
          className={`join-item btn ${viewMode === "text" ? "btn-primary" : "btn-neutral"}`}
        >
          <input
            type="radio"
            checked={viewMode === "text"}
            onChange={() => setViewMode("text")}
            aria-label="Text View"
            name="view-options"
            className="radio"
          />
          <ALargeSmall />
        </label>
        <label
          className={`join-item btn ${viewMode === "both" ? "btn-primary" : "btn-neutral"}`}
        >
          <input
            type="radio"
            checked={viewMode === "both"}
            onChange={() => setViewMode("both")}
            aria-label="Split View"
            name="view-options"
            className="radio"
          />
          <BookOpenText />
        </label>
        <label
          className={`join-item btn ${viewMode === "markdown" ? "btn-primary" : "btn-neutral"}`}
        >
          <input
            type="radio"
            checked={viewMode === "markdown"}
            onChange={() => setViewMode("markdown")}
            aria-label="Markdown View"
            name="view-options"
            className="radio"
          />
          <WholeWord />
        </label>
      </div>

      <button
        className="btn btn-neutral m-1"
        onClick={() => document.getElementById("export_modal").showModal()}
      >
        <FileDown size={20} />
      </button>
      <dialog id="export_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h1 className="text-primary">Export Dialog</h1>
          <Export markdownContent={md} fileName="my-document" />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-error">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <div>
        <a
          href="https://todopng.netlify.app/"
          rel="noopener noreferrer"
          className="btn btn-neutral"
        >
          <PencilRuler size={20} />
        </a>
      </div>
      <label className="toggle text-base-content">
        <input
          type="checkbox"
          className="theme-controller bg-primary text-primary-content rounded-selector"
          value={isdark}
          checked={isdark === "checked"}
          onChange={(e) => setIsdark(e.target.checked ? "checked" : "")}
        />
        <Sun size={20} aria-label="sun" className="theme-icon" />
        <Moon size={20} aria-label="moon" className="theme-icon" />
      </label>
      <div className="fullscreen">
        <Fullscreen size={20} />
      </div>
      <a
        onClick={() => document.getElementById("help_modal").showModal()}
        className="btn btn-neutral"
      >
        <Info size={20} />
      </a>
      <HelpModal />
    </div>
  );
};
export default Sidebar;
