import { useContext } from 'react';
import { TaskContext } from '../context/taskContextInstance';

/**
 * Custom hook to access the TaskContext.
 * Throws a helpful error if used outside a TaskProvider.
 *
 * @returns {Object} Task context value
 */
export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}

export default useTasks;

