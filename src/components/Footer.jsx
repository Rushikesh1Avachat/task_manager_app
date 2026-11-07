import { NavLink, Link, useLocation } from 'react-router-dom';
import { CheckSquare, Sparkles, Keyboard, BarChart2, ListTodo, HelpCircle, ShieldCheck } from 'lucide-react';
import { useTasks } from '../hooks';

export default function Footer({ currentPage, onNavigate }) {
  const { totalCount, activeCount, completedCount } = useTasks();
  const location = useLocation();

  const currentPath = location.pathname;
  const isTasksActive = currentPage === 'tasks' || (!currentPage && (currentPath === '/' || currentPath.startsWith('/tasks')));
  const isAnalyticsActive = currentPage === 'analytics' || (!currentPage && currentPath.startsWith('/analytics'));
  const isAboutActive = currentPage === 'about' || (!currentPage && currentPath.startsWith('/about'));

  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm transition-colors text-slate-600 dark:text-slate-400">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pb-6 border-b border-slate-100 dark:border-slate-800/80">
          {/* Brand & Purpose */}
          <div className="space-y-2.5">
            <Link
              to="/"
              onClick={() => onNavigate && onNavigate('tasks')}
              className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm hover:opacity-90 transition-opacity"
            >
              <div className="w-6 h-6 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center">
                <CheckSquare className="w-3.5 h-3.5" />
              </div>
              <span>TaskFlow Manager</span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Clean, resilient task management engineered with React 19, React Router Dom, Vite, and Tailwind CSS.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>All 9 Must-Haves Tested</span>
            </div>
          </div>

          {/* Quick Pages & Shortcuts */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Navigation & Shortcuts
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <NavLink
                to="/tasks"
                role="button"
                onClick={() => onNavigate && onNavigate('tasks')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  isTasksActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <ListTodo className="w-3 h-3" />
                <span>Tasks List</span>
              </NavLink>

              <NavLink
                to="/analytics"
                role="button"
                onClick={() => onNavigate && onNavigate('analytics')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  isAnalyticsActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <BarChart2 className="w-3 h-3" />
                <span>Analytics</span>
              </NavLink>

              <NavLink
                to="/about"
                role="button"
                onClick={() => onNavigate && onNavigate('about')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  isAboutActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <HelpCircle className="w-3 h-3" />
                <span>About & Spec</span>
              </NavLink>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 pt-1">
              <div className="flex items-center gap-1.5">
                <Keyboard className="w-3 h-3 text-slate-400" />
                <span>
                  <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">Enter</kbd> to save/add • <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">Esc</kbd> to cancel
                </span>
              </div>
            </div>
          </div>

          {/* Real-time Status Card */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Live Task Metrics
            </h4>
            <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Completion</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{completionRate}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                <span>{activeCount} active</span>
                <span>•</span>
                <span>{completedCount} completed</span>
                <span>•</span>
                <span>{totalCount} total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Tech Details */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-slate-500">
          <p className="flex items-center gap-1.5 text-center sm:text-left">
            <span>React Intern Project: Task Manager App</span>
            <span className="hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Sparkles className="w-3 h-3 text-amber-500" /> React 19 + Vite + React Router Dom
            </span>
          </p>
          <div className="flex items-center gap-3 text-[11px]">
            <span>React Router Dom v7</span>
            <span>•</span>
            <span>React Context</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
