// DocxExport.jsx
import React from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkDocx from 'remark-docx';
import { saveAs } from 'file-saver';
import { FileDown } from "lucide-react";

const DocxExport = ({ markdownContent, fileName }) => {
  const handleExport = async () => {
    try {
      const processor = unified().use(remarkParse).use(remarkDocx, { output: 'blob' });
      const doc = await processor.process(markdownContent);
      const blob = await doc.result;
      saveAs(blob, `${fileName || 'document'}.docx`);
    } catch (error) {
      console.error('Error exporting DOCX:', error);
      alert('Failed to export DOCX. Please check the console for details.');
    }
  };

  return (
    <a onClick={handleExport}>            <FileDown size={20} />
</a>

  );
};

export default DocxExport;