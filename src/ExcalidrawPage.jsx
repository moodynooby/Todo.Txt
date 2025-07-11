import React from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';

const ExcalidrawPage = () => {
  return (
    <div style={{ height: '95vh', width: '98vw' }}>
      <Excalidraw />
    </div>
  );
};

export default ExcalidrawPage;
