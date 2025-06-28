import "./App.scss";
import React from "react";
import "github-markdown-css/github-markdown.css";
import Markdown from "react-markdown";
import { useState, useEffect } from "react";
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import fediverseUser from 'remark-fediverse-user';
import emoji from 'remark-emoji';
import remarkCodeTitles from "remark-flexible-code-titles";


const App = ({ viewMode }) => {
  const [md, setMD] = useState(() => {
    const savedMD = localStorage.getItem("markdownContent");
    return savedMD !== null ? savedMD : "Start Writing";
  });

  useEffect(() => {
    localStorage.setItem("markdownContent", md);
  }, [md]);

  const handleMDChange = (e) => {
    setMD(e.target.value);
  };
const MarkdownComponent = () => {
  return (
    <div>
      <Markdown remarkPlugins={[remarkGfm ,remarkBreaks ,fediverseUser , emoji, remarkCodeTitles]}>{md}</Markdown>
    </div>
  );
};
  return (
    <div className="unified-editor markdown-body">
      <div style={{ position: 'relative', display: 'inline-block' }}>
      </div>
      {(viewMode === "text" ) ? (
        <textarea
          className="textarea"
          placeholder="Start Writing"
          value={md}
          onChange={handleMDChange}
          autoFocus
        ></textarea>
      ) : null}

  {(viewMode === "both") ? (
      <>
        <div className="unified-txt">
      <h2>Text </h2>
      <textarea
          className="textarea unified-txt"
          placeholder="Start Writing"
          value={md}
          onChange={handleMDChange}
          autoFocus
        ></textarea>
        </div>
        <div className="unified-md">           <h2>Markdown </h2>
<MarkdownComponent/>
</div>
</>
      ) : null}
      {viewMode === "markdown"  ? (
        <div className="md">             <MarkdownComponent />
</div>
      ) : null}
    </div>
  );
};

export default App;
