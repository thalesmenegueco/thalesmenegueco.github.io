# Project Manager — Implementation Plan

## Overview
Build a minimalist project manager component in the existing Angular 20 standalone app. Data persists in `localStorage`. Each project holds nested checkbox task lists. Standalone (non-project) tasks sit in a "General Tasks" area. Soft pastel-adapted dark palette scoped to this component.

---

## 1. Data Model

```ts
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Pendente' | 'Em andamento' | 'Concluído';
  deadline: string | null;          // ISO date string or ""
  tasks: Task[];
}

interface Task {
  id: string;
  text: string;
  done: boolean;
  subtasks: Task[];                // recursive nesting, max 3 levels in UI
}
```

Top-level state stored as:
```ts
{ projects: Project[]; standaloneTasks: Task[] }
```

IDs generated via `crypto.randomUUID()`.

## 2. Files Changed/Created

| File | Action |
|---|---|
| `src/app/projects/componentized-projects/project-manager/project-manager.ts` | **Rewrite** — full component logic |
| `src/app/projects/componentized-projects/project-manager/project-manager.html` | **Rewrite** — full template |
| `src/app/projects/componentized-projects/project-manager/project-manager.scss` | **Rewrite** — pastel soft-dark styles + responsive |
| `src/app/app-routing.module.ts` | **Edit** — add route `/tools/project-manager` |
| `src/app/projects/projects.ts` | **Edit** — add card entry for the project manager |

## 3. Component Architecture

Single `ProjectManager` standalone component, imports `FormsModule` only.

### Class members (TS)
- `projects: Project[]` — loaded from localStorage on init
- `standaloneTasks: Task[]` — loaded from localStorage on init
- `selectedProjectId: string | null` — currently viewed project
- `showSidebar: boolean` — toggle for mobile view
- `addTaskText: string` — new task input (bound per context)
- Computed getters:
  - `selectedProject: Project | undefined`
  - `projectsByStatus`: groups projects for optional status-filter tabs
- Methods:
  - `loadFromStorage()`, `saveToStorage()`
  - `addProject()`, `editProjectField(project, field, value)`, `deleteProject(id)`
  - `addTask(parentList)`, `toggleTask(task)`, `deleteTask(parentList, taskId)`, `addSubtask(parentTask)`
  - `truncateText(text, limit)` — helper for card previews

### Template structure (HTML)
```
<div class="pm-container">
  <!-- Header bar with title + mobile hamburger toggle -->
  <header class="pm-header">...</header>
  
  <div class="pm-layout" [class.sidebar-visible]="showSidebar">
    <!-- Sidebar: project list + add project form -->
    <aside class="pm-sidebar">
      <!-- Standalone "General Tasks" link -->
      <!-- Project list (filterable by status) -->
      <!-- "New Project" inline form -->
    </aside>
    
    <!-- Main content area -->
    <main class="pm-main">
      <!-- If general tasks selected: standalone task list -->
      <!-- If project selected: project detail + task list -->
      <!-- If nothing selected: empty-state prompt -->
    </main>
  </div>
</div>
```

### UI patterns
- **Task rendering**: recursive `<ng-template>` for nested subtasks (max depth enforced by hiding add-subtask button at level 3)
- **Status badges**: colored pills — rose for "Pendente", amber for "Em andamento", mint for "Concluído"
- **Deadline**: HTML `<input type="date">` with optional clear button
- **Add task**: text input + "Add" button, Enter key submits
- **Checkboxes**: native `<input type="checkbox">` with strikethrough on done tasks
- **Delete**: small trash icon button on hover (projects and tasks)

## 4. Pastel Soft-Dark Palette (scoped to `.pm-container`)

CSS custom properties defined on the host or container:

| Property | Pastel value | Replaces global |
|---|---|---|
| `--pm-bg` | `#1a1a2e` | `--color-bg` (#050505) |
| `--pm-surface` | `#2d2d44` | `--color-surface` (#4B4747) |
| `--pm-surface-hover` | `#3a3a55` | — |
| `--pm-text` | `#e0dce8` | `--color-text` (whitesmoke) |
| `--pm-accent` | `#c4a07a` (warm peach) | `--color-text-accent` (#FFA300) |
| `--pm-secondary` | `#b39dce` (soft lavender) | `--color-text-secondary` (#EC0DCF) |
| `--pm-pending` | `#d4a0a0` (dusty rose) | — |
| `--pm-progress` | `#c4b07a` (muted gold) | — |
| `--pm-done` | `#8cbfa0` (sage green) | — |
| `--pm-border` | `rgba(200, 195, 210, 0.25)` | `--color-border` (white) |
| `--pm-radius` | `12px` | `--radius-card` (40px) |
| `--pm-danger` | `#d48a8a` (soft red) | — |

All hover states use `color-mix(in srgb, var, white 15%)`.

## 5. Responsive Layout

**Desktop (≥768px):**
- Sidebar: fixed `280px` left panel, scrollable project list
- Main: flexible remaining width, scrollable task content
- Two-panel always visible

**Mobile (<768px):**
- Single column, full width
- Hamburger button in header toggles `showSidebar`
- Sidebar overlays or slides in from left when visible
- Main content hides behind sidebar when sidebar shown

## 6. Storage Strategy

- Key: `'project-manager-data'` in `localStorage`
- `JSON.stringify` on every mutation (save after add/edit/delete/toggle)
- `JSON.parse` on component `ngOnInit`
- Fallback to empty `{ projects: [], standaloneTasks: [] }` on first load or parse error

## 7. Route & Card Registration

Add to `app-routing.module.ts`:
```ts
import { ProjectManager } from './projects/componentized-projects/project-manager/project-manager';
// route:
{ path: 'tools/project-manager', component: ProjectManager }
```

Add to `projects.ts` `interests` array:
```ts
{ name: "Project Manager",
  description: 'Minimalist project manager with nested task lists',
  image: 'assets/project-manager-card.png',  // or a placeholder SVG
  link: './tools/project-manager'
}
```

## 8. Implementation Order (13 tasks)

1. **Define TypeScript interfaces** at top of component file (`Project`, `Task`)
2. **Implement storage service** (`loadFromStorage`, `saveToStorage`, `ngOnInit`)
3. **Build sidebar** — project list rendering, status filter tabs, "New Project" form
4. **Build main panel** — project detail view (name, description, status, deadline)
5. **Implement standalone tasks** — General Tasks section in sidebar + main panel
6. **Build recursive task list** — `<ng-template>` for nested checkboxes with add/delete
7. **Add task CRUD** — toggle done, add task, add subtask, delete task
8. **Add project CRUD** — edit fields inline, delete project with confirmation
9. **Apply pastel soft-dark palette** in SCSS
10. **Make responsive** — mobile breakpoint, hamburger toggle, overlay sidebar
11. **Register route** in `app-routing.module.ts`
12. **Add card** in `projects.ts`
13. **Validate** — run `ng build`, test on desktop + mobile viewport

## 9. Validation

- `npx ng build` passes without errors
- Component renders in isolation at `/tools/project-manager`
- Create a project, add nested tasks, toggle checkboxes, delete tasks
- Create standalone tasks, verify they appear independently
- Refresh page — all data persists from localStorage
- Resize to mobile — sidebar toggles, layout adapts
