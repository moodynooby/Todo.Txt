
import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Search,
  User,
  Filter,
  Plus,
  ClipboardList,
  Folder,
  MapPin,
  Settings
} from 'lucide-react';

const Dashboard = ({ taskData, setViewMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  const { tasks, projects } = taskData;

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.raw.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProject = !selectedProject || (task.projects && task.projects.includes(selectedProject));
      return matchesSearch && matchesProject && !task.completed;
    });
  }, [tasks, searchQuery, selectedProject]);

  const topProjects = useMemo(() => {
    return Object.entries(projects)
      .map(([name, tasks]) => ({ name, count: tasks.length }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  }, [projects]);

  const renderTaskText = (task) => {
    // Basic highlighting for projects and contexts
    const words = task.raw.split(/(\s+)/);
    return words.map((word, i) => {
      if (word.startsWith('+')) {
        return <span key={i} className="text-project">{word}</span>;
      }
      if (word.startsWith('@')) {
        return <span key={i} className="text-context">{word}</span>;
      }
      if (word.match(/^\([A-Z]\)$/)) {
        const priority = word.slice(1, 2);
        let colorClass = 'text-priority-a';
        if (priority === 'B') colorClass = 'text-priority-b';
        if (priority === 'C') colorClass = 'text-priority-c';
        return <span key={i} className={`font-bold ${colorClass}`}>{word}</span>;
      }
      if (word.startsWith('due:')) {
        return <span key={i} className="text-muted">{word}</span>;
      }
      return <span key={i}>{word}</span>;
    });
  };

  return (
    <div className="bg-todo-dark text-gray-100 h-screen flex flex-col font-sans overflow-hidden fixed inset-0">
      {/* Header */}
      <header className="bg-todo-dark/95 backdrop-blur-sm border-b border-todo-gray p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight">Todo.txt</h1>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <User className="h-6 w-6" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-12 py-3 bg-todo-card border border-todo-gray rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500 outline-none"
            placeholder="Search tasks or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Filter className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </header>

      <div className="flex-grow overflow-y-auto no-scrollbar flex flex-col">
        {/* Main Content */}
        <main className="px-4 py-6 space-y-6 flex-grow">
        {/* Active Tasks */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 px-1">Active Tasks</h2>
          <div className="bg-todo-card border border-todo-gray rounded-2xl overflow-hidden divide-y divide-todo-gray">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <div key={task.id} className="p-4 flex items-start gap-4 active:bg-white/5 transition-colors">
                  <div className="mt-1">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded bg-transparent border-gray-600 text-blue-500 focus:ring-offset-todo-dark cursor-pointer"
                      checked={task.completed}
                      readOnly
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm leading-relaxed">
                      {renderTaskText(task)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">No active tasks found</div>
            )}
          </div>
        </section>

        {/* Top Projects Quick Filters */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 px-1">Top Projects</h2>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {topProjects.map(project => (
              <button
                key={project.name}
                onClick={() => setSelectedProject(selectedProject === project.name ? null : project.name)}
                className={`px-4 py-2 border rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedProject === project.name
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-todo-card border-todo-gray text-gray-300 hover:border-gray-500'
                }`}
              >
                +{project.name} ({project.count})
              </button>
            ))}
            {topProjects.length === 0 && (
              <span className="text-xs text-gray-500 px-1 italic">No projects found</span>
            )}
          </div>
        </section>
      </main>

      </div>

      {/* FAB */}
      <button className="fixed right-6 bottom-24 w-16 h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform active:scale-90 z-20">
        <Plus className="h-8 w-8" strokeWidth={2.5} />
      </button>

      {/* Bottom Nav */}
      <nav className="sticky bottom-0 bg-todo-dark/95 backdrop-blur-md border-t border-todo-gray flex justify-around items-center py-3 px-2 z-10">
        <button className="flex flex-col items-center gap-1 text-blue-500">
          <ClipboardList className="h-6 w-6" />
          <span className="text-[10px] font-medium uppercase">Tasks</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300">
          <Folder className="h-6 w-6" />
          <span className="text-[10px] font-medium uppercase">Projects</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300">
          <MapPin className="h-6 w-6" />
          <span className="text-[10px] font-medium uppercase">Contexts</span>
        </button>
        <button
          className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300"
          onClick={() => setViewMode('text')}
        >
          <Settings className="h-6 w-6" />
          <span className="text-[10px] font-medium uppercase">Editor</span>
        </button>
      </nav>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

Dashboard.propTypes = {
  taskData: PropTypes.shape({
    tasks: PropTypes.array.isRequired,
    projects: PropTypes.object.isRequired,
  }).isRequired,
  setViewMode: PropTypes.func.isRequired,
};

export default Dashboard;
