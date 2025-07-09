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
      <UpdateToast />
    </>
  );
}

// Service Worker Update Toast
function UpdateToast() {
  const [showToast, setShowToast] = useState(false);
  const [serviceWorkerRegistration, setServiceWorkerRegistration] = useState(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js") // Assuming sw.js is at the root of the output
        .then((registration) => {
          console.log("Service Worker registered with scope:", registration.scope);
          setServiceWorkerRegistration(registration);

          // Check for updates
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === "installed") {
                  if (navigator.serviceWorker.controller) {
                    // At this point, the old content will have been purged and
                    // the new content will have been added to the cache.
                    // It's the perfect time to display a "New content is
                    // available; please refresh." message in your web app.
                    console.log("New content is available and will be used when all tabs for this scope are closed.");
                    setShowToast(true); // Show update toast
                  } else {
                    // At this point, everything has been precached.
                    // It's the perfect time to display a
                    // "Content is cached for offline use." message.
                    console.log("Content is cached for offline use.");
                  }
                }
              };
            }
          };
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });

      // Listen for controller change - new SW has taken over.
      navigator.serviceWorker.oncontrollerchange = () => {
        console.log("New service worker has taken control.");
        window.location.reload(); // Reload the page to use the new service worker
      };
    }
  }, []);

  const handleUpdate = () => {
    if (serviceWorkerRegistration && serviceWorkerRegistration.waiting) {
      serviceWorkerRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
      // The page will reload via the 'controllerchange' event listener above once the new SW activates.
      setShowToast(false);
    }
  };

  if (!showToast) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "1em",
        background: "#333",
        color: "white",
        borderRadius: "5px",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      A new version is available!
      <button
        onClick={handleUpdate}
        style={{
          padding: "0.5em 1em",
          background: "#2EC6FE",
          color: "white",
          border: "none",
          borderRadius: "3px",
          cursor: "pointer",
        }}
      >
        Update
      </button>
      <button
        onClick={() => setShowToast(false)}
        style={{
          padding: "0.5em 1em",
          background: "grey",
          color: "white",
          border: "none",
          borderRadius: "3px",
          cursor: "pointer",
        }}
      >
        Dismiss
      </button>
    </div>
  );
}
