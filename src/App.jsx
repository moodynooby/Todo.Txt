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
import UpdateToast from "./UpdateToast"; // Import the toast component

const App = ({ viewMode }) => {
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

  // State for update toast visibility
  const [showUpdateToast, setShowUpdateToast] = useState(false);

  // Effect for Service Worker registration and update detection
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const swUrl = `/sw.js`; // Path to your service worker file in the output directory

      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);

          // Listen for a new service worker installing
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New worker is installed and a controller exists,
                  // but it might not have taken control yet if skipWaiting wasn't called
                  // or if this is the very first SW activation.
                  // For a simpler "reload to update" UX after skipWaiting,
                  // we primarily rely on 'controllerchange'.
                  console.log('New service worker installed.');
                }
              });
            }
          });
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });

      // Listen for when a new service worker has taken control
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('New Service Worker has taken control. Showing update toast.');
        setShowUpdateToast(true);
      });
    }
  }, []);

  const handleUpdate = () => {
    setShowUpdateToast(false);
    window.location.reload();
  };

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
      {showUpdateToast && <UpdateToast onUpdate={handleUpdate} />}
    </div>
  );
};

export default App;
