import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Header from "./Header";
import Sidebar from "./sidebar";
import { useState, useEffect } from "react";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>,
);

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
