
import "./App.css";
import { useState, useEffect, useRef, useMemo } from "react";
import ExcalidrawPage from "./pages/ExcalidrawPage/ExcalidrawPage";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import QuillMarkdown from "quilljs-markdown";
import "quilljs-markdown/dist/quilljs-markdown-common-style.css";
import Sidebar from "./components/Sidebar/Sidebar";
import WelcomeScreen from "./pages/WelcomeScreen/WelcomeScreen";
import AppHeader from "./components/AppHeader/AppHeader";
import { useTheme } from "./contexts/ThemeContext";

const parseTodoContent = (content) => {
  if (!content) return { tasks: [], priorities: {}, projects: {}, contexts: {} };
  
  const text = content.replace(/<[^>]*>/g, '\n');
  const lines = text.split('\n').filter(line => line.trim());
  
  const tasks = [];
  const priorities = { A: [], B: [], C: [] };
  const projects = {};
  const contexts = {};
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    const task = { id: index, text: trimmed, raw: line };
    
    const priorityMatch = trimmed.match(/^([A-Z])\s/);
    if (priorityMatch) {
      task.priority = priorityMatch[1];
      if (priorities[task.priority]) {
        priorities[task.priority].push(task);
      }
    }
    
    const projectMatches = trimmed.match(/\+[\w-]+/g);
    if (projectMatches) {
      task.projects = projectMatches.map(p => p.slice(1));
      task.projects.forEach(p => {
        projects[p] = (projects[p] || []).concat(task);
      });
    }
    
    const contextMatches = trimmed.match(/@[\w-]+/g);
    if (contextMatches) {
      task.contexts = contextMatches.map(c => c.slice(1));
      task.contexts.forEach(c => {
        contexts[c] = (contexts[c] || []).concat(task);
      });
    }
    
    tasks.push(task);
  });
  
  return { tasks, priorities, projects, contexts };
};

const App = ({ viewMode, setViewMode, onAddTimer }) => {
  const { isDark } = useTheme();
  const quillContainerRef = useRef(null);
  const quillInstanceRef = useRef(null);
  const fileInputRef = useRef(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeFilter, setActiveFilter] = useState(null);

  const [rteContent, setRteContent] = useState(() => {
    try {
      return localStorage.getItem("rteContent") || "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      try {
        localStorage.setItem("rteContent", rteContent);
      } catch {
        // Silent fail
      }
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [rteContent]);

  useEffect(() => {
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
        quill.on("text-change", () => {
          setRteContent(quill.root.innerHTML);
          setShowWelcome(false);
        });
      }
    }
    return () => {
      if ((viewMode !== "text" || activeFilter) && quillInstanceRef.current) {
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

  const taskData = useMemo(() => parseTodoContent(rteContent), [rteContent]);

  const handleNewFile = () => {
    setRteContent("");
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
      setRteContent(content.split('\n').map(line => `<p>${line}</p>`).join(''));
      setShowWelcome(false);
    };
    reader.readAsText(file);
  };

  const handleSaveAsMd = () => {
    let markdownContent = rteContent;

    // Convert HTML to Markdown
    // Headings
    markdownContent = markdownContent.replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n');
    markdownContent = markdownContent.replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n');
    markdownContent = markdownContent.replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n');

    // Bold, Italic, Strikethrough, Underline (Quill might use span with style for underline/strikethrough)
    markdownContent = markdownContent.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
    markdownContent = markdownContent.replace(/<em>(.*?)<\/em>/g, '*$1*');
    markdownContent = markdownContent.replace(/<s>(.*?)<\/s>/g, '~~$1~~'); // Strikethrough
    markdownContent = markdownContent.replace(/<u>(.*?)<\/u>/g, '$1'); // Underline is not standard Markdown, remove tag

    // Links
    markdownContent = markdownContent.replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)');

    // Lists
    // Ordered List
    markdownContent = markdownContent.replace(/<ol>(.*?)<\/ol>/gs, (match, listHtml) => {
        let listItemMarkdown = '';
        let counter = 1;
        listHtml.replace(/<li>(.*?)<\/li>/gs, (liMatch, liContent) => {
            listItemMarkdown += `${counter++}. ${liContent.trim()}\n`;
        });
        return listItemMarkdown + '\n';
    });
    // Unordered List
    markdownContent = markdownContent.replace(/<ul>(.*?)<\/ul>/gs, (match, listHtml) => {
        let listItemMarkdown = '';
        listHtml.replace(/<li>(.*?)<\/li>/gs, (liMatch, liContent) => {
            listItemMarkdown += `- ${liContent.trim()}\n`;
        });
        return listItemMarkdown + '\n';
    });
    
    // Blockquote
    markdownContent = markdownContent.replace(/<blockquote>(.*?)<\/blockquote>/gs, (match, quoteContent) => {
        return quoteContent.split('\n').map(line => `> ${line.trim()}`).join('\n') + '\n\n';
    });

    // Code Block
    markdownContent = markdownContent.replace(/<pre><code>(.*?)<\/code><\/pre>/gs, '```\n$1\n```\n\n');

    // Paragraphs and line breaks
    markdownContent = markdownContent.replace(/<p>(.*?)<\/p>/g, '$1\n\n');
    markdownContent = markdownContent.replace(/<br>/g, '\n');

    // Clean up multiple newlines
    markdownContent = markdownContent.replace(/\n\n+/g, '\n\n').trim();

    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "todo.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveAsTxt = () => {
    const textContent = quillInstanceRef.current ? quillInstanceRef.current.getText() : rteContent.replace(/<[^>]*>/g, '');
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "todo.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveAsHtml = () => {
    const blob = new Blob([rteContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "todo.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAiTools = () => {
    // Basic AI Tool: Auto-format todos (e.g. ensure space after priority)
    const formatted = rteContent.replace(/([A-Z])(?=[^\s])/g, "$1 ");
    setRteContent(formatted);
    if (quillInstanceRef.current) {
      quillInstanceRef.current.clipboard.dangerouslyPasteHTML(formatted);
    }
  };

  const filteredTasks = useMemo(() => {
    if (!activeFilter) return [];
    const { type, value } = activeFilter;
    return taskData.tasks.filter(task => {
      if (type === 'priority') return task.priority === value;
      if (type === 'project') return task.projects?.includes(value);
      if (type === 'context') return task.contexts?.includes(value);
      return true;
    });
  }, [activeFilter, taskData]);

  return (
    <>
      <AppHeader 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        onAddTimer={onAddTimer}
        onOpenRepo={handleOpenRepo}
        onSaveAsMd={handleSaveAsMd}
        onSaveAsTxt={handleSaveAsTxt}
        onSaveAsHtml={handleSaveAsHtml}
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
          marginLeft: sidebarCollapsed ? "60px" : "280px",
          marginTop: "48px",
          marginBottom: "28px",
          transition: "margin-left 0.2s ease",
          minHeight: "calc(100vh - 76px)",
        }}
      >
        {viewMode === "excalidraw" && <ExcalidrawPage />}
        {viewMode === "text" && (
          <div className="rte-editor-container">
            {showWelcome && !rteContent ? (
              <WelcomeScreen
                onNewFile={handleNewFile}
                onOpenRepo={handleOpenRepo}
              />
            ) : activeFilter ? (
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
