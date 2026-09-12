import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { TimelineViewComponent } from './timeline/timeline-view.component';
import { adaptToTimelineItems, GENERAL_TASKS_GROUP_ID } from './timeline/timeline.adapter';
import type { TimelineItem } from './timeline/timeline.types';

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

  templates: ProjectTemplate[] = [];
  showTemplates = false;
  showTimeline = false;
  timelineItems: TimelineItem[] = [];

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
  }

  loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data: StoredData = JSON.parse(raw);
        this.projects = data.projects ?? [];
        this.standaloneTasks = data.standaloneTasks ?? [];
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
    });

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

  private toStatus(value: unknown): Project['status'] {
    return this.statuses.includes(value as Project['status'])
      ? (value as Project['status'])
      : 'Pendente';
  }
}
