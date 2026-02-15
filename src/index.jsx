import ReactDOM from "react-dom/client";
import App from "./App";
import AppHeader from "./AppHeader";
import { useState, useEffect } from "react";
import Timer from "./Timer";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <RootComponent />,
);

// Register service worker
if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        registration.update().catch((error) => {
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
      return localStorage.getItem("viewMode") || "text";
    } catch {
      return "text";
    }
  });

  const [timers, setTimers] = useState([]);

  const addTimer = () => {
    setTimers([...timers, { id: Date.now() }]);
  };

  const removeTimer = (id) => {
    setTimers(timers.filter((t) => t.id !== id));
  };

  useEffect(() => {
    try {
      localStorage.setItem("viewMode", viewMode);
    } catch {
      // Silent fail for localStorage unavailability
    }
  }, [viewMode]);

  return (
    <>
      <AppHeader viewMode={viewMode} setViewMode={setViewMode} onAddTimer={addTimer} />
      <App viewMode={viewMode} />
      {timers.map((timer) => (
        <Timer key={timer.id} id={timer.id} onRemove={removeTimer} />
      ))}
    </>
  );
}
