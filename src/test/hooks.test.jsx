import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme, useNavigation, useLocalStorage, useTasks } from '../hooks';
import { TaskProvider } from '../context/TaskContext';
import { THEME_STORAGE_KEY, STORAGE_KEY } from '../constants';

describe('Custom Hooks Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    if (typeof window !== 'undefined') {
      window.location.hash = '';
    }
    vi.restoreAllMocks();

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  afterEach(() => {
    localStorage.clear();
    if (typeof window !== 'undefined') {
      window.location.hash = '';
    }
  });

  describe('useTheme hook', () => {
    it('initializes to false when no localStorage entry exists', () => {
      const { result } = renderHook(() => useTheme());
      expect(result.current.isDark).toBe(false);
    });

    it('toggles theme and updates localStorage', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.isDark).toBe(true);
      expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.isDark).toBe(false);
      expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    });
  });

  describe('useNavigation hook', () => {
    it('initializes with default page and updates with navigate', () => {
      const { result } = renderHook(() => useNavigation('tasks'));
      expect(result.current.currentPage).toBe('tasks');

      act(() => {
        result.current.navigate('analytics');
      });

      expect(result.current.currentPage).toBe('analytics');
      expect(window.location.hash).toBe('#analytics');
    });
  });

  describe('useLocalStorage hook', () => {
    it('reads initial value and stores new values into localStorage', () => {
      const { result } = renderHook(() => useLocalStorage('test_key', 'initial_val'));
      expect(result.current[0]).toBe('initial_val');

      act(() => {
        result.current[1]('updated_val');
      });

      expect(result.current[0]).toBe('updated_val');
      expect(JSON.parse(localStorage.getItem('test_key'))).toBe('updated_val');
    });
  });

  describe('useTasks hook', () => {
    it('throws error when used outside TaskProvider', () => {
      expect(() => {
        renderHook(() => useTasks());
      }).toThrow('useTasks must be used within a TaskProvider');
    });

    it('provides tasks context when used within TaskProvider', () => {
      // Pre-seed storage so no fetch state update occurs during mount
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));

      const wrapper = ({ children }) => <TaskProvider>{children}</TaskProvider>;
      const { result } = renderHook(() => useTasks(), { wrapper });

      expect(result.current).toHaveProperty('tasks');
      expect(result.current).toHaveProperty('addTask');
      expect(result.current).toHaveProperty('toggleTask');
      expect(result.current).toHaveProperty('deleteTask');
    });
  });
});
