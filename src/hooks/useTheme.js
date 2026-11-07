import { useState, useEffect } from 'react';
import { THEME_STORAGE_KEY } from '../constants';

/**
 * Custom hook to manage light and dark mode theme.
 * Synchronizes with localStorage and system prefers-color-scheme.
 *
 * @returns {{ isDark: boolean, toggleTheme: () => void, setIsDark: Function }}
 */
export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved !== null) {
        return saved === 'dark';
      }
      if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    } catch (err) {
      console.warn('Failed to read theme from localStorage:', err);
    }
    return false;
  });

  useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem(THEME_STORAGE_KEY, 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem(THEME_STORAGE_KEY, 'light');
      }
    } catch (err) {
      console.error('Failed to save theme to localStorage:', err);
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return { isDark, toggleTheme, setIsDark };
}

export default useTheme;

