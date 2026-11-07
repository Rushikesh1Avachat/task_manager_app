import { useState, useRef } from 'react';
import { 
  Search, 
  X, 
  ArrowUpDown, 
  Trash2, 
  Download, 
  Upload, 
  CheckCheck, 
  RotateCcw,
  SlidersHorizontal 
} from 'lucide-react';
import { useTasks } from '../hooks';
import { FILTER_TABS, SORT_OPTIONS } from '../constants';

export default function TaskControls() {
  const {
    filterTab,
    setFilterTab,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    activeCount,
    completedCount,
    totalCount,
    clearCompleted,
    toggleAllTasks,
    exportTasks,
    importTasks,
  } = useTasks();

  const [showTools, setShowTools] = useState(false);
  const fileInputRef = useRef(null);

  const tabs = [
    { id: FILTER_TABS.ALL, label: 'All', count: totalCount },
    { id: FILTER_TABS.ACTIVE, label: 'Active', count: activeCount },
    { id: FILTER_TABS.COMPLETED, label: 'Completed', count: completedCount },
  ];

  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (text) {
          importTasks(text);
        }
      } catch (err) {
        console.error('File reading failed:', err);
      }
    };
    reader.readAsText(file);
    // Reset file input so the same file can be reselected if needed
    e.target.value = '';
  };

  return (
    <div className="space-y-3">
      {/* Top row: Counter & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60 self-start sm:self-auto">
          {tabs.map((tab) => {
            const isActive = filterTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-600 text-slate-800 dark:text-slate-200'
                      : 'bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right side: Action tools toggle & Counter */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {completedCount > 0 && (
            <button
              type="button"
              onClick={clearCompleted}
              title="Clear all completed tasks"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-2 py-1 rounded-md transition-colors cursor-pointer border border-transparent hover:border-rose-200 dark:hover:border-rose-900"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear completed ({completedCount})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowTools((prev) => !prev)}
            aria-expanded={showTools}
            title="Batch actions & backup tools"
            className={`p-1.5 rounded-md border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
              showTools
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300'
                : 'bg-slate-100/70 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">Actions</span>
          </button>

          {/* Counter: "3 tasks left" */}
          <div
            data-testid="tasks-counter"
            className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-800/50 px-2.5 py-1 rounded-md border border-slate-200/50 dark:border-slate-700/50"
          >
            <span className="font-semibold text-slate-800 dark:text-slate-200">{activeCount}</span>{' '}
            <span>{activeCount === 1 ? 'task left' : 'tasks left'}</span>
          </div>
        </div>
      </div>

      {/* Expandable Power Actions Toolbar */}
      {showTools && (
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/70 flex flex-wrap items-center justify-between gap-2.5 text-xs animate-fade-in">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => toggleAllTasks(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600/80 transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Mark all complete</span>
            </button>
            <button
              type="button"
              onClick={() => toggleAllTasks(false)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600/80 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              <span>Mark all active</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportTasks}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600/80 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-indigo-500" />
              <span>Export JSON</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600/80 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-500" />
              <span>Import JSON</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
              aria-label="Upload tasks JSON file"
            />
          </div>
        </div>
      )}

      {/* Completion Progress Bar */}
      {totalCount > 0 && (
        <div className="w-full bg-slate-200/80 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
            title={`${completionRate}% completed`}
          />
        </div>
      )}

      {/* Bottom row: Search input & Sort dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tasks by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort tasks"
            className="px-2.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          >
            <option value={SORT_OPTIONS.DEFAULT}>Default Sort</option>
            <option value={SORT_OPTIONS.DUE_DATE}>Due date (soonest first)</option>
            <option value={SORT_OPTIONS.PRIORITY}>Priority (High first)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
