/**
 * Adapter from the domain model (Project/Task) to the normalized timeline
 * contract. This is the only place that knows about domain field names.
 *
 * Assumptions (documented, not spread through the app):
 * - Task start/end dates come from `Task.startDate` / `Task.endDate`
 *   (`YYYY-MM-DD`, inclusive). Empty means unscheduled.
 * - A single finish-to-start dependency is stored as `Task.dependsOn`
 *   (the predecessor task id), scoped to the same project/group.
 * - Project summary bars are DERIVED from child task dates (the domain has no
 *   explicit project start/end in v1). Derived dates are never persisted back.
 * - Standalone "general tasks" are presented as a synthetic group.
 */

import type { Project, Task } from '../project-manager';
import { TimelineDependency, TimelineItem } from './timeline.types';

export const GENERAL_TASKS_GROUP_ID = 'timeline-general-tasks';

export function adaptToTimelineItems(
  projects: readonly Project[],
  standaloneTasks: readonly Task[]
): TimelineItem[] {
  const items: TimelineItem[] = [];

  if (standaloneTasks.length > 0) {
    items.push({
      id: GENERAL_TASKS_GROUP_ID,
      kind: 'project',
      label: 'Tarefas Gerais',
      start: '',
      end: '',
      dependencies: [],
    });
    items.push(...toTaskItems(standaloneTasks, GENERAL_TASKS_GROUP_ID));
  }

  for (const project of projects) {
    items.push({
      id: project.id,
      kind: 'project',
      label: project.name,
      start: '',
      end: '',
      status: project.status,
      dependencies: [],
    });
    items.push(...toTaskItems(project.tasks, project.id));
  }

  return items;
}

function toTaskItems(tasks: readonly Task[], parentId: string): TimelineItem[] {
  const items: TimelineItem[] = [];
  for (const task of tasks) {
    items.push(toTaskItem(task, parentId));
    items.push(...toTaskItems(task.subtasks, task.id));
  }
  return items;
}

function toTaskItem(task: Task, parentId: string): TimelineItem {
  const dependencies: TimelineDependency[] = task.dependsOn
    ? [{ predecessorId: task.dependsOn, type: 'finish-to-start' }]
    : [];

  return {
    id: task.id,
    kind: 'task',
    parentId,
    label: task.text,
    start: task.startDate ?? '',
    end: task.endDate ?? '',
    status: task.done ? 'Concluído' : 'Pendente',
    progress: task.done ? 100 : 0,
    dependencies,
  };
}
