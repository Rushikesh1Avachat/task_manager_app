import { describe, it, expect } from 'vitest';
import {
  isTaskOverdue,
  filterTasks,
  sortTasks,
  formatDate,
} from '../utils/taskUtils';
import { FILTER_TABS, SORT_OPTIONS } from '../constants';

const starterTasks = [
  { id: 1, title: 'Set up project repo', priority: 'High', dueDate: '2026-01-10', completed: true },
  { id: 2, title: 'Design login screen', priority: 'Medium', dueDate: '2027-03-12', completed: false },
  { id: 3, title: 'Write API docs', priority: 'Low', dueDate: '2027-04-20', completed: false },
  { id: 4, title: 'Fix checkout bug', priority: 'High', dueDate: '2026-01-15', completed: false },
  { id: 5, title: 'Plan team outing', priority: 'Low', dueDate: null, completed: true },
];

// Reference date for tests: Nov 7, 2026
const mockToday = new Date('2026-11-07T12:00:00Z');

describe('taskUtils unit tests', () => {
  describe('isTaskOverdue', () => {
    it('only marks Fix checkout bug as Overdue in the starter data', () => {
      const overdueTitles = starterTasks
        .filter((task) => isTaskOverdue(task, mockToday))
        .map((task) => task.title);

      expect(overdueTitles).toEqual(['Fix checkout bug']);
    });

    it('returns false for completed tasks even if due date is in the past', () => {
      const task = { id: 1, title: 'Past completed', dueDate: '2026-01-10', completed: true };
      expect(isTaskOverdue(task, mockToday)).toBe(false);
    });

    it('returns false for tasks without a due date', () => {
      const task = { id: 5, title: 'No date', dueDate: null, completed: false };
      expect(isTaskOverdue(task, mockToday)).toBe(false);
    });

    it('returns false for future incomplete tasks', () => {
      const task = { id: 2, title: 'Future task', dueDate: '2027-03-12', completed: false };
      expect(isTaskOverdue(task, mockToday)).toBe(false);
    });

    it('returns true for past incomplete tasks', () => {
      const task = { id: 4, title: 'Past incomplete', dueDate: '2026-01-15', completed: false };
      expect(isTaskOverdue(task, mockToday)).toBe(true);
    });
  });

  describe('filterTasks', () => {
    it('filters by All tab', () => {
      const filtered = filterTasks(starterTasks, FILTER_TABS.ALL, '');
      expect(filtered).toHaveLength(5);
    });

    it('filters by Active tab (should return 3 active tasks)', () => {
      const active = filterTasks(starterTasks, FILTER_TABS.ACTIVE, '');
      expect(active).toHaveLength(3);
      expect(active.every((t) => !t.completed)).toBe(true);
      expect(active.map((t) => t.id)).toEqual([2, 3, 4]);
    });

    it('filters by Completed tab (should return 2 completed tasks)', () => {
      const completed = filterTasks(starterTasks, FILTER_TABS.COMPLETED, '');
      expect(completed).toHaveLength(2);
      expect(completed.every((t) => t.completed)).toBe(true);
      expect(completed.map((t) => t.id)).toEqual([1, 5]);
    });

    it('filters by search query case-insensitively', () => {
      const searchCheckout = filterTasks(starterTasks, FILTER_TABS.ALL, 'checkout');
      expect(searchCheckout).toHaveLength(1);
      expect(searchCheckout[0].title).toBe('Fix checkout bug');

      const searchUpper = filterTasks(starterTasks, FILTER_TABS.ALL, 'PROJECT');
      expect(searchUpper).toHaveLength(1);
      expect(searchUpper[0].title).toBe('Set up project repo');
    });

    it('combines tab filtering and search query', () => {
      // Searching 'out' matches 'Fix checkout bug' (active) and 'Plan team outing' (completed)
      const allMatches = filterTasks(starterTasks, FILTER_TABS.ALL, 'out');
      expect(allMatches).toHaveLength(2);

      const activeMatches = filterTasks(starterTasks, FILTER_TABS.ACTIVE, 'out');
      expect(activeMatches).toHaveLength(1);
      expect(activeMatches[0].title).toBe('Fix checkout bug');

      const completedMatches = filterTasks(starterTasks, FILTER_TABS.COMPLETED, 'out');
      expect(completedMatches).toHaveLength(1);
      expect(completedMatches[0].title).toBe('Plan team outing');
    });
  });

  describe('sortTasks', () => {
    it('sorts the All tab by due date: soonest first, no date last', () => {
      const sorted = sortTasks(starterTasks, SORT_OPTIONS.DUE_DATE);
      const titles = sorted.map((t) => t.title);

      expect(titles).toEqual([
        'Set up project repo',
        'Fix checkout bug',
        'Design login screen',
        'Write API docs',
        'Plan team outing',
      ]);
    });

    it('sorts by priority: High first, then Medium, then Low', () => {
      const sorted = sortTasks(starterTasks, SORT_OPTIONS.PRIORITY);
      const priorities = sorted.map((t) => t.priority);

      expect(priorities).toEqual(['High', 'High', 'Medium', 'Low', 'Low']);
    });

    it('preserves order in default sort', () => {
      const sorted = sortTasks(starterTasks, SORT_OPTIONS.DEFAULT);
      expect(sorted.map((t) => t.id)).toEqual([1, 2, 3, 4, 5]);
    });

    it('does not mutate the source array', () => {
      const originalIds = starterTasks.map((t) => t.id);
      sortTasks(starterTasks, SORT_OPTIONS.DUE_DATE);
      expect(starterTasks.map((t) => t.id)).toEqual(originalIds);
    });
  });

  describe('formatDate', () => {
    it('formats ISO dates correctly into readable dates', () => {
      expect(formatDate('2026-01-10')).toBe('Jan 10, 2026');
      expect(formatDate('2027-04-20')).toBe('Apr 20, 2027');
    });

    it('handles null or empty dates gracefully', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate('')).toBe('');
    });
  });
});
