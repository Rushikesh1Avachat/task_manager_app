import '@testing-library/jest-dom';
import { afterEach } from 'vitest';

// Mock window.matchMedia for JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

afterEach(() => {
  if (typeof window !== 'undefined' && window.history) {
    window.history.pushState(null, '', '/');
  }
});
