import TaskItem from './TaskItem';
import { useTasks } from '../hooks';
import { CheckCircle2, Inbox } from 'lucide-react';

export default function TaskList({ onRequestDelete }) {
  const { displayedTasks, filterTab, searchQuery, totalCount } = useTasks();

  if (displayedTasks.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 mx-auto flex items-center justify-center">
          {searchQuery ? <Inbox className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
        </div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {totalCount === 0
            ? 'No tasks yet'
            : searchQuery
            ? `No tasks match "${searchQuery}"`
            : `No ${filterTab} tasks`}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
          {totalCount === 0
            ? 'Get started by creating your first task using the input form above.'
            : searchQuery
            ? 'Try adjusting your search query or clear the filter.'
            : filterTab === 'active'
            ? 'All caught up! Great job completing all your active tasks.'
            : 'No completed tasks yet in this view.'}
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2.5">
      {displayedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onRequestDelete={onRequestDelete}
        />
      ))}
    </ul>
  );
}
