import { useState, useEffect, useRef } from "react";
import "./App.scss";
import "./Header.scss";
import {
  ALargeSmall,
  WholeWord,
  BookOpenText,
  DraftingCompass,
} from "lucide-react";
import Theme from "./theme";
import Fullscreen from "./fullscreen";
import Export from "./Export";
import Help from "./Help";

const AppHeader = ({ viewMode, setViewMode }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [md] = useState(() => {
    const savedMD = localStorage.getItem("markdownContent");
    return savedMD !== null ? savedMD : "Start Writing";
  });

  // Handle window resize to toggle between mobile and desktop views
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Common controls to be used in both mobile and desktop views
  const renderControls = () => (
    <>
      <div className="join">
        <label
          className={`join-item  btn btn-soft ${viewMode === "text" ? "btn-primary " : ""
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
          <ALargeSmall size={20} />
        </label>
        <label
          className={`join-item  btn btn-soft  ${viewMode === "both" ? "btn-primary" : ""
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
          <BookOpenText size={20} />
        </label>
        <label
          className={`join-item  btn btn-soft ${viewMode === "markdown" ? "btn-primary " : ""
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
          <WholeWord size={20} />
        </label>
        <label
          className={`join-item btn btn-soft ${viewMode === "excalidraw" ? "btn-accent" : ""
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
      {viewMode !== "excalidraw" && (
        <>
          <Export markdownContent={md} fileName="my-document" />
        </>
      )}
      <Theme />

      {viewMode !== "excalidraw" && (
        <>
          <Fullscreen />

          <Help />
        </>
      )}
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
          <div
            className={`logo-cont ${viewMode === "excalidraw" ? "text-accent" : "text-primary"}`}
          >
            <h1>T0do.TxT</h1>
          </div>
          <div className="ctrl-cont">{renderControls()}</div>
        </header>
      )}
    </>
  );
};

export default AppHeader;
