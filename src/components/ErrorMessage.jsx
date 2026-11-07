import { AlertCircle, RefreshCw } from 'lucide-react';
import { useTasks } from '../hooks';

export default function ErrorMessage() {
  const { error, retryFetch } = useTasks();

  return (
    <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl p-5 text-center space-y-3">
      <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
        <AlertCircle className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-rose-800 dark:text-rose-200">
          Failed to load tasks
        </h3>
        <p className="text-xs text-rose-600 dark:text-rose-300 mt-1 max-w-sm mx-auto">
          {error || 'Unable to fetch tasks from the server. Please check your network connection and try again.'}
        </p>
      </div>
      <div>
        <button
          type="button"
          onClick={retryFetch}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      </div>
    </div>
  );
}
