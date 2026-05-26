# UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the existing frontend into a light corporate sidebar workspace while preserving current routes, API calls, Redux behavior, roles, and assessment-sensitive element IDs.

**Architecture:** Keep the current React/Vite/Redux file structure and redesign in place. Centralize the new light design system in `frontend/src/index.css`, then update each screen to use the same shared utilities and responsive layout. No backend or API contract changes.

**Tech Stack:** React 19, Vite, Redux Toolkit, React Router, Tailwind CSS, Express/SQLite backend unchanged.

---

## File Map

- Modify `frontend/src/index.css`: replace dark theme component utilities with light corporate utilities.
- Modify `frontend/tailwind.config.js`: update theme colors to corporate blue/slate while preserving existing `primary` and `dark` names for compatibility.
- Modify `frontend/src/App.jsx`: change authenticated layout wrapper to support sidebar desktop layout and mobile top navigation through `Navbar`.
- Modify `frontend/src/components/Navbar.jsx`: redesign as responsive desktop sidebar plus mobile header/navigation.
- Modify `frontend/src/modules/auth/LoginPage.jsx`: restyle login page as corporate onboarding.
- Modify `frontend/src/modules/auth/SignupPage.jsx`: restyle signup page as corporate onboarding.
- Modify `frontend/src/modules/dashboard/DashboardPage.jsx`: restyle overview cards, recent tasks, overdue tasks, and quick links.
- Modify `frontend/src/modules/projects/ProjectList.jsx`: restyle project grid and create modal.
- Modify `frontend/src/modules/projects/ProjectDetail.jsx`: restyle project workspace board and member panel.
- Modify `frontend/src/modules/tasks/TasksPage.jsx`: restyle filters, work queue, empty/loading states, and create modal.
- Modify `frontend/src/modules/tasks/TaskCard.jsx`: restyle task cards and action controls.
- Modify `frontend/src/modules/tasks/TaskForm.jsx`: restyle task form using shared input/buttons without changing submit behavior.

## Task 1: Light Design System And App Shell

**Files:**
- Modify: `frontend/src/index.css`
- Modify: `frontend/tailwind.config.js`
- Modify: `frontend/src/App.jsx`
- Modify: `frontend/src/components/Navbar.jsx`

- [ ] **Step 1: Run baseline lint/build checks**

Run:

```bash
npm run lint --prefix frontend
npm run build --prefix frontend
```

Expected: both commands exit 0 before redesign work starts.

- [ ] **Step 2: Update shared CSS utilities**

Replace the component classes in `frontend/src/index.css` with light equivalents:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { @apply scroll-smooth; }
  body { @apply bg-slate-50 text-slate-900 font-sans antialiased; }
}

@layer components {
  .btn-primary { @apply inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary-600/20 transition-all duration-200 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50; }
  .btn-secondary { @apply inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2; }
  .btn-danger { @apply inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2; }
  .card { @apply rounded-2xl border border-slate-200 bg-white p-6 shadow-sm; }
  .input { @apply w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 disabled:cursor-not-allowed disabled:bg-slate-100; }
  .label { @apply mb-1.5 block text-sm font-semibold text-slate-700; }
  .badge-todo { @apply inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600; }
  .badge-progress { @apply inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700; }
  .badge-done { @apply inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700; }
  .badge-overdue { @apply inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700; }
  .badge-admin { @apply inline-flex items-center rounded-full bg-primary-100 px-2.5 py-1 text-xs font-semibold text-primary-700; }
  .badge-member { @apply inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600; }
}
```

- [ ] **Step 3: Update Tailwind colors while keeping compatibility names**

Keep existing `primary` and `dark` keys but make them compatible with the new palette:

```js
colors: {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  dark: {
    900: '#f8fafc',
    800: '#ffffff',
    700: '#f1f5f9',
    600: '#e2e8f0',
  },
}
```

- [ ] **Step 4: Redesign App layout wrapper**

Set authenticated pages on a light shell with desktop sidebar offset:

```jsx
function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="min-h-screen px-4 py-6 sm:px-6 lg:ml-72 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 5: Redesign Navbar as sidebar plus mobile top nav**

Implement desktop sidebar with `hidden lg:flex`, mobile top bar with `lg:hidden`, keep `logout-btn`, keep routes `/dashboard`, `/projects`, and `/tasks`, and keep `dispatch(logout())` plus `navigate('/login')` behavior.

- [ ] **Step 6: Run lint after shell changes**

Run:

```bash
npm run lint --prefix frontend
```

Expected: exit 0.

## Task 2: Auth Pages

**Files:**
- Modify: `frontend/src/modules/auth/LoginPage.jsx`
- Modify: `frontend/src/modules/auth/SignupPage.jsx`

- [ ] **Step 1: Preserve behavior and IDs**

Before editing, verify these remain in the final files:

```jsx
id="login-submit"
id="signup-submit"
dispatch(loginUser(form))
dispatch(signupUser(form))
dispatch(clearError())
```

- [ ] **Step 2: Restyle LoginPage**

Use a light split-screen layout with a brand/info panel and a white form card. Keep the existing form fields, `handleChange`, `handleSubmit`, error rendering, route link to `/signup`, and token redirect.

- [ ] **Step 3: Restyle SignupPage**

Use the same split-screen pattern. Keep the full name, email, password, role fields, `handleChange`, `handleSubmit`, error rendering, route link to `/login`, and token redirect.

- [ ] **Step 4: Run lint for auth changes**

Run:

