
import "./App.css";
import { useState, useEffect, useRef, useMemo, useCallback, lazy, Suspense } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import QuillMarkdown from "quilljs-markdown";
import "quilljs-markdown/dist/quilljs-markdown-common-style.css";
import Sidebar from "./components/Sidebar/Sidebar";
import WelcomeScreen from "./pages/WelcomeScreen/WelcomeScreen";
import AppHeader from "./components/AppHeader/AppHeader";
import { useTheme } from "./contexts/ThemeContext";
import { saveAsMarkdown, saveAsText, saveAsHtml } from "./utils/fileSaveUtils";
import { parseTodoContent } from "./utils/todoParser";
import { applyFilter } from "./utils/filterUtils";
import { useLocalStorage } from "./hooks/useLocalStorage";

// Layout constants
const SIDEBAR_EXPANDED_WIDTH = 280;
const SIDEBAR_COLLAPSED_WIDTH = 60;
const HEADER_HEIGHT = 48;
const FOOTER_HEIGHT = 28;
const DEBOUNCE_DELAY = 1000;
const TRANSITION_DURATION = '0.2s';
const TRANSITION_TIMING = 'ease';

const stripHtml = (html, replacement = '') => html?.replace(/<[^>]*>/g, replacement) || '';

// Lazy load ExcalidrawPage for code splitting
const ExcalidrawPage = lazy(() => import("./pages/ExcalidrawPage/ExcalidrawPage"));

const App = ({ viewMode, setViewMode, onAddTimer }) => {
  const { isDark } = useTheme();
  const quillContainerRef = useRef(null);
  const quillInstanceRef = useRef(null);
  const fileInputRef = useRef(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeFilter, setActiveFilter] = useState(null);

  const [rteContent, setRteContentState] = useLocalStorage("rteContent", "");
  const [debouncedRteContent, setDebouncedRteContent] = useState(rteContent);

  // Debounce saving to localStorage and parsing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedRteContent(rteContent);
      setRteContentState(rteContent);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [rteContent, setRteContentState]);

  useEffect(() => {
    const handleTextChange = () => {
      if (quillInstanceRef.current) {
        setRteContent(quillInstanceRef.current.root.innerHTML);
        setShowWelcome(false);
      }
    };

    if (
      quillContainerRef.current &&
      viewMode === "text" &&
      !activeFilter
    ) {
      if (!quillInstanceRef.current) {
        const toolbarOptions = [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block"],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ direction: "rtl" }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
          ["link", "image", "video"],
          ["clean"],
        ];
        const quill = new Quill(quillContainerRef.current, {
          modules: {
            toolbar: toolbarOptions,
          },
          theme: "snow",
          placeholder: "Start writing your todos...",
        });
        quillInstanceRef.current = quill;
        new QuillMarkdown(quill, {});
        if (rteContent) {
          quill.clipboard.dangerouslyPasteHTML(rteContent);
        }
        quill.on("text-change", handleTextChange);
      }
    }
    return () => {
      if (quillInstanceRef.current && (viewMode !== "text" || activeFilter)) {
        quillInstanceRef.current.off("text-change", handleTextChange);
        if (typeof quillInstanceRef.current.destroy === 'function') {
          quillInstanceRef.current.destroy();
        }
        quillInstanceRef.current = null;
        if (quillContainerRef.current) {
          quillContainerRef.current.innerHTML = "";
          const toolbar = quillContainerRef.current.previousElementSibling;
          if (toolbar?.classList?.contains('ql-toolbar')) {
            toolbar.remove();
          }
        }
      }
    };
  }, [viewMode, activeFilter, showWelcome]);

  const taskData = useMemo(() => parseTodoContent(debouncedRteContent), [debouncedRteContent]);

  const handleSave = useCallback((type) => {
    const saveActions = {
      markdown: () => saveAsMarkdown(rteContent),
      text: () => saveAsText(quillInstanceRef.current?.getText() || stripHtml(rteContent, '')),
      html: () => saveAsHtml(rteContent)
    };
    
    saveActions[type]?.() || console.warn('Unknown save type:', type);
  }, [rteContent]);

  useEffect(() => {
    const keyActions = {
      m: () => handleSave('markdown'),
      t: () => handleSave('text'),
      h: () => handleSave('html')
    };

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
        const key = e.key.toLowerCase();
        if (keyActions[key]) {
          e.preventDefault();
          keyActions[key]();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  const handleNewFile = () => {
    setRteContentState("");
    setShowWelcome(false);
  };

  const handleOpenRepo = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setRteContentState(content.split('\n').map(line => `<p>${line}</p>`).join(''));
      setShowWelcome(false);
    };
    reader.readAsText(file);
  };

  const handleAiTools = () => {
    const formatted = rteContent.replace(/([A-Z])(?=[^\s])/g, "$1 ");
    setRteContentState(formatted);
    quillInstanceRef.current?.clipboard.dangerouslyPasteHTML(formatted);
  };

  const filteredTasks = useMemo(() => {
    return applyFilter(taskData.tasks, activeFilter);
  }, [activeFilter, taskData]);

  // Memoized filtered view component to prevent unnecessary re-renders
  const FilteredView = useMemo(() => {
    return () => (
      <div className="filtered-view p-4">
        <h2 className="text-xl font-bold mb-4">
          Filtered Results: {activeFilter.type === 'priority' ? `Priority ${activeFilter.value}` : activeFilter.value}
        </h2>
        <div className="flex flex-col gap-2">
          {filteredTasks.map(task => (
            <div key={task.id} className="p-2 bg-base-200 rounded border border-base-300">
              {task.raw}
            </div>
          ))}
          {filteredTasks.length === 0 && <p className="italic opacity-50">No tasks match this filter.</p>}
        </div>
        <button 
          className="btn btn-sm btn-outline mt-4"
          onClick={() => setActiveFilter(null)}
        >
          Clear Filter to Edit
        </button>
      </div>
    );
  }, [filteredTasks, activeFilter]);

  return (
    <>
      <AppHeader 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        onAddTimer={onAddTimer}
        onOpenRepo={handleOpenRepo}
        onSave={handleSave}
        onAiTools={handleAiTools}
      />
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept=".txt"
        onChange={handleFileChange}
      />
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        taskData={taskData}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <div
        style={{
          marginLeft: sidebarCollapsed ? `${SIDEBAR_COLLAPSED_WIDTH}px` : `${SIDEBAR_EXPANDED_WIDTH}px`,
          marginTop: `${HEADER_HEIGHT}px`,
          marginBottom: `${FOOTER_HEIGHT}px`,
          transition: `margin-left ${TRANSITION_DURATION} ${TRANSITION_TIMING}`,
          minHeight: `calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT}px)`,
        }}
      >
        {viewMode === "excalidraw" && (
          <Suspense fallback={<div className="p-4">Loading Excalidraw...</div>}>
            <ExcalidrawPage />
          </Suspense>
        )}
        {viewMode === "text" && (
          <div className="rte-editor-container">
            {showWelcome && !rteContent ? (
              <WelcomeScreen
                onNewFile={handleNewFile}
                onOpenRepo={handleOpenRepo}
              />
            ) : activeFilter ? (
              <FilteredView />
            ) : (
              <div 
                ref={quillContainerRef} 
                style={{ minHeight: "70vh" }}
                className={`quill-theme-${isDark ? 'dark' : 'light'}`}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default App;
