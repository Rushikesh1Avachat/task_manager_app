import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FILTER_TABS, SORT_OPTIONS, STORAGE_KEY } from '../constants';
import { filterTasks, sortTasks } from '../utils/taskUtils';
import { TaskContext } from './taskContextInstance';

function getInitialTasksFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse tasks from localStorage:', err);
  }
  return null;
}

export function TaskProvider({ children }) {
  const initialStorageData = useMemo(() => getInitialTasksFromStorage(), []);
  const [tasks, setTasks] = useState(() => initialStorageData ?? []);
  const [loading, setLoading] = useState(() => initialStorageData === null);
  const [error, setError] = useState(null);

  // Filter and sort state
  const [filterTab, setFilterTab] = useState(FILTER_TABS.ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.DEFAULT);

  // Prevent overwriting localStorage before initial load
  const isLoadedRef = useRef(initialStorageData !== null);

  // Fetch starter tasks from /tasks.json
  const fetchStarterTasks = useCallback(async (isUserRetry = false) => {
    try {
      const response = await fetch('/tasks.json');
      if (!response.ok) {
        throw new Error(`Failed to load tasks: server responded with ${response.status}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid tasks data format received.');
      }

      setTasks(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      isLoadedRef.current = true;
      setError(null);
      if (isUserRetry) {
        toast.success('Tasks loaded successfully!');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred while loading tasks.';
      setError(message);
      if (isUserRetry) {
        toast.error(`Error loading tasks: ${message}`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch starter data if no localStorage entry exists
  useEffect(() => {
    if (!isLoadedRef.current) {
      fetchStarterTasks();
    }
  }, [fetchStarterTasks]);

  // Sync to localStorage on every change to tasks once initial load is done
  useEffect(() => {
    if (isLoadedRef.current) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (err) {
        console.error('Failed to save tasks to localStorage:', err);
      }
    }
  }, [tasks]);

  /**
   * Add a new task
   */
  const addTask = useCallback(({ title, priority = 'Medium', dueDate = null }) => {
    const trimmedTitle = title ? title.trim() : '';
    if (!trimmedTitle) {
      return { success: false, error: 'Task title cannot be blank.' };
    }

    const newTask = {
      id: Date.now(),
      title: trimmedTitle,
      priority: priority || 'Medium',
      dueDate: dueDate ? dueDate : null,
      completed: false,
    };

    setTasks((prev) => [newTask, ...prev]);
    toast.success(`Task "${trimmedTitle}" added!`, {
      id: `add-${newTask.id}`,
    });
    return { success: true };
  }, []);

  /**
   * Toggle task completion status
   */
  const toggleTask = useCallback((id) => {
    setTasks((prev) => {
      const target = prev.find((t) => t.id === id);
      if (target) {
        if (!target.completed) {
          toast.success(`Completed "${target.title}" 🎉`, { id: `toggle-${id}` });
        } else {
          toast(`Marked "${target.title}" as active`, {
            icon: '↩️',
            id: `toggle-${id}`,
          });
        }
      }
      return prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
    });
  }, []);

  /**
   * Update task in place (title, priority, due date)
   */
  const updateTask = useCallback((id, updates) => {
    if (typeof updates === 'string') {
      updates = { title: updates };
    }
    const trimmedTitle = updates.title !== undefined ? updates.title.trim() : undefined;
    if (trimmedTitle !== undefined && !trimmedTitle) {
      return { success: false, error: 'Task title cannot be blank.' };
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updates,
              title: trimmedTitle !== undefined ? trimmedTitle : task.title,
            }
          : task
      )
    );
    toast.success('Task updated!', { id: `edit-${id}` });
    return { success: true };
  }, []);

  /**
   * Update task title in place (preserves backwards-compatibility)
   */
  const updateTaskTitle = useCallback(
    (id, newTitle) => updateTask(id, { title: newTitle }),
    [updateTask]
  );

  /**
   * Restore a deleted task (5-second undo support)
   */
  const restoreTask = useCallback((taskToRestore, index) => {
    if (!taskToRestore) return;
    setTasks((prev) => {
      if (prev.some((t) => t.id === taskToRestore.id)) return prev;
      const copy = [...prev];
      if (typeof index === 'number' && index >= 0 && index <= copy.length) {
        copy.splice(index, 0, taskToRestore);
      } else {
        copy.unshift(taskToRestore);
      }
      return copy;
    });
  }, []);

  /**
   * Delete a task with 5-second Undo notification
   */
  const deleteTask = useCallback(
    (id) => {
      const targetTask = tasks.find((t) => t.id === id);
      const targetIndex = tasks.findIndex((t) => t.id === id);

      setTasks((prev) => prev.filter((task) => task.id !== id));

      if (targetTask) {
        toast(
          (t) => (
            <div className="flex items-center justify-between gap-3 text-xs w-full">
              <span className="truncate max-w-[150px] font-medium">
                Deleted &ldquo;{targetTask.title}&rdquo;
              </span>
              <button
                type="button"
                onClick={() => {
                  restoreTask(targetTask, targetIndex);
                  toast.dismiss(t.id);
                  toast.success('Task restored!', { id: `restore-${targetTask.id}` });
                }}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded text-xs transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                Undo
              </button>
            </div>
          ),
          {
            duration: 5000,
            id: `delete-${id}`,
            icon: '🗑️',
          }
        );
      }

      return { deletedTask: targetTask, deletedIndex: targetIndex };
    },
    [tasks, restoreTask]
  );

  /**
   * Retry fetching starter tasks
   */
  const retryFetch = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchStarterTasks(true);
  }, [fetchStarterTasks]);

  /**
   * Reset data to starter tasks from public/tasks.json
   */
  const resetToStarterData = useCallback(async () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      isLoadedRef.current = false;
      setLoading(true);
      setError(null);
      await fetchStarterTasks();
      toast.success('Reset to starter tasks successfully!');
    } catch (err) {
      console.error('Failed to reset tasks:', err);
      toast.error('Failed to reset data.');
    }
  }, [fetchStarterTasks]);

  /**
   * Clear all completed tasks with Undo toast
   */
  const clearCompleted = useCallback(() => {
    const completedTasks = tasks.filter((t) => t.completed);
    if (completedTasks.length === 0) return;

    setTasks((prev) => prev.filter((t) => !t.completed));

    toast(
      (t) => (
        <div className="flex items-center justify-between gap-3 text-xs w-full">
          <span>Cleared {completedTasks.length} completed task{completedTasks.length > 1 ? 's' : ''}</span>
          <button
            type="button"
            onClick={() => {
              setTasks((prev) => [...prev, ...completedTasks]);
              toast.dismiss(t.id);
              toast.success('Restored completed tasks!');
            }}
            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded text-xs transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            Undo
          </button>
        </div>
      ),
      { duration: 5000, icon: '🧹' }
    );
  }, [tasks]);

  /**
   * Mark all tasks as completed or active
   */
  const toggleAllTasks = useCallback((markAsCompleted = true) => {
    if (tasks.length === 0) return;
    const previousTasks = [...tasks];
    setTasks((prev) => prev.map((t) => ({ ...t, completed: markAsCompleted })));

    toast(
      (t) => (
        <div className="flex items-center justify-between gap-3 text-xs w-full">
          <span>All tasks marked as {markAsCompleted ? 'completed' : 'active'}</span>
          <button
            type="button"
            onClick={() => {
              setTasks(previousTasks);
              toast.dismiss(t.id);
              toast.success('Action undone!');
            }}
            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded text-xs transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            Undo
          </button>
        </div>
      ),
      { duration: 5000 }
    );
  }, [tasks]);

  /**
   * Export tasks as downloadable JSON file
   */
  const exportTasks = useCallback(() => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `taskflow-export-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success('Tasks exported as JSON!');
    } catch (err) {
      console.error('Export failed:', err);
      toast.error('Failed to export tasks.');
    }
  }, [tasks]);

  /**
   * Import tasks from JSON data
   */
  const importTasks = useCallback((incomingJson) => {
    try {
      const parsed = typeof incomingJson === 'string' ? JSON.parse(incomingJson) : incomingJson;
      if (!Array.isArray(parsed)) {
        throw new Error('Imported data must be an array of tasks.');
      }
      const validTasks = parsed.map((item, idx) => ({
        id: item.id || Date.now() + idx,
        title: String(item.title || 'Untitled Task').trim(),
        priority: ['Low', 'Medium', 'High'].includes(item.priority) ? item.priority : 'Medium',
        dueDate: item.dueDate || null,
        completed: Boolean(item.completed),
      }));

      setTasks(validTasks);
      toast.success(`Imported ${validTasks.length} tasks successfully!`);
      return { success: true, count: validTasks.length };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON file';
      toast.error(`Import failed: ${msg}`);
      return { success: false, error: msg };
    }
  }, []);

  // Derived counts
  const activeCount = useMemo(() => tasks.filter((t) => !t.completed).length, [tasks]);
  const completedCount = useMemo(() => tasks.filter((t) => t.completed).length, [tasks]);
  const totalCount = tasks.length;

  // Filtered and sorted tasks
  const displayedTasks = useMemo(() => {
    const filtered = filterTasks(tasks, filterTab, searchQuery);
    return sortTasks(filtered, sortBy);
  }, [tasks, filterTab, searchQuery, sortBy]);

  const value = {
    tasks,
    displayedTasks,
    loading,
    error,
    filterTab,
    setFilterTab,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    activeCount,
    completedCount,
    totalCount,
    addTask,
    toggleTask,
    updateTask,
    updateTaskTitle,
    deleteTask,
    restoreTask,
    clearCompleted,
    toggleAllTasks,
    exportTasks,
    importTasks,
    retryFetch,
    resetToStarterData,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
