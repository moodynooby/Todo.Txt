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
  Download, // Added Download icon for install button
} from "lucide-react";
import IsDark from "./theme";
import Fullscreen from "./fullscreen";
import Export from "./Export";
import { useState, useEffect, useRef } from "react";
import HelpModal from "./helpModal";

const Header = ({ viewMode, setViewMode }) => {
  const [isdark, setIsdark] = IsDark();
  const [md, setMD] = useState(() => {
    const savedMD = localStorage.getItem("markdownContent");
    return savedMD !== null ? savedMD : "Start Writing";
  });

  // State for PWA installation
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      // Prevent the mini-infobar from appearing on mobile
      event.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPromptEvent(event);
      // Update UI to notify the user they can install the PWA
      setShowInstallButton(true);
      console.log("'beforeinstallprompt' event fired and stored.");
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      // Hide the install button once the app is installed
      setShowInstallButton(false);
      setInstallPromptEvent(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPromptEvent) {
      console.log("Install prompt event not available.");
      return;
    }
    // Show the prompt
    installPromptEvent.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await installPromptEvent.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, discard it
    setInstallPromptEvent(null);
    // Hide the install button regardless of the outcome
    setShowInstallButton(false);
  };

  return (
    <>
      <header className="overflow-x-auto shadow-primary pc-bar">
        <div className="logo-cont text-primary">
          <h1>T0do.TxT</h1>
        </div>
        <div className="ctrl-cont">
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
          <dialog
            id="export_modal"
            className="modal modal-bottom sm:modal-middle"
          >
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
          {showInstallButton && (
            <button
              className="btn btn-neutral m-1"
              onClick={handleInstallClick}
              title="Install App"
            >
              <Download size={20} />
            </button>
          )}
          <a
            onClick={() => document.getElementById("help_modal").showModal()}
            className="btn btn-neutral"
          >
            <Info size={20} />
          </a>
          <HelpModal />
        </div>
      </header>
    </>
  );
};

export default Header;
