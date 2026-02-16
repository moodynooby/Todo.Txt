import { saveAs } from 'file-saver';
import TurndownService from 'turndown';

// Initialize Turndown service with custom options
const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  fence: '```',
  emDelimiter: '*',
  strongDelimiter: '**',
  linkStyle: 'inlined'
});

// Custom rules for better conversion
turndownService.addRule('strikethrough', {
  filter: ['s', 'del'],
  replacement: content => `~~${content}~~`
});

turndownService.addRule('underline', {
  filter: ['u'],
  replacement: content => content // Remove underline as it's not standard markdown
});

/**
 * Downloads content as a file with proper MIME type
 * @param {string} content - The content to save
 * @param {string} filename - The filename with extension
 * @param {string} mimeType - The MIME type of the file
 */
export const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  saveAs(blob, filename);
};

/**
 * Converts HTML content to Markdown
 * @param {string} htmlContent - HTML content to convert
 * @returns {string} - Converted Markdown content
 */
export const htmlToMarkdown = (htmlContent) => {
  return turndownService.turndown(htmlContent);
};

/**
 * Save format configuration
 */
const SAVE_FORMATS = {
  markdown: {
    filename: 'todo.md',
    mimeType: 'text/markdown',
    transform: (content) => htmlToMarkdown(content)
  },
  text: {
    filename: 'todo.txt',
    mimeType: 'text/plain',
    transform: (content) => content
  },
  html: {
    filename: 'todo.html',
    mimeType: 'text/html',
    transform: (content) => content
  }
};

/**
 * Generic save function for different formats
 * @param {string} content - Content to save
 * @param {string} format - Format type ('markdown', 'text', 'html')
 * @param {string} customFilename - Optional custom filename
 */
export const saveToFile = (content, format = 'text', customFilename = null) => {
  const config = SAVE_FORMATS[format];
  if (!config) {
    console.warn(`Unknown save format: ${format}`);
    return;
  }
  
  const filename = customFilename || config.filename;
  const transformedContent = config.transform(content);
  downloadFile(transformedContent, filename, config.mimeType);
};

/**
 * Saves content as Markdown file
 * @param {string} htmlContent - HTML content to convert and save
 * @param {string} filename - Optional custom filename
 */
export const saveAsMarkdown = (htmlContent, filename = null) => {
  saveToFile(htmlContent, 'markdown', filename);
};

/**
 * Saves content as plain text file
 * @param {string} textContent - Plain text content to save
 * @param {string} filename - Optional custom filename
 */
export const saveAsText = (textContent, filename = null) => {
  saveToFile(textContent, 'text', filename);
};

/**
 * Saves content as HTML file
 * @param {string} htmlContent - HTML content to save
 * @param {string} filename - Optional custom filename
 */
export const saveAsHtml = (htmlContent, filename = null) => {
  saveToFile(htmlContent, 'html', filename);
};
