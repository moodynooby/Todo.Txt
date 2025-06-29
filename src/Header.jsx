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
} from "lucide-react";
import IsDark from "./theme";
import Fullscreen from "./fullscreen";
import DocxExport from './DocxExport';
import { Info } from "lucide-react";

import { useState, useEffect, useRef } from "react";



const Header = ({ viewMode, setViewMode }) => {
  const [isdark, setIsdark] = IsDark();
  const [md, setMD] = useState(() => {
    const savedMD = localStorage.getItem("markdownContent");
    return savedMD !== null ? savedMD : "Start Writing";
  });

  const deferredPrompt = useRef(null);
  const installButton = useRef(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      deferredPrompt.current = e;
      if (installButton.current) {
        installButton.current.hidden = false;
      }
    };

    const handleAppInstalled = () => {
      if (installButton.current) {
        installButton.current.hidden = true;
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt();
      const { outcome } = await deferredPrompt.current.userChoice;
      if (outcome === 'accepted') {
        deferredPrompt.current = null;
      }
    }
  };

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
          <a id="install" ref={installButton} hidden className="btn tool-cont" onClick={handleInstallClick}>Install</a>

          <div className="tool-cont">

            <a href="https://todopng.netlify.app/" rel="noopener noreferrer">
              <PencilRuler size={20} />
            </a>
          </div>
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
            <Fullscreen size={20} />
          </div>

        </div>

      </div>

    </header>
  );
};

export default Header;
