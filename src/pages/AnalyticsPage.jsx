import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Flame, 
  Award, 
  ArrowRight,
  ListTodo
} from 'lucide-react';
import { useTasks } from '../hooks';
import { isTaskOverdue, formatDate } from '../utils/taskUtils';
import { PRIORITIES } from '../constants';

export default function AnalyticsPage({ onNavigateToTasks }) {
  const navigate = useNavigate();
  const { tasks, toggleTask, totalCount, activeCount, completedCount } = useTasks();

  const handleBackToTasks = () => {
    if (onNavigateToTasks) {
      onNavigateToTasks();
    } else {
      navigate('/tasks');
    }
  };

  const overdueTasks = useMemo(() => {
    return tasks.filter((t) => isTaskOverdue(t));
  }, [tasks]);

  const overdueCount = overdueTasks.length;

  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Breakdown by priority
  const priorityStats = useMemo(() => {
    const stats = {
      [PRIORITIES.HIGH]: { total: 0, completed: 0, active: 0 },
      [PRIORITIES.MEDIUM]: { total: 0, completed: 0, active: 0 },
      [PRIORITIES.LOW]: { total: 0, completed: 0, active: 0 },
    };

    tasks.forEach((task) => {
      const p = task.priority || PRIORITIES.MEDIUM;
      if (!stats[p]) {
        stats[p] = { total: 0, completed: 0, active: 0 };
      }
      stats[p].total += 1;
      if (task.completed) {
        stats[p].completed += 1;
      } else {
        stats[p].active += 1;
      }
    });

    return stats;
  }, [tasks]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Headline */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Productivity & Insights
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time analytics computed directly from your tasks state.
          </p>
        </div>

        <button
          type="button"
          onClick={handleBackToTasks}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer"
        >
          <ListTodo className="w-3.5 h-3.5" />
          <span>Manage Tasks</span>
          <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total</span>
            <ListTodo className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalCount}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">all tracked tasks</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-xs font-medium text-slate-400">Active</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{activeCount}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">in progress</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-emerald-500 mb-2">
            <span className="text-xs font-medium text-slate-400">Done</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{completedCount}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">completed</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-rose-500 mb-2">
            <span className="text-xs font-medium text-slate-400">Overdue</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className={`text-2xl font-extrabold ${overdueCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
            {overdueCount}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">past due date</div>
        </div>
      </div>

      {/* Completion Progress Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Overall Task Completion Rate
            </h3>
          </div>
          <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
            {completionRate}%
          </span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-700/60 h-3 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionRate}%` }}
          />
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {completionRate === 100
            ? '🏆 Outstanding work! All tasks are completed.'
            : completionRate >= 50
            ? '💪 Good momentum! More than half of your tasks are finished.'
            : '🚀 Getting started! Tackle high priority tasks first to build momentum.'}
        </p>
      </div>

      {/* Priority Breakdown */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-500" />
          Breakdown by Priority Level
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* High Priority */}
          <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-300">High Priority</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-200">
                {priorityStats[PRIORITIES.HIGH].total}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Completed: {priorityStats[PRIORITIES.HIGH].completed}</span>
              <span>Active: {priorityStats[PRIORITIES.HIGH].active}</span>
            </div>
          </div>

          {/* Medium Priority */}
          <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300">Medium Priority</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-200">
                {priorityStats[PRIORITIES.MEDIUM].total}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Completed: {priorityStats[PRIORITIES.MEDIUM].completed}</span>
              <span>Active: {priorityStats[PRIORITIES.MEDIUM].active}</span>
            </div>
          </div>

          {/* Low Priority */}
          <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Low Priority</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-200">
                {priorityStats[PRIORITIES.LOW].total}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Completed: {priorityStats[PRIORITIES.LOW].completed}</span>
              <span>Active: {priorityStats[PRIORITIES.LOW].active}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overdue Attention Panel */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            Overdue Deadlines ({overdueCount})
          </h3>
          {overdueCount > 0 && (
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
              Action required
            </span>
          )}
        </div>

        {overdueCount === 0 ? (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 text-center text-xs text-slate-500 dark:text-slate-400">
            ✨ No overdue tasks! All active tasks are within schedule or have open dates.
          </div>
        ) : (
          <div className="space-y-2">
            {overdueTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/30 gap-3 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {task.title}
                  </p>
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                    Due: {formatDate(task.dueDate)} ({task.dueDate}) • {task.priority} Priority
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-colors shrink-0 cursor-pointer"
                >
                  Mark Done
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
