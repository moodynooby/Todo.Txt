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
  Info,
} from "lucide-react";
import IsDark from "./theme";
import Fullscreen from "./fullscreen";
import Export from "./Export";
import { useState, useEffect, useRef } from "react";
import Help from "./Help";

const Header = ({ viewMode, setViewMode }) => {
  const [isdark, setIsdark] = IsDark();
  const [md, setMD] = useState(() => {
    const savedMD = localStorage.getItem("markdownContent");
    return savedMD !== null ? savedMD : "Start Writing";
  });
  return (
    <>
      <header className="overflow-x-auto shadow-primary pc-bar">
        <div className="logo-cont text-primary">
          <h1>T0do.TxT</h1>
        </div>
        <div className="ctrl-cont ">
          <div className="join">
            <label
              className={`join-item border-neutral-content btn ${viewMode === "text" ? "btn-primary" : "btn-ghost"}`}
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
              className={`join-item border-neutral-content btn ${viewMode === "both" ? "btn-primary" : "btn-ghost"}`}
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
              className={`join-item border-neutral-content btn ${viewMode === "markdown" ? "btn-primary" : "btn-ghost"}`}
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
      </header>
    </>
  );
};

export default Header;
