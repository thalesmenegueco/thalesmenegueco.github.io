import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';

interface Task {
  id: string;
  text: string;
  done: boolean;
  subtasks: Task[];
}

interface Project {
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

const STORAGE_KEY = 'project-manager-data';

@Component({
  selector: 'app-project-manager',
  imports: [FormsModule, NgTemplateOutlet],
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

  newProjectName = '';
  newProjectDescription = '';
  showNewProjectForm = false;
  editFieldProjectId: string | null = null;
  editFieldName: string | null = null;

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

  ngOnInit(): void {
    this.loadFromStorage();
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

  selectProject(id: string | null): void {
    this.selectedProjectId = id;
    this.showSidebar = false;
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

  addProject(): void {
    const name = this.newProjectName.trim();
    if (!name) return;

    const project: Project = {
      id: crypto.randomUUID(),
      name,
      description: this.newProjectDescription.trim(),
      status: 'Pendente',
      deadline: null,
      tasks: [],
    };

    this.projects.push(project);
    this.newProjectName = '';
    this.newProjectDescription = '';
    this.showNewProjectForm = false;
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

  addTask(list: Task[], event?: Event): void {
    if (event) event.stopPropagation();
    const text = this.addTaskText.trim();
    if (!text) return;

    list.push({
      id: crypto.randomUUID(),
      text,
      done: false,
      subtasks: [],
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
}
