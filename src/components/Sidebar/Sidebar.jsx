import {
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
} from "lucide-react";
import { useState } from "react";

const BASE_SIDEBAR_STYLE = {
  backgroundColor: "var(--color-base-200)",
  borderRight: "1px solid #333",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.2s ease",
  boxShadow: "4px 0 12px rgba(0, 0, 0, 0.2)",
  position: "fixed",
  top: "48px",
  left: 0,
  bottom: "28px",
  zIndex: 100,
};

const Sidebar = ({ isCollapsed, onToggle, taskData, activeFilter, onFilterChange }) => {
  const { tasks, priorities, projects, contexts } = taskData;
  const [expandedSections, setExpandedSections] = useState(new Set(['priorities', 'projects', 'contexts']));

  const toggleSection = (section) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const handleFilterClick = (type, value) => {
    if (activeFilter?.type === type && activeFilter?.value === value) {
      onFilterChange(null);
    } else {
      onFilterChange({ type, value });
    }
  };

  const clearFilter = (e) => {
    e.stopPropagation();
    onFilterChange(null);
  };

  const priorityColors = {
    A: "#ef4444",
    B: "#f59e0b",
    C: "#3b82f6",
  };

  if (isCollapsed) {
    return (
      <aside
        style={{
          ...BASE_SIDEBAR_STYLE,
          width: "60px",
          minWidth: "60px",
        }}
      >
        <div
          style={{
            padding: "0.75rem",
            display: "flex",
            justifyContent: "center",
            borderBottom: "1px solid #333",
          }}
        >
          <button onClick={onToggle} className="btn btn-ghost btn-xs" style={{ padding: "2px" }}>
            <ChevronRight size={16} />
          </button>
        </div>
        <div style={{ padding: "0.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {Object.keys(priorities).filter(p => priorities[p]?.length).map(p => (
            <button
              key={p}
              onClick={() => handleFilterClick('priority', p)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "0.875rem",
                backgroundColor: activeFilter?.type === 'priority' && activeFilter?.value === p 
                  ? priorityColors[p] + "30" 
                  : "var(--color-base-300)",
                color: priorityColors[p],
              }}
              title={`Priority ${p} (${priorities[p]?.length || 0})`}
            >
              {p}
            </button>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside
      style={{
        ...BASE_SIDEBAR_STYLE,
        width: "280px",
        minWidth: "280px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "0.75rem 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #333",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Filter size={14} />
          <span
            style={{
              fontWeight: 600,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Filters
          </span>
        </div>
        <button onClick={onToggle} className="btn btn-ghost btn-xs" style={{ padding: "2px" }}>
          <ChevronLeft size={16} />
        </button>
      </div>

      {activeFilter && (
        <div
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "var(--color-primary)",
            color: "var(--color-primary-content)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.8rem",
          }}
        >
          <span>
            {activeFilter.type === 'priority' && `Priority ${activeFilter.value}`}
            {activeFilter.type === 'project' && `+${activeFilter.value}`}
            {activeFilter.type === 'context' && `@${activeFilter.value}`}
          </span>
          <button onClick={clearFilter} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <X size={14} />
          </button>
        </div>
      )}

      <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #333" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", opacity: 0.7 }}>
          <span>{tasks.length} tasks</span>
          <span>{tasks.filter(t => t.text.startsWith('x ')).length} done</span>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "0.5rem" }}>
        <div style={{ marginBottom: "0.5rem" }}>
          <button
            onClick={() => toggleSection('priorities')}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.5rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-base-content)",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: 600,
            }}
          >
            <span>Priorities {expandedSections.has('priorities') ? '▼' : '▶'}</span>
          </button>
          {expandedSections.has('priorities') && (
            <div style={{ padding: "0.25rem 0" }}>
              {Object.entries(priorities).map(([priority, items]) => (
                items?.length > 0 && (
                  <button
                    key={priority}
                    onClick={() => handleFilterClick('priority', priority)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.4rem 0.5rem",
                      background: activeFilter?.type === 'priority' && activeFilter?.value === priority
                        ? priorityColors[priority] + "20"
                        : "transparent",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      color: "var(--color-base-content)",
                      fontSize: "0.875rem",
                    }}
                  >
                    <span
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "0.75rem",
                        backgroundColor: priorityColors[priority] + "30",
                        color: priorityColors[priority],
                      }}
                    >
                      {priority}
                    </span>
                    <span style={{ flex: 1, textAlign: "left" }}>{priority === 'A' ? 'High' : priority === 'B' ? 'Medium' : 'Low'}</span>
                    <span style={{ opacity: 0.5, fontSize: "0.75rem" }}>{items.length}</span>
                  </button>
                )
              ))}
              {Object.values(priorities).every(arr => !arr?.length) && (
                <div style={{ padding: "0.5rem", opacity: 0.5, fontSize: "0.8rem", fontStyle: "italic" }}>
                  No prioritized tasks
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <button
            onClick={() => toggleSection('projects')}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.5rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-base-content)",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: 600,
            }}
          >
            <span>Projects {expandedSections.has('projects') ? '▼' : '▶'}</span>
          </button>
          {expandedSections.has('projects') && (
            <div style={{ padding: "0.25rem 0" }}>
              {Object.entries(projects).map(([project, items]) => (
                <button
                  key={project}
                  onClick={() => handleFilterClick('project', project)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.4rem 0.5rem",
                    background: activeFilter?.type === 'project' && activeFilter?.value === project
                      ? "var(--color-primary)20"
                      : "transparent",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    color: "var(--color-base-content)",
                    fontSize: "0.875rem",
                  }}
                >
                  <span style={{ color: "var(--color-primary)", fontWeight: 500 }}>+</span>
                  <span style={{ flex: 1, textAlign: "left" }}>{project}</span>
                  <span style={{ opacity: 0.5, fontSize: "0.75rem" }}>{items.length}</span>
                </button>
              ))}
              {Object.keys(projects).length === 0 && (
                <div style={{ padding: "0.5rem", opacity: 0.5, fontSize: "0.8rem", fontStyle: "italic" }}>
                  No projects found
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <button
            onClick={() => toggleSection('contexts')}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.5rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-base-content)",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: 600,
            }}
          >
            <span>Contexts {expandedSections.has('contexts') ? '▼' : '▶'}</span>
          </button>
          {expandedSections.has('contexts') && (
            <div style={{ padding: "0.25rem 0" }}>
              {Object.entries(contexts).map(([context, items]) => (
                <button
                  key={context}
                  onClick={() => handleFilterClick('context', context)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.4rem 0.5rem",
                    background: activeFilter?.type === 'context' && activeFilter?.value === context
                      ? "var(--color-primary)20"
                      : "transparent",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    color: "var(--color-base-content)",
                    fontSize: "0.875rem",
                  }}
                >
                  <span style={{ color: "#4ade80", fontWeight: 500 }}>@</span>
                  <span style={{ flex: 1, textAlign: "left" }}>{context}</span>
                  <span style={{ opacity: 0.5, fontSize: "0.75rem" }}>{items.length}</span>
                </button>
              ))}
              {Object.keys(contexts).length === 0 && (
                <div style={{ padding: "0.5rem", opacity: 0.5, fontSize: "0.8rem", fontStyle: "italic" }}>
                  No contexts found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
