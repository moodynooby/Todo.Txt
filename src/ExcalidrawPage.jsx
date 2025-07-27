import React, { useState, useEffect, useCallback } from "react";
import { Excalidraw, MainMenu } from "@excalidraw/excalidraw";
import "./ExcalidrawPage.scss";
import "@excalidraw/excalidraw/index.css";
import FullscreenIcon, { toggleFullscreen } from "./fullscreen";
import Theme from "./theme";
const STORAGE_KEY = "excalidraw-data";

const ExcalidrawPage = () => {
  const [excalidrawTheme, setExcalidrawTheme] = useState("light");
  const UIOptions = {
    canvasActions: {
      export: false,
      toggleTheme: false,
    },
    welcomeScreen: false,
  };
  useEffect(() => {
    const getAppTheme = () => {
      const currentDataTheme =
        document.documentElement.getAttribute("data-theme");
      // As per theme.jsx: darkTheme = "dark", lightTheme = "emerald"
      // Excalidraw expects 'light' or 'dark'
      return currentDataTheme === "dark" ? "dark" : "light";
    };

    setExcalidrawTheme(getAppTheme()); // Set initial theme

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-theme"
        ) {
          setExcalidrawTheme(getAppTheme());
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  const onSave = useCallback((elements, appState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ elements, appState }));
  }, []);

  const onLoad = useCallback(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsedData = JSON.parse(data);
        // Ensure appState.collaborators is an array to prevent forEach error
        if (parsedData.appState) {
          if (!parsedData.appState.collaborators) {
            parsedData.appState.collaborators = [];
          } else if (!Array.isArray(parsedData.appState.collaborators)) {
            // If collaborators exists but is not an array, convert it to an array
            parsedData.appState.collaborators = Object.values(
              parsedData.appState.collaborators,
            );
          }
        } else {
          // If appState itself is missing, initialize it with an empty collaborators array
          parsedData.appState = { collaborators: [] };
        }
        return parsedData;
      }
    } catch (e) {
      console.error("Failed to load Excalidraw data from local storage", e);
    }
    return null;
  }, []);

  return (
    <div style={{ height: "95vh", width: "99vw" }} className="ExcalidrawPage">
      <Excalidraw
        theme={excalidrawTheme}
        UIOptions={UIOptions}
        onChange={onSave}
        initialData={{
          ...onLoad(),
          appState: { zenModeEnabled: true },
          scrollToContent: true,
        }}
        renderTopRightUI={() => (
          <>
            <Theme />
          </>
        )}
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
