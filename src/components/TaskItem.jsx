import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Calendar, AlertTriangle, Pencil, Trash2, Check, X } from 'lucide-react';
import { useTasks } from '../hooks';
import { isTaskOverdue, formatDate } from '../utils/taskUtils';
import { PRIORITIES } from '../constants';

export default function TaskItem({ task, onRequestDelete }) {
  const { toggleTask, updateTaskTitle } = useTasks();

  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const [editError, setEditError] = useState('');

  const inputRef = useRef(null);

  // Focus and select input text when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setIsEditing(true);
    setDraftTitle(task.title);
    setEditError('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setDraftTitle(task.title);
    setEditError('');
  };

  const handleSaveEdit = () => {
    const trimmed = draftTitle.trim();
    if (!trimmed) {
      const msg = 'Title cannot be blank or only spaces.';
      setEditError(msg);
      toast.error('Task title cannot be empty.', { id: 'edit-empty-toast' });
      return;
    }

    const result = updateTaskTitle(task.id, trimmed);
    if (result.success) {
      setIsEditing(false);
      setEditError('');
    } else {
      setEditError(result.error || 'Failed to update title.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const overdue = isTaskOverdue(task);

  // Priority color styling
  const getPriorityClasses = (priority) => {
    switch (priority) {
      case PRIORITIES.HIGH:
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900/60';
      case PRIORITIES.MEDIUM:
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900/60';
      case PRIORITIES.LOW:
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900/60';
    }
  };

  return (
    <li
      className={`group relative bg-white dark:bg-slate-800 rounded-xl p-3.5 sm:p-4 border transition-all shadow-sm ${
        task.completed
          ? 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 opacity-75'
          : overdue
          ? 'border-rose-300/80 dark:border-rose-900/70 hover:border-rose-400 dark:hover:border-rose-700'
          : 'border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-slate-600'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="pt-0.5 shrink-0">
          <label className="relative flex items-center justify-center cursor-pointer">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              className="peer sr-only"
              aria-label={`Mark "${task.title}" as ${task.completed ? 'active' : 'completed'}`}
            />
            <div className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 dark:peer-checked:bg-indigo-500 dark:peer-checked:border-indigo-500 transition-colors flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
          </label>
        </div>

        {/* Task Details / Edit Form */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <input
                  ref={inputRef}
                  type="text"
                  value={draftTitle}
                  onChange={(e) => {
                    setDraftTitle(e.target.value);
                    if (editError && e.target.value.trim()) setEditError('');
                  }}
                  onKeyDown={handleKeyDown}
                  className="flex-1 px-2.5 py-1 text-sm rounded border border-indigo-500 dark:border-indigo-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none ring-2 ring-indigo-500/20"
                  aria-label="Edit task title"
                />
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors cursor-pointer"
                  title="Save (Enter)"
                  aria-label="Save title"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="p-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded transition-colors cursor-pointer"
                  title="Cancel (Esc)"
                  aria-label="Cancel editing"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {editError && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {editError}
                </p>
              )}
              <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                Press Enter to save, Escape to cancel
              </span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div
                onDoubleClick={handleStartEdit}
                className={`text-sm font-medium leading-snug break-words cursor-pointer select-text ${
                  task.completed
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-800 dark:text-slate-100'
                }`}
                title="Double click to edit title"
              >
                {task.title}
              </div>

              {/* Meta tags: Priority, Due Date, Overdue */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                {/* Priority Badge */}
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getPriorityClasses(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>

                {/* Due Date */}
                {task.dueDate ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {formatDate(task.dueDate)}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                    No due date
                  </span>
                )}

                {/* Overdue Label */}
                {overdue && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse">
                    <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                    Overdue
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons: Edit & Delete */}
        {!isEditing && (
          <div className="flex items-center gap-1 shrink-0 opacity-80 sm:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={handleStartEdit}
              aria-label={`Edit "${task.title}"`}
              title="Edit title (in-place)"
              className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onRequestDelete(task)}
              aria-label={`Delete "${task.title}"`}
              title="Delete task"
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
