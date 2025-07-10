import { useState } from "react";
import "./App.scss";
import "./Header.scss";

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
import Help from "./Help";

const Sidebar = ({ viewMode, setViewMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isdark, setIsdark] = IsDark();
  const [md, setMD] = useState(() => {
    const savedMD = localStorage.getItem("markdownContent");
    return savedMD !== null ? savedMD : "Start Writing";
  });

  return (
    <div className="mobile-bar rounded-box menu-horizontal">
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

      <Export markdownContent={md} fileName="my-document" />
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
      <Help />
    </div>
  );
};
export default Sidebar;
