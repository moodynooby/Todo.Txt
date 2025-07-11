import React, { useState, useEffect } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';

const ExcalidrawPage = () => {
  const [excalidrawTheme, setExcalidrawTheme] = useState('light');

  useEffect(() => {
    const getAppTheme = () => {
      const currentDataTheme = document.documentElement.getAttribute('data-theme');
      // As per theme.jsx: darkTheme = "dark", lightTheme = "emerald"
      // Excalidraw expects 'light' or 'dark'
      return currentDataTheme === 'dark' ? 'dark' : 'light';
    };

    setExcalidrawTheme(getAppTheme()); // Set initial theme

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          setExcalidrawTheme(getAppTheme());
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Excalidraw theme={excalidrawTheme} />
    </div>
  );
};

export default ExcalidrawPage;
