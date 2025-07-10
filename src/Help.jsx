import { X, Info } from "lucide-react";
import { useState } from "react";
import "./App.scss";
import "./Header.scss";

const Help = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  return (
    <>
      <button
        className="btn btn-neutral"
        onClick={openModal}
        aria-label="Open help dialog"
      >
        <Info size={20} />
      </button>

      <div
        className={`modal modal-bottom sm:modal-middle ${isOpen ? "modal-open" : ""}`}
      >
        <div className="modal-box overflow-y-auto help-box">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Help Dialog</h3>
            <button
              className="btn btn-sm btn-circle btn-ghost"
              onClick={closeModal}
              aria-label="Close help dialog"
            >
              <X size={20} />
            </button>
          </div>

          <table className="table table-xs table-zebra">
            <thead>
              <tr>
                <th>Syntax</th>
                <th>Output</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code># Heading 1</code>
                </td>
                <td>&lt;h1&gt;Heading 1&lt;/h1&gt;</td>
              </tr>
              <tr>
                <td>
                  <code>## Heading 2</code>
                </td>
                <td>&lt;h2&gt;Heading 2&lt;/h2&gt;</td>
              </tr>
              <tr>
                <td>
                  <code>**Bold Text**</code>
                </td>
                <td>&lt;strong&gt;Bold Text&lt;/strong&gt;</td>
              </tr>
              <tr>
                <td>
                  <code>*Italic Text*</code>
                </td>
                <td>&lt;em&gt;Italic Text&lt;/em&gt;</td>
              </tr>
              <tr>
                <td>
                  <code>~~Strikethrough~~</code>
                </td>
                <td>&lt;del&gt;Strikethrough&lt;/del&gt;</td>
              </tr>
              <tr>
                <td>
                  <code> Blockquote</code>
                </td>
                <td>&lt;blockquote&gt;Blockquote&lt;/blockquote&gt;</td>
              </tr>
              <tr>
                <td>
                  <code>- List item</code>
                </td>
                <td>&lt;ul&gt;&lt;li&gt;List item&lt;/li&gt;&lt;/ul&gt;</td>
              </tr>
              <tr>
                <td>
                  <code>1. Ordered item</code>
                </td>
                <td>&lt;ol&gt;&lt;li&gt;Ordered item&lt;/li&gt;&lt;/ol&gt;</td>
              </tr>
              <tr>
                <td>
                  <code>[Link Text](https://example.com)</code>
                </td>
                <td>&lt;a href="https://example.com"&gt;Link Text&lt;/a&gt;</td>
              </tr>
              <tr>
                <td>`` `inline code` ``</td>
                <td>&lt;code&gt;inline code&lt;/code&gt;</td>
              </tr>
              <tr>
                <td>```javascript\nconsole.log("Code");\n```</td>
                <td>
                  <pre>
                    <code className="language-javascript">
                      console.log("Code");
                    </code>
                  </pre>
                </td>
              </tr>
              <tr>
                <td>
                  <code>* [ ] Unchecked task</code>
                </td>
                <td>
                  &lt;ul&gt;&lt;li&gt;&lt;input type="checkbox" disabled=""&gt;
                  Unchecked task&lt;/li&gt;&lt;/ul&gt;
                </td>
              </tr>
              <tr>
                <td>
                  <code>* [x] Checked task</code>
                </td>
                <td>
                  &lt;ul&gt;&lt;li&gt;&lt;input type="checkbox" disabled=""
                  checked=""&gt; Checked task&lt;/li&gt;&lt;/ul&gt;
                </td>
              </tr>
              <tr>
                <td>
                  <code>---</code>
                </td>
                <td>&lt;hr&gt;</td>
              </tr>
              <tr>
                <td>
                  <code>
                    | Col 1 | Col 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |
                  </code>
                </td>
                <td>
                  <table>
                    <thead>
                      <tr>
                        <th>Col 1</th>
                        <th>Col 2</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Cell 1</td>
                        <td>Cell 2</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <code>@username@domain</code>
                </td>
                <td>
                  &lt;a
                  href="https://domain/@username"&gt;@username@domain&lt;/a&gt;
                </td>
              </tr>
              <tr>
                <td>
                  <code>:smile:</code>
                </td>
                <td>😊</td>
              </tr>
              <tr>
                <td>```javascript:MyCode.js\n// Some JavaScript code\n```</td>
                <td>
                  <pre>
                    <code className="language-javascript" title="MyCode.js">
                      // Some JavaScript code
                    </code>
                  </pre>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="modal-backdrop" onClick={closeModal}></div>
      </div>
    </>
  );
};
export default Help;
