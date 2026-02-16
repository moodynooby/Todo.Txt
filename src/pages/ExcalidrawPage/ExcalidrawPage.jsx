import { useState, useEffect, useMemo } from "react";
import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import "./ExcalidrawPage.css";
import "@excalidraw/excalidraw/index.css";
import FullscreenIcon, { toggleFullscreen } from "../../utils/fullscreen.jsx";
import { useTheme } from "../../contexts/ThemeContext";
import debounce from "lodash.debounce";

const STORAGE_KEY = "excalidraw-data";

const ExcalidrawPage = () => {
  const { isDark } = useTheme();
  const [excalidrawTheme, setExcalidrawTheme] = useState("light");
  const UIOptions = {
    canvasActions: {
      export: false,
      toggleTheme: false,
    },
    welcomeScreen: false,
  };
  useEffect(() => {
    setExcalidrawTheme(isDark ? "dark" : "light");
  }, [isDark]);

  const onSave = useMemo(
    () =>
      debounce((elements, appState) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ elements, appState }));
      }, 1000),
    [],
  );

  useEffect(() => {
    return () => {
      onSave.cancel();
    };
  }, [onSave]);

  const initialData = useMemo(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsedData = JSON.parse(data);
        if (parsedData.appState) {
          if (!parsedData.appState.collaborators) {
            parsedData.appState.collaborators = [];
          } else if (!Array.isArray(parsedData.appState.collaborators)) {
            parsedData.appState.collaborators = Object.values(
              parsedData.appState.collaborators,
            );
          }
        } else {
          parsedData.appState = { collaborators: [] };
        }
        return {
          ...parsedData,
          appState: { ...parsedData.appState, zenModeEnabled: true },
          scrollToContent: true,
        };
      }
    } catch {
      // Silent fail - use default empty canvas
    }
    return { appState: { zenModeEnabled: true }, scrollToContent: true };
  }, []);

  return (
    <div
      style={{ height: "calc(100vh - 80px)", width: "90vw", marginTop: "70px" }}
      className="ExcalidrawPage"
    >
      <Excalidraw
        theme={excalidrawTheme}
        UIOptions={UIOptions}
        onChange={onSave}
        initialData={initialData}
      >
        <MainMenu>
          <MainMenu.DefaultItems.LoadScene />
          <MainMenu.DefaultItems.SearchMenu />
          <MainMenu.DefaultItems.ClearCanvas />
          <MainMenu.DefaultItems.SaveAsImage />
          <MainMenu.Item onClick={toggleFullscreen}>
            <FullscreenIcon />
            Fullscreen
          </MainMenu.Item>
        </MainMenu>
      </Excalidraw>
    </div>
  );
};

export default ExcalidrawPage;
