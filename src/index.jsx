import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AppHeader from "./AppHeader";
import { useState, useEffect } from "react";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>,
);

// Register service worker
if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope,
        );

        // Check for updates when the page loads
        registration
          .update()
          .then(() => {
            console.log("ServiceWorker update check completed");
          })
          .catch((error) => {
            console.error("ServiceWorker update check failed:", error);
          });
      })
      .catch((error) => {
        console.error("ServiceWorker registration failed: ", error);
      });
  });
}

function RootComponent() {
  const [viewMode, setViewMode] = useState(() => {
    try {
      const savedMode = localStorage.getItem("viewMode");
      return savedMode ? savedMode : "both";
    } catch (error) {
      console.error("Error loading view mode from local storage:", error);
      return "both";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("viewMode", viewMode);
    } catch (error) {
      console.error("Error saving view mode to local storage:", error);
    }
  }, [viewMode]);

  return (
    <>
      <AppHeader viewMode={viewMode} setViewMode={setViewMode} />
      <App viewMode={viewMode} />
    </>
  );
}
