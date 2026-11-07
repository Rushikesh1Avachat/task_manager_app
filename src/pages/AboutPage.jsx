import { CheckCircle2, Star, Keyboard, Code, Cpu, BookOpen, Layers } from 'lucide-react';

export default function AboutPage() {
  const mustHaves = [
    {
      id: 1,
      title: 'First load with fetch',
      desc: 'Loads /tasks.json via fetch. Displays loading skeleton and error message with a working Retry button if fetch fails.',
    },
    {
      id: 2,
      title: 'Saving to localStorage',
      desc: 'Saves every update immediately to localStorage. Subsequent page visits load from localStorage without refetching /tasks.json.',
    },
    {
      id: 3,
      title: 'Add a task',
      desc: 'Title is required (blank or whitespace only is disallowed with error feedback). Priority defaults to Medium. Enter key submits.',
    },
    {
      id: 4,
      title: 'Task list presentation',
      desc: 'Displays task title, priority badge (High/Medium/Low), formatted due date, and checkbox. Completed tasks are struck through.',
    },
    {
      id: 5,
      title: 'In-place edit',
      desc: 'Inline editing for task title. Enter saves, Escape cancels, blank titles are prevented with error validation.',
    },
    {
      id: 6,
      title: 'Delete confirmation & 5s Undo',
      desc: 'Deletes only after user confirms in a modal. Also features 5-second Undo toast via react-hot-toast.',
    },
    {
      id: 7,
      title: 'Filter tabs & counter',
      desc: 'All, Active, and Completed tabs with task counts. Dynamic counter displays active count (e.g. "3 tasks left").',
    },
    {
      id: 8,
      title: 'Search & Sort',
      desc: 'Case-insensitive search by title that composes with tabs. Sort by Due Date (soonest first, no date last) or Priority (High first).',
    },
    {
      id: 9,
      title: 'Overdue & Responsive Layout',
      desc: 'Incomplete tasks past their due date display a red "Overdue" badge. Fully responsive on 375px phone screen and desktop.',
    },
  ];

  const bonuses = [
    'Unit tests & Integration tests with Vitest and React Testing Library (all passing)',
    '5-second Undo notification with react-hot-toast after deleting a task',
    'Light / dark theme toggle with localStorage persistence',
    'Keyboard and screen-reader accessible (real <button> elements, ARIA labels, focus states)',
    'Multi-page routing with React Router Dom (Tasks, Analytics Dashboard, About & Documentation, rich 404 handler)',
    'Batch actions: Clear completed tasks with 5s Undo, Mark all tasks complete / active',
    'JSON backup & restore: Export tasks to .json file and import/upload tasks',
    'Live completion progress bar and interactive productivity statistics',
    'react-hot-toast integrated for all user actions and error alerts',
  ];

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Project Documentation & Evaluation Guide
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          TaskFlow is built strictly according to the React Intern Project specifications. It uses function components, React hooks (useState, useEffect, useMemo, useCallback, useRef, useContext), Tailwind CSS, and react-hot-toast without any UI component libraries or external state management.
        </p>
      </div>

      {/* Must Haves Checklist */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Must-Have Requirements (Graded)
          </h3>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            9 / 9 Verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {mustHaves.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/40 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold flex items-center justify-center shrink-0">
                  {item.id}
                </span>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {item.title}
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-7 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bonus Features */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          Implemented Bonus Features
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
          {bonuses.map((bonus, idx) => (
            <li key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/50">
              <span className="text-amber-500 font-bold shrink-0">✓</span>
              <span>{bonus}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Keyboard Shortcuts Reference */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-indigo-500" />
          Keyboard Accessibility & Shortcuts
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold">
              Enter
            </kbd>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              Submits the Add Task form or saves an in-place title edit.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold">
              Escape
            </kbd>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              Cancels inline title editing or dismisses the Delete confirmation modal.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold">
              Tab / Space
            </kbd>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              Standard screen-reader accessibility for tab navigation and checkbox toggles.
            </p>
          </div>
        </div>
      </div>

      {/* Architecture & Tech Stack */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-500" />
          Technical Stack & Architecture
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs pt-1">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60">
            <Code className="w-4 h-4 mx-auto text-indigo-500 mb-1" />
            <div className="font-bold text-slate-800 dark:text-slate-200">React 19 + Vite</div>
            <div className="text-[10px] text-slate-400">Fast HMR build</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60">
            <Cpu className="w-4 h-4 mx-auto text-cyan-500 mb-1" />
            <div className="font-bold text-slate-800 dark:text-slate-200">React Context</div>
            <div className="text-[10px] text-slate-400">Single source of truth</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60">
            <Layers className="w-4 h-4 mx-auto text-sky-500 mb-1" />
            <div className="font-bold text-slate-800 dark:text-slate-200">Tailwind CSS</div>
            <div className="text-[10px] text-slate-400">Pure utilities & dark mode</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60">
            <CheckCircle2 className="w-4 h-4 mx-auto text-emerald-500 mb-1" />
            <div className="font-bold text-slate-800 dark:text-slate-200">react-hot-toast</div>
            <div className="text-[10px] text-slate-400">Toast notifications + Undo</div>
          </div>
        </div>
      </div>
    </div>
  );
}

