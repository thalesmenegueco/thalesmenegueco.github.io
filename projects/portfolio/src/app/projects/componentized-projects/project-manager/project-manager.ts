import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { TimelineViewComponent } from './timeline/timeline-view.component';
import { adaptToTimelineItems, GENERAL_TASKS_GROUP_ID } from './timeline/timeline.adapter';
import type { TimelineItem } from './timeline/timeline.types';

/** Priority of a task, rendered as an icon in the task row. */
export type TaskPriority = 'backlog' | 'low' | 'medium' | 'urgent' | 'quick';

export interface Task {
  id: string;
  text: string;
  done: boolean;
  subtasks: Task[];
  /** Start date in YYYY-MM-DD (inclusive), or null when unscheduled. */
  startDate: string | null;
  /** End date in YYYY-MM-DD (inclusive), or null when unscheduled. */
  endDate: string | null;
  /** ID of the task that must finish before this task starts (finish-to-start). */
  dependsOn: string | null;
  /** Urgency level of the task. */
  priority: TaskPriority;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Pendente' | 'Em andamento' | 'Concluído';
  deadline: string | null;
  tasks: Task[];
}

interface StoredData {
  projects: Project[];
  standaloneTasks: Task[];
}

interface TemplateTask {
  text: string;
  subtasks: TemplateTask[];
  /** Kept so templates remember the priority chosen for each task. */
  priority?: TaskPriority;
}

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  tasks: TemplateTask[];
}

/** Structural shape shared by `Task` and `TemplateTask` for counting helpers. */
interface TaskLike {
  subtasks: TaskLike[];
}

const STORAGE_KEY = 'project-manager-data';
const TEMPLATES_STORAGE_KEY = 'project-manager-templates';
/** UI preference only: which tasks have their subtasks hidden. */
const COLLAPSED_STORAGE_KEY = 'project-manager-collapsed-tasks';

/** Sentinel used by the "move task" picker to target the general tasks list. */
export const GENERAL_TASKS_DESTINATION = '__general-tasks__';

export interface PriorityOption {
  value: TaskPriority;
  icon: string;
  label: string;
}

export const TASK_PRIORITIES: readonly PriorityOption[] = [
  { value: 'backlog', icon: '⚪', label: 'Backlog' },
  { value: 'low', icon: '🔵', label: 'Baixa Pri.' },
  { value: 'medium', icon: '🟣', label: 'Média Pri.' },
  { value: 'urgent', icon: '🟠', label: 'Urgente' },
  { value: 'quick', icon: '⚡', label: '5-10 min para fazer' },
];

@Component({
  selector: 'app-project-manager',
  imports: [FormsModule, NgTemplateOutlet, TimelineViewComponent],
  templateUrl: './project-manager.html',
  styleUrl: './project-manager.scss',
  standalone: true,
})
export class ProjectManager implements OnInit {
  projects: Project[] = [];
  standaloneTasks: Task[] = [];
  selectedProjectId: string | null = null;
  showSidebar = false;
  addTaskText = '';
  editingTaskId: string | null = null;
  editingTaskText = '';
  schedulingTaskId: string | null = null;
  /** Task whose priority picker is expanded, if any. */
  priorityMenuTaskId: string | null = null;
  /** Task whose "move to another project" picker is expanded, if any. */
  moveMenuTaskId: string | null = null;

  readonly priorities: readonly PriorityOption[] = TASK_PRIORITIES;

  templates: ProjectTemplate[] = [];
  showTemplates = false;
  showTimeline = false;
  timelineItems: TimelineItem[] = [];

  /** Id of the task currently being dragged (reorder in progress), if any. */
  draggedTaskId: string | null = null;
  /** Id of the task the drag is hovering over, used to render the drop marker. */
  dropTargetId: string | null = null;
  /** Sibling list the drag started from; drops are only allowed inside it. */
  private draggedList: Task[] | null = null;

  /** Ids of the tasks whose subtasks are currently hidden. */
  collapsedTaskIds = new Set<string>();

  newProjectName = '';
  newProjectDescription = '';
  newProjectTemplateId: string | null = null;
  showNewProjectForm = false;
  editFieldProjectId: string | null = null;
  editFieldName: string | null = null;

