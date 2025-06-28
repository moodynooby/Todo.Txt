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
import DocxExport from './DocxExport';
import HelpButton from './Help';
import { useState, useEffect } from "react";



const Header = ({ viewMode, setViewMode }) => {
  const [isdark, setIsdark] = IsDark();
   const [md, setMD] = useState(() => {
      const savedMD = localStorage.getItem("markdownContent");
      return savedMD !== null ? savedMD : "Start Writing";
    });
  return (
    <header>
      <div className="logo-cont">
        {" "}
        <h1>T0do.TxT</h1>
      </div>
      <div className="ctrl-cont">
           <div className="ctrl-cont-2">
            <div className="overflow-x-auto max-w-60">
          <div role="tablist" className="tabs tabs-box min-w-max">
            <a role="tab" className={`tab ${viewMode === "text" ? "tab-active" : ""} sticky start-0`} onClick={() => setViewMode("text")}>
              <ALargeSmall />
            </a>
            <a role="tab" className={`tab ${viewMode === "both" ? "tab-active" : ""} sticky start-0`} onClick={() => setViewMode("both")}>
                     <BookOpenText />

              </a>
            <a role="tab" className={`tab ${viewMode === "markdown" ? "tab-active" : ""} sticky start-0`} onClick={() => setViewMode("markdown")}>
                  <WholeWord />
            </a>
          </div>
          </div>
        </div>
        <div className="ctrl-cont-1">
          <div className="tool-cont">
            <a href="https://todopng.netlify.app/" rel="noopener noreferrer">
              <PencilRuler size={20} />
            </a>
          </div>
          <div className="tool-cont">
                        <DocxExport markdownContent={md} fileName="my-document" />

          </div>
                    <label className="tool-cont toggle" >
            <input
              type="checkbox"
              className="theme-controller"
              value={isdark}
              checked={isdark === "checked"}
              onChange={(e) => setIsdark(e.target.checked ? "checked" : "")}
            />

            <Sun size={20} aria-label="sun" className="theme-icon" />

            <Moon size={20} aria-label="moon" className="theme-icon" />
          </label>
  <div className="tool-cont">
            <HelpButton/>
          </div>

          <div className="tool-cont fullscreen">
            <Fullscreen size={20} />
          </div>

        </div>

      </div>
    </header>
  );
};

export default Header;
