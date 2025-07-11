// Export.jsx
import React, { useState } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkDocx from "remark-docx";
import { saveAs } from "file-saver";
import { Download, X, SquareCode, SquareM, SquareLibrary } from "lucide-react";

const Export = ({ markdownContent, fileName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [htmlContent] = useState(() => {
    const savedMD = localStorage.getItem("htmlContent");
    return savedMD !== null ? savedMD : "Start Writing";
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleExport = async (type) => {
    try {
      let blob, extension;

      switch (type) {
        case "docx":
          const processor = unified()
            .use(remarkParse)
            .use(remarkDocx, { output: "blob" });
          const doc = await processor.process(markdownContent);
          blob = await doc.result;
          extension = "docx";
          break;

        case "md":
          blob = new Blob([markdownContent], { type: "text/markdown" });
          extension = "md";
          break;

        case "html":
          blob = new Blob([htmlContent], { type: "text/html" });
          extension = "html";
          break;

        default:
          return;
      }

      saveAs(blob, `${fileName || "document"}.${extension}`);
      closeModal();
    } catch (error) {
      console.error(`Error exporting ${type.toUpperCase()}:`, error);
      alert(
        `Failed to export ${type.toUpperCase()}. Please check the console for details.`,
      );
    }
  };

  return (
    <>
      <button
        className="btn btn-soft"
        onClick={openModal}
        aria-label="Export document"
      >
        <Download size={20} />
      </button>

      <div
        className={`modal modal-bottom sm:modal-middle ${isOpen ? "modal-open" : ""}`}
      >
        <div className="modal-box overflow-y-auto export-box">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Export Document</h3>
            <button
              className="btn btn-sm btn-circle btn-ghost"
              onClick={closeModal}
              aria-label="Close export dialog"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => handleExport("docx")}
              className="btn btn-block justify-start gap-2"
            >
              <SquareLibrary size={18} />
              Export as DOCX
            </button>

            <button
              onClick={() => handleExport("md")}
              className="btn btn-block justify-start gap-2"
            >
              <SquareM size={18} />
              Export as Markdown
            </button>

            <button
              onClick={() => handleExport("html")}
              className="btn btn-block justify-start gap-2"
            >
              <SquareCode size={18} />
              Export as HTML
            </button>
          </div>

          <div className="modal-action">
            <button className="btn" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Export;