  showSaveTemplateForm = false;
  templateName = '';
  templateDescription = '';
  editTemplateFieldId: string | null = null;
  editTemplateFieldName: string | null = null;

  statuses: Project['status'][] = ['Pendente', 'Em andamento', 'Concluído'];
  statusFilter: Project['status'] | 'all' = 'all';

  get selectedProject(): Project | undefined {
    return this.projects.find(p => p.id === this.selectedProjectId);
  }

  get filteredProjects(): Project[] {
    if (this.statusFilter === 'all') {
      return this.projects;
    }
    return this.projects.filter(p => p.status === this.statusFilter);
  }

  get generalTasksCount(): string {
    const total = this.standaloneTasks.length;
    const active = this.standaloneTasks.filter(t => !t.done).length;
    return active < total ? `${active}/${total}` : `${total}`;
  }

  get projectTaskCount(): string {
    const tasks = this.selectedProject?.tasks ?? [];
    const total = tasks.length;
    const active = tasks.filter(t => !t.done).length;
    return active < total ? `${active}/${total}` : `${total}`;
  }

  get templateNameConflict(): boolean {
    const name = this.templateName.trim().toLowerCase();
    if (!name) {
      return false;
    }
    return this.templates.some(
      (t) => t.name.trim().toLowerCase() === name
    );
  }

  ngOnInit(): void {
    this.loadFromStorage();
    this.loadTemplatesFromStorage();
    this.loadCollapsedFromStorage();
  }

  loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        // Normalizing on load backfills fields added after older saves
        // (e.g. task priority) instead of leaving them undefined.
        const data = this.normalizeData(JSON.parse(raw));
        this.projects = data.projects;
        this.standaloneTasks = data.standaloneTasks;
      }
    } catch {
      this.projects = [];
      this.standaloneTasks = [];
    }
  }

  saveToStorage(): void {
    const data: StoredData = {
      projects: this.projects,
      standaloneTasks: this.standaloneTasks,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  loadTemplatesFromStorage(): void {
    try {
      const raw = localStorage.getItem(TEMPLATES_STORAGE_KEY);
      if (raw) {
        this.templates = this.normalizeTemplates(JSON.parse(raw));
      }
    } catch {
      this.templates = [];
    }
  }

  saveTemplatesToStorage(): void {
    localStorage.setItem(
      TEMPLATES_STORAGE_KEY,
      JSON.stringify({ templates: this.templates })
    );
  }

  selectProject(id: string | null): void {
    this.selectedProjectId = id;
    this.showTemplates = false;
    this.showTimeline = false;
    this.showSidebar = false;
  }

  openGeneralTasks(): void {
    this.selectedProjectId = null;
    this.showTemplates = false;
    this.showTimeline = false;
    this.showSidebar = false;
  }

  openTemplates(): void {
    this.showTemplates = true;
    this.showTimeline = false;
    this.showSidebar = false;
  }

  openTimeline(): void {
    this.showTemplates = false;
    this.showTimeline = true;
    this.showSidebar = false;
    this.refreshTimelineItems();
  }

  refreshTimelineItems(): void {
    this.timelineItems = adaptToTimelineItems(this.projects, this.standaloneTasks);
  }

  onTimelineSelectItem(id: string): void {
    if (id === GENERAL_TASKS_GROUP_ID) {
      this.openGeneralTasks();
      return;
    }
    if (this.projects.some((project) => project.id === id)) {
      this.selectProject(id);
    }
    // Task ids have no dedicated detail view in v1; selection highlights the
    // dependency chain in place.
  }

  getSelectedClass(id: string | null): string {
    if (id === null && this.selectedProjectId === null) {
      return 'active';
    }
    if (id !== null && this.selectedProjectId === id) {
      return 'active';
    }
    return '';
  }

  openNewProjectForm(): void {
    this.newProjectName = '';
    this.newProjectDescription = '';
    this.newProjectTemplateId = null;
    this.showNewProjectForm = true;
  }

  cancelNewProject(): void {
    this.showNewProjectForm = false;
    this.newProjectName = '';
    this.newProjectDescription = '';
    this.newProjectTemplateId = null;
  }

  onNewProjectTemplateChange(id: string | null): void {
    this.newProjectTemplateId = id;
    const template = id
      ? this.templates.find((t) => t.id === id)
      : null;
    if (template) {
      this.newProjectName = template.name;
      this.newProjectDescription = template.description;
    }
  }

  addProject(): void {
    const name = this.newProjectName.trim();
    if (!name) return;

    const template = this.newProjectTemplateId
      ? this.templates.find((t) => t.id === this.newProjectTemplateId)
      : null;

    const project: Project = {
      id: crypto.randomUUID(),
      name,
      description: this.newProjectDescription.trim(),
      status: 'Pendente',
      deadline: null,
      tasks: template ? this.instantiateTemplateTasks(template.tasks) : [],
    };

    this.projects.push(project);
    this.newProjectName = '';
    this.newProjectDescription = '';
    this.newProjectTemplateId = null;
    this.showNewProjectForm = false;
    this.showTimeline = false;
    this.selectedProjectId = project.id;
    this.saveToStorage();
  }

  deleteProject(id: string): void {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
    this.projects = this.projects.filter(p => p.id !== id);
    if (this.selectedProjectId === id) {
      this.selectedProjectId = null;
    }
    this.saveToStorage();
  }

  updateProjectStatus(project: Project, status: Project['status']): void {
    project.status = status;
    this.saveToStorage();
  }

  updateProjectDeadline(project: Project, value: string): void {
    project.deadline = value || null;
    this.saveToStorage();
  }

  startEditField(projectId: string, fieldName: string): void {
    this.editFieldProjectId = projectId;
    this.editFieldName = fieldName;
  }

  saveEditField(): void {
    this.editFieldProjectId = null;
    this.editFieldName = null;
    this.saveToStorage();
  }

  cancelEditField(): void {
    this.editFieldProjectId = null;
    this.editFieldName = null;
    this.loadFromStorage();
  }

  onFieldKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEditField();
    } else if (event.key === 'Escape') {
      this.cancelEditField();
    }
  }

  // --- templates: save from a project ---

  openSaveTemplateForm(): void {
    const project = this.selectedProject;
    this.templateName = project?.name ?? '';
    this.templateDescription = project?.description ?? '';
    this.showSaveTemplateForm = true;
  }

  cancelSaveTemplate(): void {
    this.showSaveTemplateForm = false;
    this.templateName = '';
    this.templateDescription = '';
  }

  saveTemplateFromProject(): void {
    const project = this.selectedProject;
    if (!project) return;

    const name = this.templateName.trim();
    if (!name) return;

    const tasks = this.toTemplateTasks(project.tasks);
    const existing = this.templates.find(
      (t) => t.name.trim().toLowerCase() === name.toLowerCase()
    );

    if (existing) {
      existing.name = name;
      existing.description = this.templateDescription.trim();
      existing.tasks = tasks;
    } else {
      this.templates.push({
        id: crypto.randomUUID(),
        name,
        description: this.templateDescription.trim(),
        tasks,
      });
    }

    this.saveTemplatesToStorage();
    this.showSaveTemplateForm = false;
    this.templateName = '';
    this.templateDescription = '';
  }

  // --- templates: use + manage ---

  createProjectFromTemplate(template: ProjectTemplate): void {
    const project: Project = {
      id: crypto.randomUUID(),
      name: template.name,
      description: template.description,
      status: 'Pendente',
      deadline: null,
      tasks: this.instantiateTemplateTasks(template.tasks),
    };

    this.projects.push(project);
    this.saveToStorage();
    this.showTemplates = false;
    this.showTimeline = false;
    this.selectedProjectId = project.id;
    this.showSidebar = false;
  }

  deleteTemplate(id: string): void {
    if (!confirm('Tem certeza que deseja excluir este template?')) return;
    this.templates = this.templates.filter((t) => t.id !== id);
    this.saveTemplatesToStorage();
  }

  startEditTemplateField(templateId: string, fieldName: string): void {
    this.editTemplateFieldId = templateId;
    this.editTemplateFieldName = fieldName;
  }

  saveEditTemplateField(): void {
    this.editTemplateFieldId = null;
    this.editTemplateFieldName = null;
    this.saveTemplatesToStorage();
  }

  cancelEditTemplateField(): void {
    this.editTemplateFieldId = null;
    this.editTemplateFieldName = null;
    this.loadTemplatesFromStorage();
  }

  onTemplateFieldKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEditTemplateField();
    } else if (event.key === 'Escape') {
      this.cancelEditTemplateField();
    }
  }

  // --- templates: helpers ---

  countTasks(tasks: TaskLike[]): number {
    return tasks.reduce(
      (sum, task) => sum + 1 + this.countTasks(task.subtasks),
      0
    );
  }

  private toTemplateTasks(tasks: Task[]): TemplateTask[] {
    return tasks.map((task) => ({
      text: task.text,
      subtasks: this.toTemplateTasks(task.subtasks),
      priority: task.priority,
    }));
  }

  private instantiateTemplateTasks(tasks: TemplateTask[]): Task[] {
    return tasks.map((task) => ({
      id: crypto.randomUUID(),
      text: task.text,
      done: false,
      subtasks: this.instantiateTemplateTasks(task.subtasks),
      startDate: null,
      endDate: null,
      dependsOn: null,
      priority: task.priority ?? 'backlog',
    }));
  }

  addTask(list: Task[], event?: Event): void {
    if (event) event.stopPropagation();
    const text = this.addTaskText.trim();
    if (!text) return;

    list.push({
      id: crypto.randomUUID(),
      text,
      done: false,
      subtasks: [],
      startDate: null,
      endDate: null,
      dependsOn: null,
      priority: 'backlog',
    });

    this.addTaskText = '';
    this.saveToStorage();
  }

  addTaskOnEnter(list: Task[], event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.addTask(list, event);
    }
  }

  toggleTask(task: Task): void {
    task.done = !task.done;
    this.saveToStorage();
  }

  deleteTask(list: Task[], taskId: string, event: MouseEvent): void {
    event.stopPropagation();
    const index = list.findIndex(t => t.id === taskId);
    if (index !== -1) {
      list.splice(index, 1);
      this.saveToStorage();
    }
  }

  addSubtask(parentTask: Task): void {
    const text = prompt('Nome da subtarefa:');
    if (!text || !text.trim()) return;

    parentTask.subtasks.push({
      id: crypto.randomUUID(),
      text: text.trim(),
      done: false,
      subtasks: [],
      startDate: null,
      endDate: null,
      dependsOn: null,
      priority: 'backlog',
    });

    // A hidden new subtask would look like nothing happened: reveal it.
    this.expandTask(parentTask);
    this.saveToStorage();
  }

  addSubtaskAtLevel(parentTask: Task, event: MouseEvent): void {
    event.stopPropagation();
    this.addSubtask(parentTask);
  }

  deleteTaskById(list: Task[], taskId: string, event: MouseEvent): void {
    event.stopPropagation();
    const index = list.findIndex(t => t.id === taskId);
    if (index !== -1) {
      list.splice(index, 1);
      this.saveToStorage();
    }
  }

  toggleTaskById(list: Task[], taskId: string): void {
    const task = list.find(t => t.id === taskId);
    if (task) {
      task.done = !task.done;
      this.saveToStorage();
    }
  }

  // --- tasks: priority ---

  priorityOf(value: TaskPriority): PriorityOption {
    return TASK_PRIORITIES.find((p) => p.value === value) ?? TASK_PRIORITIES[0];
  }

  togglePriorityMenu(task: Task, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.priorityMenuTaskId = this.priorityMenuTaskId === task.id ? null : task.id;
    this.moveMenuTaskId = null;
  }

  setTaskPriority(task: Task, priority: TaskPriority, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    task.priority = priority;
    this.priorityMenuTaskId = null;
    this.saveToStorage();
  }

  // --- tasks: move between projects ---

  /** Destinations offered when moving a task out of the current view. */
  get moveDestinations(): Array<{ key: string; label: string }> {
    const projects = this.projects
      .filter((project) => project.id !== this.selectedProjectId)
      .map((project) => ({ key: project.id, label: project.name }));

    if (this.selectedProjectId !== null) {
      return [
        { key: GENERAL_TASKS_DESTINATION, label: '📋 Tarefas Gerais' },
        ...projects,
      ];
    }
    return projects;
  }

  toggleMoveMenu(task: Task, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.moveMenuTaskId = this.moveMenuTaskId === task.id ? null : task.id;
    this.priorityMenuTaskId = null;
  }

  closeTaskMenus(): void {
    this.priorityMenuTaskId = null;
    this.moveMenuTaskId = null;
  }

  /**
   * Moves a task (with its whole subtree of subtasks) to another project or to
   * the general tasks list. Use `GENERAL_TASKS_DESTINATION` to target the
   * general list; any other key must be a project id.
   */
  moveTask(task: Task, sourceList: Task[], destinationKey: string): void {
    const index = sourceList.findIndex((t) => t.id === task.id);
    if (index === -1) return;

    let destination: Task[] | null = null;
    if (destinationKey === GENERAL_TASKS_DESTINATION) {
      destination = this.standaloneTasks;
    } else {
      destination = this.projects.find((p) => p.id === destinationKey)?.tasks ?? null;
    }
    if (!destination || destination === sourceList) return;

    const [moved] = sourceList.splice(index, 1);
    destination.push(moved);

    // Dependencies are scoped to a project/group: references that now point
    // outside their group are dropped so the timeline never dangles.
    this.pruneDependencies();

    if (this.editingTaskId === task.id) {
      this.cancelEditTask();
    }
    this.closeTaskMenus();
    this.saveToStorage();
  }

  // --- tasks: duplicate ---

  /** Deep-copies a task (and its subtasks) right below it in the same list. */
  duplicateTask(list: Task[], task: Task, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    const index = list.findIndex((t) => t.id === task.id);
    if (index === -1) return;

    const idMap = new Map<string, string>();
    const copy = this.cloneTaskTree(task, idMap);
    this.remapClonedDependencies(copy, idMap);
    list.splice(index + 1, 0, copy);
    // The copy mirrors the original's visibility: collapsed stays collapsed.
    if (this.collapsedTaskIds.has(task.id)) {
      this.collapsedTaskIds.add(copy.id);
      this.saveCollapsed();
    }
    this.closeTaskMenus();
    this.saveToStorage();
  }

  private cloneTaskTree(task: Task, idMap: Map<string, string>): Task {
    const copy: Task = {
      id: crypto.randomUUID(),
      text: task.text,
      done: task.done,
      subtasks: [],
      startDate: task.startDate,
      endDate: task.endDate,
      dependsOn: task.dependsOn,
      priority: task.priority,
    };
    idMap.set(task.id, copy.id);
    copy.subtasks = task.subtasks.map((subtask) => this.cloneTaskTree(subtask, idMap));
    return copy;
  }

  /** Keeps dependencies internal to the copied subtree and drops the rest. */
  private remapClonedDependencies(copy: Task, idMap: Map<string, string>): void {
    for (const task of this.flattenTasks([copy])) {
      task.dependsOn = task.dependsOn ? idMap.get(task.dependsOn) ?? null : null;
    }
  }

  /** Clears `dependsOn` references that point outside their own project/group. */
  private pruneDependencies(): void {
    const groups = [this.standaloneTasks, ...this.projects.map((p) => p.tasks)];
    for (const group of groups) {
      const tasks = this.flattenTasks(group);
      const ids = new Set(tasks.map((t) => t.id));
      for (const task of tasks) {
        if (task.dependsOn && !ids.has(task.dependsOn)) {
          task.dependsOn = null;
        }
      }
    }
  }

  // --- tasks: subtask visibility ---

  loadCollapsedFromStorage(): void {
    try {
      const raw = localStorage.getItem(COLLAPSED_STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as { ids?: unknown };
      const ids = Array.isArray(data?.ids) ? data.ids : [];
      this.collapsedTaskIds = new Set(
        ids.filter((id): id is string => typeof id === 'string' && id !== '')
      );
    } catch {
      this.collapsedTaskIds = new Set();
    }
  }

  private saveCollapsed(): void {
    try {
      localStorage.setItem(
        COLLAPSED_STORAGE_KEY,
        JSON.stringify({ ids: [...this.collapsedTaskIds] })
      );
    } catch {
      // Collapsing is cosmetic: never break the tool when storage is unavailable.
    }
  }

  /** Root list of the current view (general tasks or the selected project). */
  private get currentRootTasks(): Task[] {
    return this.selectedProject?.tasks ?? this.standaloneTasks;
  }

  hasSubtasks(task: Task): boolean {
    return task.subtasks.length > 0;
  }

  isCollapsed(task: Task): boolean {
    return this.collapsedTaskIds.has(task.id);
  }

  toggleSubtasks(task: Task, event?: MouseEvent): void {
    if (event) event.stopPropagation();

    if (this.collapsedTaskIds.has(task.id)) {
      this.collapsedTaskIds.delete(task.id);
    } else {
      this.collapsedTaskIds.add(task.id);
    }
    this.saveCollapsed();
  }

  /** Expands `task` so a freshly added or duplicated subtask is visible. */
  private expandTask(task: Task): void {
    if (this.collapsedTaskIds.delete(task.id)) {
      this.saveCollapsed();
    }
  }

  /** True when the current view has at least one task with subtasks. */
  get hasAnySubtasks(): boolean {
    return this.flattenTasks(this.currentRootTasks).some((task) => task.subtasks.length > 0);
  }

  /** True when every task with subtasks in the current view is collapsed. */
  get allSubtasksCollapsed(): boolean {
    const parents = this.flattenTasks(this.currentRootTasks).filter(
      (task) => task.subtasks.length > 0
    );
    return parents.length > 0 && parents.every((task) => this.collapsedTaskIds.has(task.id));
  }

  /** Collapses (or expands) every subtask tree in the current view. */
  toggleAllSubtasks(): void {
    const parents = this.flattenTasks(this.currentRootTasks).filter(
      (task) => task.subtasks.length > 0
    );
    if (parents.length === 0) return;

    const collapse = !this.allSubtasksCollapsed;
    for (const parent of parents) {
      if (collapse) {
        this.collapsedTaskIds.add(parent.id);
      } else {
        this.collapsedTaskIds.delete(parent.id);
      }
    }
    this.saveCollapsed();
  }

  // --- tasks: reorder ---

  /**
   * Moves a task one position up (-1) or down (+1) inside its own list.
   * No-op when the move would leave the list bounds.
   */
  moveTaskBy(list: Task[], taskId: string, offset: number): void {
    const from = list.findIndex((t) => t.id === taskId);
    if (from === -1) return;

    const to = from + offset;
    if (to < 0 || to >= list.length) return;

    const [task] = list.splice(from, 1);
    list.splice(to, 0, task);
    this.saveToStorage();
  }

  /**
   * Drops `draggedId` onto `targetId` inside the same list. The dragged task
   * follows the pointer: it lands after the target when moving down and before
   * it when moving up.
   */
  moveTaskToPosition(list: Task[], draggedId: string, targetId: string): void {
    const from = list.findIndex((t) => t.id === draggedId);
    const to = list.findIndex((t) => t.id === targetId);
    if (from === -1 || to === -1 || from === to) return;

    const [task] = list.splice(from, 1);
    list.splice(to, 0, task);
    this.dropTargetId = null;
    this.saveToStorage();
  }

  /** Where the drop marker should render for `targetId` ('above' | 'below'). */
  dropPositionIn(list: Task[], targetId: string): 'above' | 'below' | null {
    if (!this.draggedTaskId || this.draggedList !== list) return null;

    const from = list.findIndex((t) => t.id === this.draggedTaskId);
    const to = list.findIndex((t) => t.id === targetId);
    if (from === -1 || to === -1 || from === to) return null;

    return from < to ? 'below' : 'above';
  }

  isFirstInList(list: Task[], taskId: string): boolean {
    return list.findIndex((t) => t.id === taskId) <= 0;
  }

  isLastInList(list: Task[], taskId: string): boolean {
    return list.findIndex((t) => t.id === taskId) === list.length - 1;
  }

  onTaskDragStart(task: Task, list: Task[], event: DragEvent): void {
    this.draggedTaskId = task.id;
    this.draggedList = list;
    this.dropTargetId = null;

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', task.id);
      const row = (event.target as HTMLElement | null)?.closest('.pm-task-row');
      if (row) {
        event.dataTransfer.setDragImage(row, 20, 20);
      }
    }
  }

  onTaskDragOver(task: Task, list: Task[], event: DragEvent): void {
    // Only siblings of the dragged list are valid drop targets.
    if (!this.draggedTaskId || this.draggedList !== list || task.id === this.draggedTaskId) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.dropTargetId = task.id;
  }

  onTaskDragLeave(task: Task, event: DragEvent): void {
    const next = event.relatedTarget as Node | null;
    const current = event.currentTarget as HTMLElement | null;
    // Ignore pointer moves between children of the same row.
    if (next && current?.contains(next)) return;

    if (this.dropTargetId === task.id) {
      this.dropTargetId = null;
    }
  }

  onTaskDrop(task: Task, list: Task[], event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const draggedId = this.draggedTaskId;
    const sourceList = this.draggedList;
    this.onTaskDragEnd();

    if (!draggedId || sourceList !== list) return;
    this.moveTaskToPosition(list, draggedId, task.id);
  }

  onTaskDragEnd(): void {
    this.draggedTaskId = null;
    this.dropTargetId = null;
    this.draggedList = null;
  }

  // --- tasks: edit ---

  startEditTask(task: Task, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.editingTaskId = task.id;
    this.editingTaskText = task.text;
  }

  saveEditTask(task: Task): void {
    if (this.editingTaskId !== task.id) return;
    const text = this.editingTaskText.trim();
    if (text) {
      task.text = text;
    }
    this.editingTaskId = null;
    this.editingTaskText = '';
    this.saveToStorage();
  }

  cancelEditTask(): void {
    this.editingTaskId = null;
    this.editingTaskText = '';
  }

  onTaskEditKeydown(task: Task, event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEditTask(task);
    } else if (event.key === 'Escape') {
      this.cancelEditTask();
    }
  }

  // --- tasks: scheduling (timeline data) ---

  toggleTaskSchedule(task: Task, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    this.schedulingTaskId = this.schedulingTaskId === task.id ? null : task.id;
  }

  setTaskStartDate(task: Task, value: string): void {
    task.startDate = value || null;
    this.saveToStorage();
  }

  setTaskEndDate(task: Task, value: string): void {
    task.endDate = value || null;
    this.saveToStorage();
  }

  setTaskDependsOn(task: Task, value: string | null): void {
    task.dependsOn = value || null;
    this.saveToStorage();
  }

  flattenTasks(tasks: Task[]): Task[] {
    return tasks.flatMap((task) => [task, ...this.flattenTasks(task.subtasks)]);
  }

  get dependencyOptions(): Task[] {
    if (this.selectedProject) {
      return this.flattenTasks(this.selectedProject.tasks);
    }
    return this.flattenTasks(this.standaloneTasks);
  }

  truncateText(text: string, limit: number): string {
    if (text.length <= limit) return text;
    return text.substring(0, limit) + '...';
  }

  getStatusLabel(status: Project['status']): string {
    return status;
  }

  formatDeadline(dateStr: string | null): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  }

  exportFilename(): string {
    return `project-manager-${new Date().toISOString().slice(0, 10)}.json`;
  }

  exportData(): string {
    return JSON.stringify(
      { projects: this.projects, standaloneTasks: this.standaloneTasks },
      null,
      2
    );
  }

  downloadExport(): void {
    const blob = new Blob([this.exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.exportFilename();
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  importData(json: string): boolean {
    let raw: unknown;
    try {
      raw = JSON.parse(json);
    } catch {
      alert('Arquivo inválido. Selecione um .json exportado por esta ferramenta.');
      return false;
    }

    const data = this.normalizeData(raw);
    this.projects = data.projects;
    this.standaloneTasks = data.standaloneTasks;
    this.selectedProjectId = null;
    this.showTimeline = false;
    this.saveToStorage();
    return true;
  }

  async onImportFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    if (!confirm('Substituir os dados atuais pelas notas importadas?')) {
      input.value = '';
      return;
    }

    try {
      const text = await file.text();
      this.importData(text);
    } catch {
      alert('Não foi possível ler o arquivo.');
    } finally {
      input.value = '';
    }
  }

  // --- templates: export / import ---

  exportTemplatesFilename(): string {
    return `project-manager-templates-${new Date().toISOString().slice(0, 10)}.json`;
  }

  exportTemplatesData(): string {
    return JSON.stringify({ templates: this.templates }, null, 2);
  }

  downloadTemplatesExport(): void {
    const blob = new Blob([this.exportTemplatesData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.exportTemplatesFilename();
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  importTemplatesData(json: string): boolean {
    let raw: unknown;
    try {
      raw = JSON.parse(json);
    } catch {
      alert('Arquivo inválido. Selecione um .json exportado por esta ferramenta.');
      return false;
    }

    this.templates = this.normalizeTemplates(raw);
    this.saveTemplatesToStorage();
    return true;
  }

  async onImportTemplatesFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    if (!confirm('Substituir os templates atuais pelos importados?')) {
      input.value = '';
      return;
    }

    try {
      const text = await file.text();
      this.importTemplatesData(text);
    } catch {
      alert('Não foi possível ler o arquivo.');
    } finally {
      input.value = '';
    }
  }

  normalizeData(raw: unknown): StoredData {
    const obj = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;
    return {
      projects: this.normalizeProjects(obj['projects']),
      standaloneTasks: this.normalizeTasks(obj['standaloneTasks']),
    };
  }

  normalizeTemplates(raw: unknown): ProjectTemplate[] {
    const obj = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;
    const list = Array.isArray(obj['templates'])
      ? obj['templates']
      : Array.isArray(raw)
        ? raw
        : [];
    return list
      .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
      .map((item) => ({
        id: this.toId(item['id']),
        name: this.toString(item['name']),
        description: this.toString(item['description']),
        tasks: this.normalizeTemplateTasks(item['tasks']),
      }));
  }

  private normalizeTemplateTasks(raw: unknown): TemplateTask[] {
    if (!Array.isArray(raw)) {
      return [];
    }
    return raw
      .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
      .map((item) => ({
        text: this.toString(item['text']),
        subtasks: this.normalizeTemplateTasks(item['subtasks']),
        priority: this.toPriority(item['priority']),
      }));
  }

  private normalizeProjects(raw: unknown): Project[] {
    if (!Array.isArray(raw)) {
      return [];
    }
    return raw
      .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
      .map((item) => ({
        id: this.toId(item['id']),
        name: this.toString(item['name']),
        description: this.toString(item['description']),
        status: this.toStatus(item['status']),
        deadline: this.toDeadline(item['deadline']),
        tasks: this.normalizeTasks(item['tasks']),
      }));
  }

  private normalizeTasks(raw: unknown): Task[] {
    if (!Array.isArray(raw)) {
      return [];
    }
    return raw
      .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
      .map((item) => ({
        id: this.toId(item['id']),
        text: this.toString(item['text']),
        done: item['done'] === true,
        subtasks: this.normalizeTasks(item['subtasks']),
        startDate: this.toNullableString(item['startDate']),
        endDate: this.toNullableString(item['endDate']),
        dependsOn: this.toNullableString(item['dependsOn']),
        priority: this.toPriority(item['priority']),
      }));
  }

  private toNullableString(value: unknown): string | null {
    return typeof value === 'string' && value ? value : null;
  }

  private toString(value: unknown): string {
    return typeof value === 'string' ? value : value == null ? '' : String(value);
  }

  private toId(value: unknown): string {
    const id = this.toString(value);
    return id ? id : crypto.randomUUID();
  }

  private toDeadline(value: unknown): string | null {
    return typeof value === 'string' && value ? value : null;
  }

  private toPriority(value: unknown): TaskPriority {
    return TASK_PRIORITIES.some((priority) => priority.value === value)
      ? (value as TaskPriority)
      : 'backlog';
  }

  private toStatus(value: unknown): Project['status'] {
    return this.statuses.includes(value as Project['status'])
      ? (value as Project['status'])
      : 'Pendente';
  }
}
