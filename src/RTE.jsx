import "../public/richtexteditor/rte_theme_default.css";
import { useEffect, useRef } from "react";

function RTE() {
  const editorRef = useRef(null);
  const editorInstance = useRef(null);

  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "/richtexteditor/rte.js";
    script1.async = true;

    const script2 = document.createElement("script");
    script2.src = "/richtexteditor/plugins/all_plugins.js";
    script2.async = true;

    script1.onload = () => {
      script2.onload = () => {
        if (window.RichTextEditor && editorRef.current) {
          editorInstance.current = new window.RichTextEditor(editorRef.current);
          editorInstance.current.setHTMLCode("Hello World! (BETA DO NOT USE)");
        }
      };
      document.body.appendChild(script2);
    };

    document.body.appendChild(script1);

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
      }
      document.body.removeChild(script1);
      if (script2.parentNode) {
        document.body.removeChild(script2);
      }
    };
  }, []);

  return <div ref={editorRef}></div>;
}

export default RTE;
