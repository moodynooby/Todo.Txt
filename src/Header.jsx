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
} from "lucide-react";
import IsDark from "./theme";
import Fullscreen from "./fullscreen";
import Export from './Export';
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
    <header className="overflow-x-auto">
      <div className="logo-cont">
        {" "}
        <h1>T0do.TxT</h1>
      </div>
      <div className="ctrl-cont">
        <div className="join">
          <label className="join-item btn">
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
          <label className="join-item btn">
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
          <label className="join-item btn">
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
          onClick={() => document.getElementById('export_modal').showModal()}        >
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
        <a id="install" ref={installButton} hidden className="btn btn-neutral" onClick={handleInstallClick}>Install</a>

        <div>
          <a href="https://todopng.netlify.app/" rel="noopener noreferrer" className="btn btn-neutral">
            <PencilRuler size={20} />
          </a>
        </div>
        <label className="toggle text-base-content">
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
        <div className="fullscreen">
          <Fullscreen size={20} />
        </div>
        <a onClick={() => document.getElementById('help_modal').showModal()} className="btn">
          <Info size={20} />
        </a>
        <dialog className="modal modal-bottom sm:modal-middle" id="help_modal">
          <div className="modal-box rounded-box border border-base-content/5 help-box" >
            <div className="modal-action">
              <form method="dialog" >        {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-error"><X /></button>
              </form>
            </div>
            <h1 className="text-primary">Help Dialog</h1>


            <table className="table table-xs table-zebra">
              <thead>
                <tr>
                  <th>Syntax</th>
                  <th>Output</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code># Heading 1</code></td>
                  <td>&lt;h1&gt;Heading 1&lt;/h1&gt;</td>
                </tr>
                <tr>
                  <td><code>## Heading 2</code></td>
                  <td>&lt;h2&gt;Heading 2&lt;/h2&gt;</td>
                </tr>
                <tr>
                  <td><code>**Bold Text**</code></td>
                  <td>&lt;strong&gt;Bold Text&lt;/strong&gt;</td>
                </tr>
                <tr>
                  <td><code>*Italic Text*</code></td>
                  <td>&lt;em&gt;Italic Text&lt;/em&gt;</td>
                </tr>
                <tr>
                  <td><code>~~Strikethrough~~</code></td>
                  <td>&lt;del&gt;Strikethrough&lt;/del&gt;</td>
                </tr>
                <tr>
                  <td><code>  Blockquote</code></td>
                  <td>&lt;blockquote&gt;Blockquote&lt;/blockquote&gt;</td>
                </tr>
                <tr>
                  <td><code>- List item</code></td>
                  <td>&lt;ul&gt;&lt;li&gt;List item&lt;/li&gt;&lt;/ul&gt;</td>
                </tr>
                <tr>
                  <td><code>1. Ordered item</code></td>
                  <td>&lt;ol&gt;&lt;li&gt;Ordered item&lt;/li&gt;&lt;/ol&gt;</td>
                </tr>
                <tr>
                  <td><code>[Link Text](https://example.com)</code></td>
                  <td>&lt;a href="https://example.com"&gt;Link Text&lt;/a&gt;</td>
                </tr>
                <tr>
                  <td>`` `inline code` ``</td>
                  <td>&lt;code&gt;inline code&lt;/code&gt;</td>
                </tr>
                <tr>
                  <td>```javascript\nconsole.log("Code");\n```</td>
                  <td>
                    <pre><code className="language-javascript">console.log("Code");</code></pre>
                  </td>
                </tr>
                <tr>
                  <td><code>* [ ] Unchecked task</code></td>
                  <td>&lt;ul&gt;&lt;li&gt;&lt;input type="checkbox" disabled=""&gt; Unchecked task&lt;/li&gt;&lt;/ul&gt;</td>
                </tr>
                <tr>
                  <td><code>* [x] Checked task</code></td>
                  <td>&lt;ul&gt;&lt;li&gt;&lt;input type="checkbox" disabled="" checked=""&gt; Checked task&lt;/li&gt;&lt;/ul&gt;</td>
                </tr>
                <tr>
                  <td><code>---</code></td>
                  <td>&lt;hr&gt;</td>
                </tr>
                <tr>
                  <td><code>| Col 1 | Col 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |</code></td>
                  <td>
                    <table><thead><tr><th>Col 1</th><th>Col 2</th></tr></thead><tbody><tr><td>Cell 1</td><td>Cell 2</td></tr></tbody></table>
                  </td>
                </tr>
                <tr>
                  <td><code>@username@domain</code></td>
                  <td>&lt;a href="https://domain/@username"&gt;@username@domain&lt;/a&gt;</td>
                </tr>
                <tr>
                  <td><code>:smile:</code></td>
                  <td>😊</td>
                </tr>
                <tr>
                  <td>```javascript:MyCode.js\n// Some JavaScript code\n```</td>
                  <td>
                    <pre><code className="language-javascript" title="MyCode.js">// Some JavaScript code</code></pre>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </dialog >

      </div>
    </header>
  );
};

export default Header;
