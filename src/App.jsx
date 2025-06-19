import './App.scss';
import React from 'react';
import 'github-markdown-css/github-markdown.css'
import Markdown from 'react-markdown'
import { useState } from "react";

const App = () => {
  const [md, setMD] = useState("");
    return (
    <div className="unified-editor markdown-body">
      <textarea
        className="textarea"
        placeholder="Start Writing"
        value={md}
        onChange={(e) => setMD(e.target.value)}
      ></textarea>
      <Markdown>{md}</Markdown>
    </div>
  );
};

export default App;
