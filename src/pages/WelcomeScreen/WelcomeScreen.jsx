import { useState } from "react";
import {
  FilePlus,
  FolderOpen,
  Clock,
  BookOpen,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const WelcomeScreen = ({ onNewFile, onOpenRepo }) => {
  const [hoveredAction, setHoveredAction] = useState(null);

  const quickActions = [
    {
      id: "new-file",
      icon: FilePlus,
      title: "New File",
      description: "Create a new todo.txt file",
      color: "#a9a5ff",
      action: onNewFile,
    },
    {
      id: "open-repo",
      icon: FolderOpen,
      title: "Open Repository",
      description: "Open an existing todo.txt file",
      color: "#4ade80",
      action: onOpenRepo,
    },
    {
      id: "recent",
      icon: Clock,
      title: "Open Recent",
      description: "Continue from where you left off",
      color: "#fbbf24",
      action: () => {},
    },
    {
      id: "help",
      icon: BookOpen,
      title: "Documentation",
      description: "Learn about todo.txt format",
      color: "#f472b6",
      action: () => {},
    },
  ];

  const codePreview = `x 2026-02-16 2026-02-15 Complete UI redesign
(A) Call mom @Personal due:2026-02-17
(B) Review PR #123 @Work
+ groceries @Shopping
Buy milk
Buy eggs
Buy bread
priority:A @Work`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 76px)",
        padding: "2rem",
        color: "var(--color-base-content)",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "3rem",
        }}
      >
        <h1
          style={{
            fontFamily: "'Architects Daughter', cursive",
            fontSize: "2.5rem",
            marginBottom: "0.5rem",
            background: "linear-gradient(135deg, #a9a5ff 0%, #f472b6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Welcome to T0do.Txt
        </h1>
        <p style={{ opacity: 0.7, fontSize: "1rem" }}>
          Your minimalist task management companion
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          maxWidth: "800px",
          width: "100%",
          marginBottom: "3rem",
        }}
      >
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            onMouseEnter={() => setHoveredAction(action.id)}
            onMouseLeave={() => setHoveredAction(null)}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
              padding: "1.25rem",
              backgroundColor: "var(--color-base-200)",
              border: "1px solid #333",
              borderRadius: "12px",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s ease",
              transform: hoveredAction === action.id ? "translateY(-2px)" : "none",
              boxShadow:
                hoveredAction === action.id
                  ? `0 8px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px ${action.color}40`
                  : "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: `${action.color}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <action.icon size={20} style={{ color: action.color }} />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  marginBottom: "0.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {action.title}
                {hoveredAction === action.id && (
                  <ArrowRight size={14} style={{ opacity: 0.6 }} />
                )}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  opacity: 0.6,
                }}
              >
                {action.description}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div
        style={{
          backgroundColor: "var(--color-base-200)",
          border: "1px solid #333",
          borderRadius: "12px",
          padding: "1.5rem",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              opacity: 0.6,
            }}
          >
            Preview
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.75rem",
              color: "var(--color-primary)",
            }}
          >
            <Sparkles size={12} />
            <span>todo.txt format</span>
          </div>
        </div>
        <pre
          style={{
            fontFamily: "'Architects Daughter', cursive",
            fontSize: "0.9rem",
            lineHeight: "1.6",
            margin: 0,
            whiteSpace: "pre-wrap",
            opacity: 0.9,
          }}
        >
          <span style={{ color: "#a9a5ff" }}>{codePreview}</span>
        </pre>
      </div>
    </div>
  );
};

export default WelcomeScreen;
