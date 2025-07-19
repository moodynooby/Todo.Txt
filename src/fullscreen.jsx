import { useState, useEffect } from "react";
import { Maximize, Minimize } from "lucide-react";
const toggleFullscreen = ({ element = document.documentElement }) => {
  if (!document.fullscreenElement) {
    element.requestFullscreen().catch((err) => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`);
    });
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
};
function FullscreenIcon() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const savedMode = localStorage.getItem("viewMode");
  const [viewMode, setViewMode] = useState(savedMode);

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
    <>
      {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />
      }
    </>
  );
}
export default FullscreenIcon;
export { toggleFullscreen };

// You can use it in two ways:

// For the whole page (default):
// jsx
// <Fullscreen />
// For a specific element:
// jsx
// <div ref={myRef}>Content to make fullscreen</div>
// <Fullscreen element={myRef.current} />
