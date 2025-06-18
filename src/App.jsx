import './App.css';
import React from 'react';
import Markdown from 'react-markdown'
import { useState } from "react";

const App = () => {
  const [md, setMD] = useState("");
    return (
    <div className="content">
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
