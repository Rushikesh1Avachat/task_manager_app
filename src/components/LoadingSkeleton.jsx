import { Loader2 } from 'lucide-react';

export default function LoadingSkeleton() {
  return (
    <div className="space-y-4 py-8 animate-pulse">
      <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-sm font-medium">Loading tasks...</span>
      </div>

      <div className="space-y-3 max-w-md mx-auto">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-16 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 p-4 flex items-center gap-3"
          >
            <div className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
              <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

