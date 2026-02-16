export const toggleFilter = (activeFilter, type, value) =>
  activeFilter?.type === type && activeFilter?.value === value ? null : { type, value };

export const applyFilter = (tasks, activeFilter) => {
  if (!activeFilter) return [];
  const filters = {
    priority: t => t.priority === activeFilter.value,
    project: t => t.projects?.includes(activeFilter.value),
    context: t => t.contexts?.includes(activeFilter.value)
  };
  return tasks.filter(filters[activeFilter.type] || (() => true));
};
