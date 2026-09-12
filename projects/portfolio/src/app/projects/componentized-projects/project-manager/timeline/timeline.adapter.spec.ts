import type { Project, Task } from '../project-manager';
import { adaptToTimelineItems, GENERAL_TASKS_GROUP_ID } from './timeline.adapter';

const task = (overrides: Partial<Task>): Task => ({
  id: 't1',
  text: 'Tarefa',
  done: false,
  subtasks: [],
  startDate: null,
  endDate: null,
  dependsOn: null,
  ...overrides,
});

const project = (overrides: Partial<Project>): Project => ({
  id: 'p1',
  name: 'Projeto',
  description: '',
  status: 'Pendente',
  deadline: null,
  tasks: [],
  ...overrides,
});

describe('timeline.adapter', () => {
  it('should preserve original ids and map projects/tasks', () => {
    const items = adaptToTimelineItems(
      [project({ id: 'p1', name: 'Projeto', tasks: [task({ id: 't1' })] })],
      []
    );
    expect(items.map(i => i.id)).toEqual(['p1', 't1']);
    expect(items[0].kind).toBe('project');
    expect(items[1].kind).toBe('task');
    expect(items[1].parentId).toBe('p1');
  });

  it('should map dates, status and progress', () => {
    const items = adaptToTimelineItems(
      [project({ tasks: [task({ startDate: '2026-01-01', endDate: '2026-01-02', done: true })] })],
      []
    );
    const t = items[1];
    expect(t.start).toBe('2026-01-01');
    expect(t.end).toBe('2026-01-02');
    expect(t.status).toBe('Concluído');
    expect(t.progress).toBe(100);
  });

  it('should map dependsOn to a finish-to-start dependency', () => {
    const items = adaptToTimelineItems(
      [project({ tasks: [task({ id: 'a' }), task({ id: 'b', dependsOn: 'a' })] })],
      []
    );
    const b = items.find(i => i.id === 'b');
    expect(b?.dependencies).toEqual([{ predecessorId: 'a', type: 'finish-to-start' }]);
  });

  it('should chain parentId for nested subtasks', () => {
    const items = adaptToTimelineItems(
      [project({ tasks: [task({ id: 'a', subtasks: [task({ id: 'a1' })] })] })],
      []
    );
    const a1 = items.find(i => i.id === 'a1');
    expect(a1?.parentId).toBe('a');
  });

  it('should produce a synthetic group for standalone tasks only when present', () => {
    const none = adaptToTimelineItems([], []);
    expect(none.some(i => i.id === GENERAL_TASKS_GROUP_ID)).toBeFalse();

    const withGeneral = adaptToTimelineItems([], [task({ id: 'g1' })]);
    expect(withGeneral.map(i => i.id)).toEqual([GENERAL_TASKS_GROUP_ID, 'g1']);
    expect(withGeneral[0].kind).toBe('project');
    expect(withGeneral[1].parentId).toBe(GENERAL_TASKS_GROUP_ID);
  });

  it('should not mutate the source objects', () => {
    const sourceTask = task({ id: 't1', startDate: '2026-01-01', endDate: '2026-01-02' });
    const snapshot = JSON.stringify(sourceTask);
    adaptToTimelineItems([project({ tasks: [sourceTask] })], []);
    expect(JSON.stringify(sourceTask)).toBe(snapshot);
  });
});
