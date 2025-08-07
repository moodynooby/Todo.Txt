import "./App.css";
import { useState, useEffect, useRef } from "react";
import ExcalidrawPage from "./ExcalidrawPage";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import QuillMarkdown from "quilljs-markdown";
import "quilljs-markdown/dist/quilljs-markdown-common-style.css";

const App = ({ viewMode }) => {
  const quillContainerRef = useRef(null);
  const toolbarRef = useRef(null);
  const quillInstanceRef = useRef(null);

  // RTE (Quill) state
  const [rteContent, setRteContent] = useState(() => {
    const savedRTE = localStorage.getItem("rteContent");
    return savedRTE !== null ? savedRTE : "";
  });

  // Sync RTE to localStorage
  useEffect(() => {
    localStorage.setItem("rteContent", rteContent);
  }, [rteContent]);

  // Initialize Quill RTE with full toolbar
  useEffect(() => {
    if (
      quillContainerRef.current &&
      !quillInstanceRef.current &&
      viewMode === "text"
    ) {
      const toolbarOptions = [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ["link", "image", "video"],
        ["clean"],
      ];
      const quill = new Quill(quillContainerRef.current, {
        modules: {
          toolbar: toolbarOptions,
        },
        theme: "snow",
        placeholder: "Start writing...",
      });
      quillInstanceRef.current = quill;
      new QuillMarkdown(quill, {});
      // Set initial content
      if (rteContent) {
        quill.clipboard.dangerouslyPasteHTML(rteContent);
      }
      quill.on("text-change", () => {
        setRteContent(quill.root.innerHTML);
      });
    }
    // Cleanup: destroy Quill instance and clear container when leaving text mode
    return () => {
      if (quillInstanceRef.current && viewMode !== "text") {
        quillInstanceRef.current = null;
        if (quillContainerRef.current) {
          quillContainerRef.current.innerHTML = "";
        }
      }
    };
  }, [viewMode]);

  return (
    <>
      {viewMode === "excalidraw" ? <ExcalidrawPage /> : null}
      {viewMode === "text" ? (
        <div className="rte-editor-container">
          <div ref={quillContainerRef} style={{ minHeight: 300 }} />
        </div>
      ) : null}
    </>
  );
};

export default App;
