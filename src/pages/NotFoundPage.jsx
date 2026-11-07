import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FileQuestion, 
  ArrowLeft, 
  Home, 
  ListTodo, 
  BarChart2, 
  BookOpen,
  Compass
} from 'lucide-react';

export default function NotFoundPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const suggestedPages = [
    {
      title: 'Tasks Dashboard',
      description: 'Manage, search, sort, and organize your active and completed tasks.',
      path: '/tasks',
      icon: ListTodo,
      badge: 'Main Hub',
    },
    {
      title: 'Productivity Analytics',
      description: 'View completion percentages, priority breakdown, and overdue tasks.',
      path: '/analytics',
      icon: BarChart2,
      badge: 'Insights',
    },
    {
      title: 'Documentation & Spec',
      description: 'Explore the full application specifications and keyboard shortcuts.',
      path: '/about',
      icon: BookOpen,
      badge: 'Guide',
    },
  ];

  return (
    <div className="py-10 px-4 max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
      {/* 404 Hero Illustration & Badge */}
      <div className="space-y-3 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-500/10">
            <FileQuestion className="w-10 h-10" />
          </div>
          <span className="absolute -top-2 -right-3 text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-900 shadow-xs">
            404 Error
          </span>
        </div>

        <div className="space-y-1.5 pt-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            The page you requested does not exist or may have been moved.
          </p>
          {location.pathname && (
            <div className="pt-1">
              <span className="inline-block text-[11px] font-mono px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Route: {location.pathname}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          role="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Back to Tasks</span>
        </Link>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Go Back</span>
        </button>
      </div>

      {/* Suggested Destination Cards */}
      <div className="text-left space-y-3 pt-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
          <Compass className="w-3.5 h-3.5 text-indigo-500" />
          <span>Explore Valid Pages</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {suggestedPages.map((page) => {
            const Icon = page.icon;
            return (
              <Link
                key={page.path}
                to={page.path}
                className="group p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 px-2 py-0.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60">
                      {page.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {page.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {page.description}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 mt-3 block">
                  Visit Page &rarr;
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