```bash
npm run lint --prefix frontend
```

Expected: exit 0.

## Task 3: Dashboard Redesign

**Files:**
- Modify: `frontend/src/modules/dashboard/DashboardPage.jsx`

- [ ] **Step 1: Preserve data behavior**

Keep this data flow unchanged:

```jsx
useEffect(() => { dispatch(fetchDashboard()); }, [dispatch]);
const overdueTasks = dashboard?.tasks?.filter((t) => t.isOverdue) || [];
const recentTasks = dashboard?.tasks?.slice(0, 8) || [];
```

- [ ] **Step 2: Redesign stat cards**

Update `StatCard` to light cards with label, value, icon, and subtle accent color. Keep all five metrics: total, todo, in-progress, done, overdue.

- [ ] **Step 3: Redesign task panels**

Use a two-column desktop layout with recent tasks as the larger panel and overdue tasks as an alert panel. Keep links to `/tasks` and `/projects`.

- [ ] **Step 4: Run lint after dashboard changes**

Run:

```bash
npm run lint --prefix frontend
```

Expected: exit 0.

## Task 4: Projects And Project Detail Redesign

**Files:**
- Modify: `frontend/src/modules/projects/ProjectList.jsx`
- Modify: `frontend/src/modules/projects/ProjectDetail.jsx`

- [ ] **Step 1: Preserve project behaviors and IDs**

Keep these behaviors and IDs unchanged:

```jsx
id="create-project-btn"
dispatch(fetchProjects())
dispatch(createProject(form))
dispatch(deleteProject(id))
dispatch(fetchProject(id))
dispatch(fetchTasks({ projectId: id }))
dispatch(addMember({ projectId: id, userId }))
dispatch(removeMember({ projectId: id, uid }))
dispatch(updateProject({ id: Number(id), ...projectForm }))
```

- [ ] **Step 2: Restyle ProjectList**

Use a page header, white project cards, visible member avatar stack, clear `View` link, styled empty/loading states, and a light modal for project creation.

- [ ] **Step 3: Restyle ProjectDetail**

Use a project header panel, three task columns, and a member sidebar panel. Preserve the existing edit-project behavior that sets `projectForm` when the edit button is clicked.

- [ ] **Step 4: Run lint after project changes**

Run:

```bash
npm run lint --prefix frontend
```

Expected: exit 0.

## Task 5: Tasks And Task Form Redesign

**Files:**
- Modify: `frontend/src/modules/tasks/TasksPage.jsx`
- Modify: `frontend/src/modules/tasks/TaskCard.jsx`
- Modify: `frontend/src/modules/tasks/TaskForm.jsx`

- [ ] **Step 1: Preserve task behaviors and IDs**

Keep these behaviors and IDs unchanged:

```jsx
id="create-task-btn"
dispatch(fetchTasks())
dispatch(fetchProjects())
dispatch(createTask({ ...data, projectId: Number(selectedProjectId) }))
dispatch(setFilters(params))
dispatch(updateTaskStatus({ id: task.id, status }))
dispatch(deleteTask(task.id))
dispatch(updateTask({ id: task.id, ...payload }))
```

- [ ] **Step 2: Restyle TaskCard**

Use a white card with task title, optional description, status badge button, overdue badge, due date, assignee avatar, and admin edit/delete buttons.

- [ ] **Step 3: Restyle TasksPage**

Use a page header, filter panel, responsive task grid, polished empty/loading states, and light create-task modal. Keep project selector above `TaskForm` in the modal.

- [ ] **Step 4: Restyle TaskForm**

Keep current form state initialization and submit behavior. Update only layout, labels, fields, helper copy, and action button styling through shared classes.

- [ ] **Step 5: Run lint after task changes**

Run:

```bash
npm run lint --prefix frontend
```

Expected: exit 0.

## Task 6: Final Verification

**Files:**
- Review: all modified frontend files

- [ ] **Step 1: Verify assessment-sensitive IDs remain present**

Run:

```bash
rg "login-submit|signup-submit|create-project-btn|create-task-btn|logout-btn" frontend/src
```

Expected: all five IDs are found.

- [ ] **Step 2: Run final frontend lint**

Run:

```bash
npm run lint --prefix frontend
```

Expected: exit 0.

- [ ] **Step 3: Run final frontend build**

Run:

```bash
npm run build --prefix frontend
```

Expected: Vite build exits 0 and writes `frontend/dist`.

- [ ] **Step 4: Recheck backend load**

Run from `backend`:

```bash
node --check server.js
node -e "require('dotenv').config(); require('./src/app'); require('./src/config/associations'); console.log('backend app loads')"
```

Expected: syntax check exits 0 and the second command prints `backend app loads`.

- [ ] **Step 5: Inspect git diff**

Run:

```bash
git diff -- frontend/src frontend/tailwind.config.js docs/superpowers
```

Expected: diff only contains UI redesign, spec, and plan changes.

## Self-Review

Spec coverage:

- UI-only redesign is covered by Tasks 1-5.
- Sidebar desktop and mobile top navigation are covered by Task 1.
- Auth, dashboard, projects, project detail, tasks, task cards, and forms are covered by Tasks 2-5.
- No backend/API behavior changes are explicitly preserved in each task and verified in Task 6.
- Assessment-sensitive IDs are preserved and verified in Task 6.

Placeholder scan: no TBD, TODO, or unspecified implementation placeholders remain.

Type and property consistency: plan uses existing component, route, action, and property names from the current codebase.
