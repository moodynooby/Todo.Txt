

import {
  PencilRuler,
  Sun,
  Moon,
  ALargeSmall,
  WholeWord,
  BookOpenText,
  FileDown,
} from "lucide-react";
import IsDark from "./theme";
import Fullscreen from "./fullscreen";
import DocxExport from './DocxExport';
import { Info } from "lucide-react";

import { useState, useEffect, useRef } from "react";



import Link from 'next/link';

const Header = ({ viewMode, setViewMode }) => {
  const [isdark, setIsdark] = IsDark();
  const [md, setMD] = useState('Start Writing');

  useEffect(() => {
    try {
      const savedMD = localStorage.getItem('markdownContent');
      if (savedMD) {
        setMD(savedMD);
      }
    } catch (error) {
      console.error('Error loading from local storage:', error);
    }
  }, []);

  return (
    <header>
      <div className="logo-cont">
        <Link href="/">
          <h1>T0do.TxT</h1>
        </Link>
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
          
          <div className="tool-cont dropdown">
            <a tabIndex={0} role="button" >  <FileDown size={20} /></a>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 text-base-content rounded-box z-1 w-52 p-2 shadow-sm">
              <li>                        <DocxExport markdownContent={md} fileName="my-document" />
              </li>
              {/* <li>Export As Text</li>
              <li>Export As MarkDown</li>
              <li>Export As HTML</li> */}

            </ul>

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
            <a onClick={() => document.getElementById('my_modal_1').showModal()} >
              <Info size={20} />
            </a>
          </div>

          <div className="tool-cont fullscreen">
            <Fullscreen element={typeof window !== 'undefined' ? document.documentElement : null} />
          </div>

        </div>

      </div>

    </header>
  );
};

export default Header;
