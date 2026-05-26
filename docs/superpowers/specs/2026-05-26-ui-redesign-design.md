# UI Redesign Design

## Goal

Redesign the existing Team Task Manager frontend so it looks like a different assessment submission while preserving the current product behavior. The redesign is UI-only: routes, Redux slices, API calls, backend behavior, role permissions, and form workflows remain unchanged.

## Selected Direction

Use a minimal corporate workspace design.

The app will move away from the current dark, glassy interface and become a light productivity dashboard with a fixed desktop sidebar, clean white panels, slate text, blue accents, subtle borders, and professional spacing. The result should feel assessment-ready, polished, and clearly distinct from other versions without introducing new features.

## Scope

In scope:

- Redesign global layout, navigation, page backgrounds, typography, cards, buttons, inputs, badges, modals, and empty/loading states.
- Convert authenticated desktop layout from top navigation to a left sidebar workspace.
- Keep mobile navigation usable with a compact top layout and accessible links.
- Restyle auth, dashboard, projects, project detail, tasks, task cards, and task/project forms.
- Preserve existing element IDs that may be used by tests or assessment checks, including `login-submit`, `signup-submit`, `create-project-btn`, `create-task-btn`, and `logout-btn`.

Out of scope:

- Backend changes.
- API contract changes.
- New product features.
- Renaming the product or adding personal branding in the UI.
- Dependency upgrades or audit fixes unless required for the redesign to build.

## Visual System

Use a light corporate palette:

- Background: `slate-50` or equivalent soft off-white.
- Panels: white with light slate borders.
- Primary action: blue.
- Secondary action: white or very light slate with slate border.
- Danger action: red.
- Text: slate hierarchy, with strong headings and muted supporting copy.
- Status colors: neutral for todo, amber for in-progress, emerald for done, red for overdue.

Shared utility classes should be updated in `frontend/src/index.css` so existing components inherit the new system consistently. Tailwind config may be adjusted only if useful for clearer color naming or font setup.

## Layout

Authenticated desktop layout:

- Fixed left sidebar with app mark, navigation links, user role/name, and logout.
- Main content area offset to the right with consistent page padding.
- Page headers use a clear title, short description, and primary action when relevant.

Authenticated mobile layout:

- Compact top navigation with brand, logout/user controls, and horizontal route links.
- Content remains full width with responsive padding.

Public auth layout:

- Split-screen style on larger screens with an informational brand panel and a clean form panel.
- Single-column stacked layout on mobile.

## Screen Designs

### Login and Signup

Login and signup pages should use a polished corporate onboarding layout. Forms remain functionally identical, but styling changes to light panels, clearer labels, stronger calls to action, and better spacing.

### Dashboard

The dashboard should present a professional overview:

- KPI cards for total, todo, in-progress, done, and overdue tasks.
- Recent tasks in a structured list panel.
- Overdue tasks in a secondary alert-style panel.
- Quick links styled as action cards.

### Projects

The project list should use clean project cards with visible title, description, member avatars, and a clear view action. The create project modal should match the new light design system.

### Project Detail

The project detail page should feel like a workspace board:

- Header panel with project metadata and edit action for admins.
- Task columns for todo, in-progress, and done using light cards and clear status headers.
- Member panel with avatars, roles, and add/remove member controls.
- Task form modal should match the rest of the interface.

### Tasks

The tasks page should become a clean work queue:

- Filter panel with status and project selects.
- Responsive task card grid.
- Task cards with clear title, description, status badge, due date, assignee, and admin actions.
- Create task modal should keep the existing workflow and fields.

## Data And Behavior

No data-flow changes are planned. Existing Redux thunks and selectors remain the source of truth. Components may be reorganized only as needed for presentation clarity, but behavior must stay the same:

- Auth redirects remain unchanged.
- Admin/member role permissions remain unchanged.
- Project create/edit/delete/member flows remain unchanged.
- Task create/edit/delete/status flows remain unchanged.
- Existing route paths remain unchanged.

## Error, Loading, And Empty States

Existing error messages should remain visible, but styling should match the light system. Loading states should use light skeleton cards or subtle status text. Empty states should be calm and assessment-friendly, with concise guidance but no new workflows.

## Verification

The redesign is acceptable when:

- The app builds with `npm run build --prefix frontend`.
- Frontend lint passes with `npm run lint --prefix frontend`.
- Backend syntax/module loading still passes with the existing backend check.
- Desktop and mobile layouts remain usable by visual inspection.
- Existing assessment-sensitive IDs remain present.
