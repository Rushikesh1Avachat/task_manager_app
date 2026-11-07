import { FILTER_TABS, PRIORITY_WEIGHTS, SORT_OPTIONS } from '../constants';

/**
 * Checks if a task is overdue.
 * An incomplete task with a due date strictly before the reference date is considered overdue.
 *
 * @param {Object} task
 * @param {Date} [referenceDate=new Date()]
 * @returns {boolean}
 */
export function isTaskOverdue(task, referenceDate = new Date()) {
  if (!task || task.completed || !task.dueDate) {
    return false;
  }

  const year = referenceDate.getFullYear();
  const month = String(referenceDate.getMonth() + 1).padStart(2, '0');
  const day = String(referenceDate.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  return task.dueDate < todayStr;
}

/**
 * Filters a task list by tab (All, Active, Completed) and search query.
 * Pure function: does not mutate the original list.
 *
 * @param {Array} tasks
 * @param {string} filterTab - 'all' | 'active' | 'completed'
 * @param {string} searchQuery
 * @returns {Array}
 */
export function filterTasks(tasks, filterTab = FILTER_TABS.ALL, searchQuery = '') {
  if (!Array.isArray(tasks)) return [];

  const trimmedQuery = searchQuery.trim().toLowerCase();

  return tasks.filter((task) => {
    // Tab filter
    if (filterTab === FILTER_TABS.ACTIVE && task.completed) {
      return false;
    }
    if (filterTab === FILTER_TABS.COMPLETED && !task.completed) {
      return false;
    }

    // Search query filter (case-insensitive title match)
    if (trimmedQuery.length > 0) {
      const titleMatch = (task.title || '').toLowerCase().includes(trimmedQuery);
      if (!titleMatch) return false;
    }

    return true;
  });
}

/**
 * Sorts tasks based on the selected sort criteria.
 * Pure function: does not mutate the original list.
 *
 * @param {Array} tasks
 * @param {string} sortBy - 'default' | 'dueDate' | 'priority'
 * @returns {Array}
 */
export function sortTasks(tasks, sortBy = SORT_OPTIONS.DEFAULT) {
  if (!Array.isArray(tasks)) return [];

  const taskCopy = [...tasks];

  if (sortBy === SORT_OPTIONS.DUE_DATE) {
    // Soonest first, tasks with no date placed last
    return taskCopy.sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        if (a.dueDate === b.dueDate) {
          return (a.id ?? 0) - (b.id ?? 0);
        }
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      return (a.id ?? 0) - (b.id ?? 0);
    });
  }

  if (sortBy === SORT_OPTIONS.PRIORITY) {
    // High first -> Medium -> Low
    return taskCopy.sort((a, b) => {
      const weightA = PRIORITY_WEIGHTS[a.priority] ?? 99;
      const weightB = PRIORITY_WEIGHTS[b.priority] ?? 99;
      if (weightA !== weightB) {
        return weightA - weightB;
      }
      return (a.id ?? 0) - (b.id ?? 0);
    });
  }

  // Default: retain initial list order
  return taskCopy;
}

/**
 * Formats an ISO YYYY-MM-DD date string for display (e.g., 'Jan 15, 2026').
 * Uses UTC components to prevent timezone offset shifts.
 *
 * @param {string|null} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const [year, month, day] = parts.map(Number);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return dateStr;

  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
