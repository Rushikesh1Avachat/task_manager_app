import { NavLink, Link, useLocation } from 'react-router-dom';
import { CheckSquare, Moon, Sun, RotateCcw, ListTodo, BarChart2, BookOpen } from 'lucide-react';
import { useTasks } from '../hooks';

export default function Header({ isDark, onToggleTheme, currentPage, onNavigate }) {
  const { resetToStarterData, totalCount, activeCount } = useTasks();
  const location = useLocation();

  const currentPath = location.pathname;
  const isTasksActive = currentPage === 'tasks' || (!currentPage && (currentPath === '/' || currentPath.startsWith('/tasks')));
  const isAnalyticsActive = currentPage === 'analytics' || (!currentPage && currentPath.startsWith('/analytics'));
  const isAboutActive = currentPage === 'about' || (!currentPage && currentPath.startsWith('/about'));

  const navItems = [
    { id: 'tasks', path: '/tasks', label: 'Tasks', icon: ListTodo, active: isTasksActive },
    { id: 'analytics', path: '/analytics', label: 'Analytics', icon: BarChart2, active: isAnalyticsActive },
    { id: 'about', path: '/about', label: 'About', icon: BookOpen, active: isAboutActive },
  ];

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur sticky top-0 z-20 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-2">
          {/* Brand Logo & Title with Router Link */}
          <Link
            to="/"
            onClick={() => onNavigate && onNavigate('tasks')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
            role="button"
            aria-label="Go to Tasks page"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  TaskFlow
                </span>
                <span className="text-[10px] sm:text-xs px-2 py-0.5 font-medium rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                  {activeCount} active
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-400 dark:text-slate-500">
                {totalCount} total tasks • LocalStorage synced
              </p>
            </div>
          </Link>

          {/* Desktop & Tablet Navigation with React Router NavLinks */}
          <nav className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80" aria-label="Page navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  role="button"
                  onClick={() => onNavigate && onNavigate(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    item.active
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Actions: Reset Data & Theme Toggle */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={resetToStarterData}
              title="Reset data to starter tasks"
              aria-label="Reset to starter data"
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="Toggle dark mode"
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
