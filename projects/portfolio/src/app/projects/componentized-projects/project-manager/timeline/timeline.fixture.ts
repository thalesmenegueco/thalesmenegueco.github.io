/**
 * Small normalized fixture used by engine, layout, and component tests.
 * Two projects; the first has multiple tasks with dependencies.
 */

import { TimelineItem } from './timeline.types';

export const TIMELINE_FIXTURE: TimelineItem[] = [
  {
    id: 'p1',
    kind: 'project',
    label: 'Projeto Alpha',
    start: '',
    end: '',
    status: 'Em andamento',
    dependencies: [],
  },
  {
    id: 't1',
    kind: 'task',
    parentId: 'p1',
    label: 'Planejar',
    start: '2026-02-01',
    end: '2026-02-03',
    status: 'Concluído',
    progress: 100,
    dependencies: [],
  },
  {
    id: 't2',
    kind: 'task',
    parentId: 'p1',
    label: 'Desenvolver',
    start: '2026-02-04',
    end: '2026-02-10',
    status: 'Pendente',
    progress: 0,
    dependencies: [{ predecessorId: 't1', type: 'finish-to-start' }],
  },
  {
    id: 't3',
    kind: 'task',
    parentId: 't2',
    label: 'Revisar código',
    start: '2026-02-11',
    end: '2026-02-12',
    status: 'Pendente',
    progress: 0,
    dependencies: [{ predecessorId: 't2', type: 'finish-to-start' }],
  },
  {
    id: 'p2',
    kind: 'project',
    label: 'Projeto Beta',
    start: '',
    end: '',
    status: 'Pendente',
    dependencies: [],
  },
  {
    id: 't4',
    kind: 'task',
    parentId: 'p2',
    label: 'Documentar',
    start: '2026-03-01',
    end: '2026-03-01',
    status: 'Pendente',
    progress: 0,
    dependencies: [],
  },
];
