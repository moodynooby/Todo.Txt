const stripHtml = (html, replacement = '\n') => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, replacement);
};

export const parseTodoContent = (content) => {
  if (!content) return { tasks: [], priorities: {}, projects: {}, contexts: {} };
  
  const text = stripHtml(content, '\n');
  const lines = text.split('\n');
  
  const tasks = [];
  const priorities = { A: [], B: [], C: [] };
  const projects = {};
  const contexts = {};
  
  lines.forEach((line, index) => {
    const trimmed = line.replace(/&nbsp;/g, ' ').trim();
    if (!trimmed || trimmed === '"') return;
    
    const task = { id: index, text: trimmed, raw: line, completed: false };
    
    if (trimmed.startsWith('x ')) {
      task.completed = true;
    }

    const priorityMatch = trimmed.match(/^(\([A-Z]\)\s|x\s\([A-Z]\)\s)/);
    if (priorityMatch) {
      const p = priorityMatch[0].match(/\(([A-Z])\)/)[1];
      task.priority = p;
      if (priorities[task.priority]) {
        priorities[task.priority].push(task);
      }
    }

    const dueMatch = trimmed.match(/due:(\d{4}-\d{2}-\d{2})/);
    if (dueMatch) {
      task.dueDate = dueMatch[1];
    } else if (trimmed.includes('due:today')) {
      task.dueDate = 'today';
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
