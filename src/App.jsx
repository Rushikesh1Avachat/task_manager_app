import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { TaskProvider } from './context/TaskContext';
import { useTasks, useTheme } from './hooks';
import Header from './components/Header';
import Footer from './components/Footer';
import TasksPage from './pages/TasksPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import ConfirmModal from './components/ConfirmModal';

function TaskManagerContent({ isDark, onToggleTheme }) {
  const { deleteTask } = useTasks();
  const [taskToDelete, setTaskToDelete] = useState(null);

  const handleRequestDelete = (task) => {
    setTaskToDelete(task);
  };

  const handleConfirmDelete = (id) => {
    deleteTask(id);
    setTaskToDelete(null);
  };

  const handleCancelDelete = () => {
    setTaskToDelete(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Toast Notifications Provider */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          className:
            '!bg-white dark:!bg-slate-800 !text-slate-800 dark:!text-slate-100 !border !border-slate-200 dark:!border-slate-700 !shadow-lg !rounded-xl !text-xs !font-medium',
        }}
      />

      {/* Header Bar with React Router Dom Navigation */}
      <Header
        isDark={isDark}
        onToggleTheme={onToggleTheme}
      />

      {/* Main Page View with Declarative React Router Dom Routes */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:px-6">
        <Routes>
          <Route path="/" element={<TasksPage onRequestDelete={handleRequestDelete} />} />
          <Route path="/tasks" element={<TasksPage onRequestDelete={handleRequestDelete} />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Comprehensive Footer with NavLinks */}
      <Footer />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(taskToDelete)}
        task={taskToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default function App() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <TaskProvider>
        <TaskManagerContent isDark={isDark} onToggleTheme={toggleTheme} />
      </TaskProvider>
    </BrowserRouter>
  );
}
