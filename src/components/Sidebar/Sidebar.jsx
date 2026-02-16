import {
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
} from "lucide-react";
import { useState } from "react";
import PropTypes from 'prop-types';
import "./Sidebar.css";
import { toggleFilter } from "../../utils/filterUtils";

// Priority configuration
const PRIORITY_CONFIG = {
  A: { label: 'High', color: '#ef4444' },
  B: { label: 'Medium', color: '#f59e0b' },
  C: { label: 'Low', color: '#3b82f6' },
};

const getPriorityColor = (level) => PRIORITY_CONFIG[level]?.color || '#6b7280';
const getPriorityLabel = (level) => PRIORITY_CONFIG[level]?.label || 'Unknown';

const FilterButton = ({ type, value, label, count, isActive, onClick, prefix }) => {
  const priorityColor = type === 'priority' ? getPriorityColor(value) : null;
  const activeBg = type === 'priority' ? `${priorityColor}20` : "var(--color-primary)20";

  return (
    <button
      onClick={onClick}
      className={`filter-btn ${isActive ? 'active' : ''}`}
      style={{ '--active-bg-color': activeBg }}
    >
      {type === 'priority' ? (
        <span className="priority-indicator" style={{ '--priority-color': priorityColor }}>
          {value}
        </span>
      ) : (
        <span className={`${type}-prefix`}>{prefix}</span>
      )}
      <span className="filter-text">{label}</span>
      <span className="filter-count">{count}</span>
    </button>
  );
};

const SidebarSection = ({ title, id, expandedSections, onToggle, children, isEmpty, emptyMessage }) => (
  <div className="section-wrapper">
    <button onClick={() => onToggle(id)} className="section-header">
      <span>{title} {expandedSections.has(id) ? '▼' : '▶'}</span>
    </button>
    {expandedSections.has(id) && (
      <div className="section-content">
        {isEmpty ? (
          <div className="empty-state">{emptyMessage}</div>
        ) : (
          children
        )}
      </div>
    )}
  </div>
);

const CollapsedPriorityButton = ({ priority, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`collapsed-priority-btn ${isActive ? 'active' : ''}`}
    style={{
      color: getPriorityColor(priority),
      '--priority-color': getPriorityColor(priority)
    }}
    title={`Priority ${priority} (${count})`}
  >
    {priority}
  </button>
);

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
    onFilterChange(toggleFilter(activeFilter, type, value));
  };

  const clearFilter = (e) => {
    e.stopPropagation();
    onFilterChange(null);
  };

  if (isCollapsed) {
    return (
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
        <div className="sidebar-header collapsed">
          <button onClick={onToggle} className="btn btn-ghost btn-xs" style={{ padding: "2px" }}>
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="collapsed-priority-container">
          {Object.keys(priorities).filter(p => priorities[p]?.length).map(p => (
            <CollapsedPriorityButton
              key={p}
              priority={p}
              count={priorities[p]?.length || 0}
              isActive={activeFilter?.type === 'priority' && activeFilter?.value === p}
              onClick={() => handleFilterClick('priority', p)}
            />
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      <div className="sidebar-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Filter size={14} />
          <span className="filter-title">
            Filters
          </span>
        </div>
        <button onClick={onToggle} className="btn btn-ghost btn-xs" style={{ padding: "2px" }}>
          <ChevronLeft size={16} />
        </button>
      </div>

      {activeFilter && (
        <div className="active-filter">
          <span>
            {activeFilter.type === 'priority' && `Priority ${activeFilter.value}`}
            {activeFilter.type === 'project' && `+${activeFilter.value}`}
            {activeFilter.type === 'context' && `@${activeFilter.value}`}
          </span>
          <button onClick={clearFilter} className="clear-filter-btn">
            <X size={14} />
          </button>
        </div>
      )}

      <div className="task-stats">
        <span>{tasks.length} tasks</span>
        <span>{tasks.filter(t => t.text.startsWith('x ')).length} done</span>
      </div>

      <div className="sidebar-content">
        <SidebarSection
          title="Priorities"
          id="priorities"
          expandedSections={expandedSections}
          onToggle={toggleSection}
          isEmpty={Object.values(priorities).every(arr => !arr?.length)}
          emptyMessage="No prioritized tasks"
        >
          {Object.entries(priorities).map(([priority, items]) => (
            items?.length > 0 && (
              <FilterButton
                key={priority}
                type="priority"
                value={priority}
                label={getPriorityLabel(priority)}
                count={items.length}
                isActive={activeFilter?.type === 'priority' && activeFilter?.value === priority}
                onClick={() => handleFilterClick('priority', priority)}
              />
            )
          ))}
        </SidebarSection>

        <SidebarSection
          title="Projects"
          id="projects"
          expandedSections={expandedSections}
          onToggle={toggleSection}
          isEmpty={Object.keys(projects).length === 0}
          emptyMessage="No projects found"
        >
          {Object.entries(projects).map(([project, items]) => (
            <FilterButton
              key={project}
              type="project"
              value={project}
              label={project}
              count={items.length}
              isActive={activeFilter?.type === 'project' && activeFilter?.value === project}
              onClick={() => handleFilterClick('project', project)}
              prefix="+"
            />
          ))}
        </SidebarSection>

        <SidebarSection
          title="Contexts"
          id="contexts"
          expandedSections={expandedSections}
          onToggle={toggleSection}
          isEmpty={Object.keys(contexts).length === 0}
          emptyMessage="No contexts found"
        >
          {Object.entries(contexts).map(([context, items]) => (
            <FilterButton
              key={context}
              type="context"
              value={context}
              label={context}
              count={items.length}
              isActive={activeFilter?.type === 'context' && activeFilter?.value === context}
              onClick={() => handleFilterClick('context', context)}
              prefix="@"
            />
          ))}
        </SidebarSection>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  taskData: PropTypes.shape({
    tasks: PropTypes.array.isRequired,
    priorities: PropTypes.object.isRequired,
    projects: PropTypes.object.isRequired,
    contexts: PropTypes.object.isRequired,
  }).isRequired,
  activeFilter: PropTypes.shape({
    type: PropTypes.string,
    value: PropTypes.string,
  }),
  onFilterChange: PropTypes.func.isRequired,
};

FilterButton.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  prefix: PropTypes.string,
};

SidebarSection.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  expandedSections: PropTypes.instanceOf(Set).isRequired,
  onToggle: PropTypes.func.isRequired,
  children: PropTypes.node,
  isEmpty: PropTypes.bool.isRequired,
  emptyMessage: PropTypes.string.isRequired,
};

CollapsedPriorityButton.propTypes = {
  priority: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Sidebar;
