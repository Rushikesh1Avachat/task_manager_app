import TaskForm from '../components/TaskForm';
import TaskControls from '../components/TaskControls';
import TaskList from '../components/TaskList';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import { useTasks } from '../hooks';

export default function TasksPage({ onRequestDelete }) {
  const { loading, error } = useTasks();

  return (
    <div className="space-y-5">
      {/* Task Creation Form */}
      <section aria-label="Add new task">
        <TaskForm />
      </section>

      {/* Task List Section */}
      <section aria-label="Task list" className="space-y-4">
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorMessage />
        ) : (
          <>
            <TaskControls />
            <TaskList onRequestDelete={onRequestDelete} />
          </>
        )}
      </section>
    </div>
  );
}
