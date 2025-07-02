// Export.jsx
import React from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkDocx from 'remark-docx';
import { saveAs } from 'file-saver';
import ReactDOMServer from 'react-dom/server';
import { useState, useEffect } from "react";


const Export = ({ markdownContent, fileName }) => {
  const [htmlContent, setHtmlContent] = useState(() => {
    const savedMD = localStorage.getItem("htmlContent");
    return savedMD !== null ? savedMD : "Start Writing";
  });

  const handleDOCX = async () => {
    try {
      // Get the latest markdown content
      const currentContent = markdownContent;
      const processor = unified().use(remarkParse).use(remarkDocx, { output: 'blob' });
      const doc = await processor.process(currentContent);
      const blob = await doc.result;
      saveAs(blob, `${fileName || 'document'}.docx`);
    } catch (error) {
      console.error('Error exporting DOCX:', error);
      alert('Failed to export DOCX. Please check the console for details.');
    }
  };

  const handleMD = async () => {
    try {
      // Get the latest markdown content and create blob
      const currentContent = markdownContent;
      const blob = new Blob([currentContent], { type: 'text/markdown' });
      saveAs(blob, `${fileName || 'document'}.md`);
    } catch (error) {
      console.error('Error exporting Markdown:', error);
      alert('Failed to export Markdown. Please check the console for details.');
    }
  };
  const handleHTML = async () => {
    try {
      // Get the latest markdown content and create blob
      const currentContent = htmlContent;
      const blob = new Blob([currentContent], { type: 'text/html' });
      saveAs(blob, `${fileName || 'document'}.htm`);
    } catch (error) {
      console.error('Error exporting HTML:', error);
      alert('Failed to export HTML. Please check the console for details.');
    }

  };

  return (
    <>
      <li><a onClick={handleDOCX}>Export As DocX</a></li>
      <li><a onClick={handleMD}>Export As Text</a></li>
      <li><a onClick={handleHTML}>Export As HTML</a></li>
    </>
  );
};

export default Export;