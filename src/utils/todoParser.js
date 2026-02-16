const stripHtml = (html, replacement = '\n') => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, replacement);
};

export const parseTodoContent = (content) => {
  if (!content) return { tasks: [], priorities: {}, projects: {}, contexts: {} };
  
  const text = stripHtml(content, '\n');
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
