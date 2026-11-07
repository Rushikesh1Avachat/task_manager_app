import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, AlertCircle, Calendar } from 'lucide-react';
import { useTasks } from '../hooks';
import { PRIORITIES } from '../constants';

export default function TaskForm() {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState(PRIORITIES.MEDIUM);
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      const msg = 'Task title is required (cannot be blank or only spaces).';
      setError(msg);
      toast.error('Please provide a task title.', { id: 'empty-title-toast' });
      return;
    }

    const result = addTask({
      title,
      priority,
      dueDate: dueDate || null,
    });

    if (result.success) {
      setTitle('');
      setPriority(PRIORITIES.MEDIUM);
      setDueDate('');
      setError('');
    } else if (result.error) {
      setError(result.error);
      toast.error(result.error, { id: 'add-task-error' });
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (error && e.target.value.trim()) {
      setError('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-700 space-y-3 transition-colors"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="task-title" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          New Task Title <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <input
            id="task-title"
            type="text"
            placeholder="What needs to be done? Press Enter to submit..."
            value={title}
            onChange={handleTitleChange}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
              error
                ? 'border-rose-400 focus:ring-rose-400/30 dark:border-rose-500'
                : 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
            }`}
          />
        </div>

        {error && (
          <p className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium mt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5">
          {/* Priority selector */}
          <div className="flex flex-col gap-1">
            <label htmlFor="task-priority" className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Priority
            </label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value={PRIORITIES.LOW}>Low</option>
              <option value={PRIORITIES.MEDIUM}>Medium</option>
              <option value={PRIORITIES.HIGH}>High</option>
            </select>
          </div>

          {/* Due date picker */}
          <div className="flex flex-col gap-1">
            <label htmlFor="task-duedate" className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Due Date
            </label>
            <input
              id="task-duedate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Add button */}
        <button
          type="submit"
          className="w-full sm:w-auto sm:self-end mt-1 sm:mt-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>
    </form>
  );
}
