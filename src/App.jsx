import './App.scss';
import React from 'react';
import 'github-markdown-css/github-markdown.css'
import Markdown from 'react-markdown'
import { useState, useEffect } from "react";

const App = () => {

  const [md, setMD] = useState(() => {
    const savedMD = localStorage.getItem('markdownContent');
    return savedMD !== null ? savedMD : "";
  });

  useEffect(() => {
    localStorage.setItem('markdownContent', md);
  }, [md]);

  const handleMDChange = (e) => {
    setMD(e.target.value);
  }
    return (
    <div className="unified-editor markdown-body">
      <textarea
        className="textarea"
        placeholder="Start Writing"
        value={md}
        onChange={handleMDChange}
        autoFocus
      ></textarea>
      <Markdown>{md}</Markdown>
    </div>
  );
};

export default App;
