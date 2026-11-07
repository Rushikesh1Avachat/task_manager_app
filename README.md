# TaskFlow: Task Manager Web Application

> **React Intern Project**: Built strictly with **React 19 + Vite**, function components, and pure React hooks (`useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`, `useContext`).
> No backend, no Redux/external state managers, and no component UI libraries (MUI, Ant, Chakra).

---

## 🚀 Quick Start

The app runs with standard Node commands and zero additional setup:

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Run all unit and integration tests (Vitest + RTL)
npm run test

# 4. Run linter
npm run lint

# 5. Build for production
npm run build
```

---

## 🪝 Custom Hooks (`src/hooks/`)

A dedicated `hooks` directory organizes all reusable state and lifecycle logic into clean, modular custom hooks:

1. **`useTasks` (`src/hooks/useTasks.js`)**:
   - Accesses the central `TaskContext` with safety verification (throws clear error if rendered outside provider).
   - Provides tasks data, filtered & sorted list, counts, `addTask`, `toggleTask`, `updateTaskTitle`, `deleteTask`, and `restoreTask`.
2. **`useTheme` (`src/hooks/useTheme.js`)**:
   - Manages light/dark mode preference, automatically detecting system preference (`prefers-color-scheme`) and synchronizing with `localStorage`.
   - Adds/removes the `.dark` class on `document.documentElement`.
3. **`useNavigation` (`src/hooks/useNavigation.js`)**:
   - Handles client-side view switching between **Tasks**, **Analytics**, and **About** pages.
   - Synchronizes with `window.location.hash` (`#tasks`, `#analytics`, `#about`) for browser history, reload persistence, and shareable links.
4. **`useLocalStorage` (`src/hooks/useLocalStorage.js`)**:
   - A generic, resilient custom hook for syncing any React state to `localStorage` with JSON serialization and try/catch error boundaries.
5. **Barrel Export (`src/hooks/index.js`)**:
   - Allows clean multi-hook imports anywhere in the app:
     ```javascript
     import { useTasks, useTheme, useNavigation } from '../hooks';
     ```

---

## 📌 Features & Graded Requirements

### 1. First Load & Fetch
- On the very first visit, loads starter data from `/tasks.json` with native `fetch`.
- Displays a clean loading skeleton while fetching.
- If the network fails or returns an error status, displays an error message with a **Retry** button.

### 2. LocalStorage Persistence
- Every change (add, toggle, edit, delete, restore) immediately syncs to `localStorage`.
- On subsequent visits or reloads, data loads directly from `localStorage` without re-fetching the JSON file.

### 3. Add Task
- Requires a title (blank or whitespace-only inputs trigger validation and error feedback).
- Priority options: **Low**, **Medium**, **High** (defaults to **Medium**).
- Optional date picker for due date (`YYYY-MM-DD`).
- Pressing **Enter** inside the input submits the form.

### 4. Task List & Styling
- Each task displays its title, priority badge with custom color coding, formatted due date (e.g., `Jan 15, 2026`), and a custom checkbox.
- Completed tasks are struck through with reduced opacity.

### 5. In-Place Title Editing
- Click the pencil icon (or double-click the task title) to edit in place.
- Press **Enter** to save changes, or **Escape** to cancel.
- Blank or whitespace-only titles are disallowed with immediate validation.

### 6. Delete Confirmation & 5-Second Undo
- Clicking delete prompts a confirmation modal to avoid accidental deletions.
- When confirmed, `react-hot-toast` displays a notification with a **5-second Undo button**, allowing instantaneous restoration of the task to its exact position!

### 7. Filter Tabs & Dynamic Counter
- Tabs for **All**, **Active**, and **Completed** with live count badges.
- Counter dynamically shows remaining incomplete tasks (e.g., `3 tasks left` or `1 task left`).

### 8. Search & Sort
- Case-insensitive search by task title that composes smoothly with the active filter tab.
- Sort dropdown:
  - **Default Sort**: Preserves creation/starter order.
  - **Due date (soonest first)**: Soonest upcoming dates first; tasks without due dates are placed last.
  - **Priority (High first)**: High &rarr; Medium &rarr; Low.

### 9. Overdue Detection & Responsive Layout
- Incomplete tasks whose due date is strictly before today's date display a prominent red **Overdue** badge with warning icon.
- Completed tasks past their due date do not show Overdue.
- Responsive layout engineered for 375px mobile screens up to desktop monitors.

---

## 🌟 Pages & Navigation (React Router Dom)

Declarative routing powered by **React Router Dom** (`BrowserRouter`, `Routes`, `Route`, `NavLink`, `Link`, and `useNavigate`):

1. **Tasks Page (`/` and `/tasks`)** (`src/pages/TasksPage.jsx`):
   - The primary task management interface with the creation form, search/sort controls, filter tabs, and task list.
2. **Analytics Page (`/analytics`)** (`src/pages/AnalyticsPage.jsx`):
   - Visual dashboard computing live productivity metrics:
     - Total, active, completed, and overdue task counters.
     - Overall completion percentage bar.
     - Distribution breakdown across High, Medium, and Low priorities.
     - Urgent Overdue Deadlines attention panel with one-click completion.
3. **About & Spec Page (`/about`)** (`src/pages/AboutPage.jsx`):
   - Comprehensive documentation listing all 9 graded requirements, bonus features, architecture notes, and keyboard shortcuts guide.
4. **404 Not Found Page (`*`)** (`src/pages/NotFoundPage.jsx`):
   - Friendly fallback view for unknown routes showing the attempted path.
   - Quick navigation buttons ("Back to Tasks", "Go Back").
   - Helpful destination cards linking directly to Tasks, Analytics, and Documentation.

### ⚡ Batch Actions & Data Portability (Bonus Tools)
- **Clear Completed Tasks**: Instant batch cleanup of finished items with a 5-second Undo toast.
- **Mark All Complete / Active**: Single-click toggling for whole task lists with Undo protection.
- **JSON Export & Import**: Backup tasks to `.json` file or restore/import tasks from any exported file.
- **Live Completion Bar**: Visual indicator showing real-time task completion percentage.

---

## 🔔 React Hot Toast Notifications

`react-hot-toast` is integrated for feedback across all interactions:
- **Task Added**: Success toast confirming task creation.
- **Task Completed / Reopened**: Distinct celebration toasts.
- **Task Title Edited**: Success toast when saved.
- **Task Deleted**: 5-second toast containing an **Undo** action button.
- **Validation Alerts**: Toast alerts when empty titles are submitted.
- **Starter Data Reset**: Notification when data is restored to initial starter state.
- **Fetch Errors**: Error notification if fetching fails.

---

## 🦶 Comprehensive Footer (`/components/Footer.jsx`)

- **Branding & Spec Verification**: Quick summary and verification badges.
- **Live Task Metrics**: Real-time completion progress bar, active/completed/total counts.
- **Keyboard Shortcuts Legend**: `Enter` to save/add, `Esc` to cancel, `Tab` for accessibility.
- **Quick Page Navigation**: Direct links to switch between Tasks, Analytics, and About views.

---

## 🎨 Theme & Accessibility (Bonus Features)

- **Light / Dark Mode**: Toggle between light and dark themes; remembers choice in `localStorage`.
- **Keyboard Accessibility**: Focus rings on interactive elements, real `<button>` elements, full `Enter` and `Escape` support.
- **Unit & Integration Tests**: Automated tests written with **Vitest** and **React Testing Library**, verifying all edge cases, filters, sorting algorithms, custom hooks, and page navigation.
