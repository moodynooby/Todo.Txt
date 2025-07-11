import { useState, useEffect, useRef } from "react";
import "./App.scss";
import "./Header.scss";
import {
  PencilRuler,
  Sun,
  Moon,
  ALargeSmall,
  WholeWord,
  BookOpenText,
} from "lucide-react";
import IsDark from "./theme";
import Fullscreen from "./fullscreen";
import Export from "./Export";
import Help from "./Help";

const AppHeader = ({ viewMode, setViewMode }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isdark, setIsdark] = IsDark();
  const [md] = useState(() => {
    const savedMD = localStorage.getItem("markdownContent");
    return savedMD !== null ? savedMD : "Start Writing";
  });

  // Handle window resize to toggle between mobile and desktop views
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Common controls to be used in both mobile and desktop views
  const renderControls = () => (
    <>
      <div className="join">
        <label
          className={`join-item border-neutral-content btn ${
            viewMode === "text" ? "btn-primary" : "btn-ghost"
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
          <ALargeSmall />
        </label>
        <label
          className={`join-item border-neutral-content btn ${
            viewMode === "both" ? "btn-primary" : "btn-ghost"
          }`}
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
          className={`join-item border-neutral-content btn ${
            viewMode === "markdown" ? "btn-primary" : "btn-ghost"
          }`}
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
    </>
  );

  return (
    <>
      {isMobile ? (
        <div className="mobile-bar rounded-box menu-horizontal">
          {renderControls()}
        </div>
      ) : (
        <header className="overflow-x-auto shadow-primary pc-bar">
          <div className="logo-cont text-primary">
            <h1>T0do.TxT</h1>
          </div>
          <div className="ctrl-cont">
            {renderControls()}
          </div>
        </header>
      )}
    </>
  );
};

export default AppHeader;
