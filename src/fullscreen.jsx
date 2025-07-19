import { useState, useEffect } from "react";
import { Maximize, Minimize } from "lucide-react";
import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";

function Fullscreen({ element = document.documentElement }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const savedMode = localStorage.getItem("viewMode");
  const [viewMode, setViewMode] = useState(savedMode);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      element.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <MainMenu.Item onClick={toggleFullscreen} className="btn btn-sm btn-ghost">
      {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
      {viewMode === "excalidraw" ? "Fullscreen" : ""}
    </MainMenu.Item>
  );
}

export default Fullscreen;

// You can use it in two ways:

// For the whole page (default):
// jsx
// <Fullscreen />
// For a specific element:
// jsx
// <div ref={myRef}>Content to make fullscreen</div>
// <Fullscreen element={myRef.current} />
