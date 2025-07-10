import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Header from "./Header";
import Sidebar from "./Sidebar.jsx";
import { useState, useEffect } from "react";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>,
);

if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope,
        );
      })
      .catch((error) => {
        console.log("ServiceWorker registration failed: ", error);
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
      <Header viewMode={viewMode} setViewMode={setViewMode} />
      <Sidebar viewMode={viewMode} setViewMode={setViewMode} />
      <App viewMode={viewMode} />
    </>
  );
}
