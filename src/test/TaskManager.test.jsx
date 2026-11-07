import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from '../App';
import { STORAGE_KEY } from '../constants';

const starterTasks = [
  { id: 1, title: 'Set up project repo', priority: 'High', dueDate: '2026-01-10', completed: true },
  { id: 2, title: 'Design login screen', priority: 'Medium', dueDate: '2027-03-12', completed: false },
  { id: 3, title: 'Write API docs', priority: 'Low', dueDate: '2027-04-20', completed: false },
  { id: 4, title: 'Fix checkout bug', priority: 'High', dueDate: '2026-01-15', completed: false },
  { id: 5, title: 'Plan team outing', priority: 'Low', dueDate: null, completed: true },
];

describe('TaskManager App Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();

    // Default mock fetch responding with starter data
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => JSON.parse(JSON.stringify(starterTasks)),
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('1. First load: loads tasks.json with fetch and displays tasks', async () => {
    render(<App />);

    // Shows loading skeleton or text initially
    expect(screen.getByText(/Loading tasks.../i)).toBeInTheDocument();

    // After fetch resolves, starter tasks are visible
    await waitFor(() => {
      expect(screen.getByText('Fix checkout bug')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith('/tasks.json');
  });

  it('1b. First load error: shows error message with Retry button, clicking Retry retries fetch', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load tasks/i)).toBeInTheDocument();
    });

    const retryBtn = screen.getByRole('button', { name: /Retry/i });
    expect(retryBtn).toBeInTheDocument();

    // Mock successful fetch on retry
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => JSON.parse(JSON.stringify(starterTasks)),
    });

    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByText('Fix checkout bug')).toBeInTheDocument();
    });
  });

  it('2. Saving: saves changes to localStorage and on next visit loads from localStorage without fetch', async () => {
    // Put existing data in localStorage
    const savedTasks = [
      { id: 99, title: 'Locally saved task', priority: 'Medium', dueDate: null, completed: false },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTasks));

    render(<App />);

    // Should load immediately from localStorage without calling fetch
    await waitFor(() => {
      expect(screen.getByText('Locally saved task')).toBeInTheDocument();
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('3. Add a task: validates title (error on blank/spaces), submits on Enter', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Fix checkout bug')).toBeInTheDocument();
    });

    const titleInput = screen.getByPlaceholderText(/What needs to be done/i);

    // Try submitting blank title
    fireEvent.change(titleInput, { target: { value: '   ' } });
    fireEvent.keyDown(titleInput, { key: 'Enter', code: 'Enter' });
    fireEvent.submit(titleInput.closest('form'));

    expect(screen.getByText(/Task title is required/i)).toBeInTheDocument();

    // Submit valid task
    fireEvent.change(titleInput, { target: { value: 'New Test Task' } });
    fireEvent.submit(titleInput.closest('form'));

    await waitFor(() => {
      expect(screen.getByText('New Test Task')).toBeInTheDocument();
    });

    // Check localStorage was updated
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved.some((t) => t.title === 'New Test Task')).toBe(true);
  });

  it('4. Starter data verification: counter shows 3 tasks left, only Fix checkout bug shows Overdue', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Fix checkout bug')).toBeInTheDocument();
    });

    // Counter: "3 tasks left"
    const counter = screen.getByTestId('tasks-counter');
    expect(counter).toHaveTextContent('3 tasks left');

    // Overdue badge: only 1 overdue badge
    const overdueBadges = screen.getAllByText(/Overdue/i);
    expect(overdueBadges).toHaveLength(1);

    // Completed tasks (Set up project repo, Plan team outing) are struck through
    const repoTaskTitle = screen.getByText('Set up project repo');
    expect(repoTaskTitle).toHaveClass('line-through');

    const checkoutBugTitle = screen.getByText('Fix checkout bug');
    expect(checkoutBugTitle).not.toHaveClass('line-through');
  });

  it('5. In-place edit: Enter saves, Escape cancels, blank title not allowed', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Design login screen')).toBeInTheDocument();
    });

    const editBtn = screen.getByRole('button', { name: /Edit "Design login screen"/i });
    fireEvent.click(editBtn);

    const editInput = screen.getByLabelText(/Edit task title/i);
    expect(editInput).toBeInTheDocument();

    // Blank edit title shows error
    fireEvent.change(editInput, { target: { value: '   ' } });
    fireEvent.keyDown(editInput, { key: 'Enter', code: 'Enter' });
    expect(screen.getByText(/Title cannot be blank/i)).toBeInTheDocument();

    // Cancel edit with Escape
    fireEvent.keyDown(editInput, { key: 'Escape', code: 'Escape' });
    expect(screen.getByText('Design login screen')).toBeInTheDocument();

    // Re-enter edit mode and save
    fireEvent.click(screen.getByRole('button', { name: /Edit "Design login screen"/i }));
    const editInput2 = screen.getByLabelText(/Edit task title/i);
    fireEvent.change(editInput2, { target: { value: 'Design modern login screen' } });
    fireEvent.keyDown(editInput2, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('Design modern login screen')).toBeInTheDocument();
    });
  });

  it('6. Delete task: requires confirmation modal before deletion', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Plan team outing')).toBeInTheDocument();
    });

    const deleteBtn = screen.getByRole('button', { name: /Delete "Plan team outing"/i });
    fireEvent.click(deleteBtn);

    // Confirmation modal is visible
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete this task/i)).toBeInTheDocument();

    // Confirm deletion
    const confirmDeleteBtn = screen.getByRole('button', { name: /^Delete Task$/i });
    fireEvent.click(confirmDeleteBtn);

    await waitFor(() => {
      expect(screen.queryByText('Plan team outing')).not.toBeInTheDocument();
    });
  });

  it('7 & 8. Filtering, Searching, and Sorting', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Fix checkout bug')).toBeInTheDocument();
    });

    // Click Active tab: should show 3 tasks
    const activeTab = screen.getByRole('button', { name: /Active/i });
    fireEvent.click(activeTab);

    expect(screen.getByText('Design login screen')).toBeInTheDocument();
    expect(screen.getByText('Write API docs')).toBeInTheDocument();
    expect(screen.getByText('Fix checkout bug')).toBeInTheDocument();
    expect(screen.queryByText('Set up project repo')).not.toBeInTheDocument();

    // Search for "checkout" inside Active tab
    const searchInput = screen.getByPlaceholderText(/Search tasks by title/i);
    fireEvent.change(searchInput, { target: { value: 'checkout' } });

    expect(screen.getByText('Fix checkout bug')).toBeInTheDocument();
    expect(screen.queryByText('Design login screen')).not.toBeInTheDocument();

    // Clear search and switch to All tab
    fireEvent.change(searchInput, { target: { value: '' } });
    const allTab = screen.getByRole('button', { name: /All/i });
    fireEvent.click(allTab);

    // Sort by due date
    const sortSelect = screen.getByLabelText(/Sort tasks/i);
    fireEvent.change(sortSelect, { target: { value: 'dueDate' } });

    // The order should be: Set up project repo, Fix checkout bug, Design login screen, Write API docs, Plan team outing
    const taskItems = screen.getAllByRole('listitem');
    const titles = taskItems.map((item) => item.querySelector('.break-words')?.textContent);

    expect(titles).toEqual([
      'Set up project repo',
      'Fix checkout bug',
      'Design login screen',
      'Write API docs',
      'Plan team outing',
    ]);
  });
});
