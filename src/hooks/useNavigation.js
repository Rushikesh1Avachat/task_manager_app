import { useState, useEffect, useCallback } from 'react';

const DEFAULT_VALID_PAGES = ['tasks', 'analytics', 'about'];

/**
 * Custom hook for client-side page and tab routing.
 * Synchronizes view state with window.location.hash for bookmarking and history.
 *
 * @param {string} [defaultPage='tasks'] - Fallback page
 * @param {Array<string>} [validPages] - Allowed page identifiers
 * @returns {{ currentPage: string, navigate: (page: string) => void }}
 */
export function useNavigation(defaultPage = 'tasks', validPages = DEFAULT_VALID_PAGES) {
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (validPages.includes(hash)) {
        return hash;
      }
    }
    return defaultPage;
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [validPages]);

  const navigate = useCallback((page) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.location.hash = page;
    }
  }, []);

  return { currentPage, navigate };
}

export default useNavigation;

