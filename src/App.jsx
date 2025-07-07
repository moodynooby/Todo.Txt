import "./App.scss";
import React from "react";
import "github-markdown-css/github-markdown.css";
import Markdown from "react-markdown";
import { useState, useEffect } from "react";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import fediverseUser from "remark-fediverse-user";
import emoji from "remark-emoji";
import remarkCodeTitles from "remark-flexible-code-titles";

const App = ({ viewMode }) => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[SW] Registered:", reg);

          // reg.onupdatefound = () => {
          //   const newWorker = reg.installing;
          //   newWorker.onstatechange = () => {
          //     if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          //       alert('🆕 New version available! Refresh to update.');
          //     }
          //   };
          // };
        })
        .catch((err) => {
          console.error("[SW] Registration failed:", err);
        });
    });
  }
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      // new Notification("📌 Reminder!", {
      //   body: "Don't forget to finish your T0do.TxT!",
      //   icon: "/assets/icon192.png",
      // });
    }
  });

  const [md, setMD] = useState(() => {
    const savedMD = localStorage.getItem("markdownContent");
    return savedMD !== null ? savedMD : "Start Writing";
  });
  const [htmlContent, setHtmlContent] = useState(() => {
    const myDiv = document.getElementsByClassName(".md");
    const htmlContent = myDiv.innerHTML;
    const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${"document"}</title>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `;
    return fullHtml;
  });
  useEffect(() => {
    localStorage.setItem("markdownContent", md);
  }, [md]);
  useEffect(() => {
    localStorage.setItem("htmlContent", htmlContent);
  }, [htmlContent]);
  const handleMDChange = (e) => {
    setMD(e.target.value);
  };
  const MarkdownComponent = () => {
    return (
      <div>
        <Markdown
          remarkPlugins={[
            remarkGfm,
            remarkBreaks,
            fediverseUser,
            emoji,
            remarkCodeTitles,
          ]}
        >
          {md}
        </Markdown>
      </div>
    );
  };
  return (
    <div className="unified-editor markdown-body">
      <div style={{ position: "relative", display: "inline-block" }}></div>
      {viewMode === "text" ? (
        <textarea
          className="textarea"
          placeholder="Start Writing"
          value={md}
          onChange={handleMDChange}
          autoFocus
        ></textarea>
      ) : null}

      {viewMode === "both" ? (
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
          <div className="unified-md">
            {" "}
            <h2>Markdown </h2>
            <MarkdownComponent />
          </div>
        </>
      ) : null}
      {viewMode === "markdown" ? (
        <div className="md">
          {" "}
          <MarkdownComponent />
        </div>
      ) : null}
    </div>
  );
};

export default App;
