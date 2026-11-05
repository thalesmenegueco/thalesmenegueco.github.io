import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManager, Task } from './project-manager';

describe('ProjectManager', () => {
  let component: ProjectManager;
  let fixture: ComponentFixture<ProjectManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectManager],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectManager);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('exportFilename', () => {
    it('should include an ISO date prefix', () => {
      expect(component.exportFilename()).toMatch(
        /^project-manager-\d{4}-\d{2}-\d{2}\.json$/
      );
    });
  });

  describe('exportData', () => {
    it('should serialize projects and standaloneTasks', () => {
      component.projects = [
        { id: 'p1', name: 'Projeto', description: '', status: 'Pendente', deadline: null, tasks: [] },
      ];
      component.standaloneTasks = [
        { id: 't1', text: 'Tarefa', done: false, subtasks: [], startDate: null, endDate: null, dependsOn: null },
      ];

      const parsed = JSON.parse(component.exportData());

      expect(parsed.projects.length).toBe(1);
      expect(parsed.projects[0].name).toBe('Projeto');
      expect(parsed.standaloneTasks.length).toBe(1);
      expect(parsed.standaloneTasks[0].text).toBe('Tarefa');
    });
  });

  describe('importData', () => {
    it('should import valid JSON, reset selection and persist', () => {
      const setItem = spyOn(localStorage, 'setItem');
      component.selectedProjectId = 'p1';

      const json = JSON.stringify({
        projects: [
          { id: 'p2', name: 'Importado', description: '', status: 'Concluído', deadline: null, tasks: [] },
        ],
        standaloneTasks: [
          { id: 't2', text: 'Nova', done: true, subtasks: [] },
        ],
      });

      const result = component.importData(json);

      expect(result).toBeTrue();
      expect(component.projects[0].name).toBe('Importado');
      expect(component.standaloneTasks[0].text).toBe('Nova');
      expect(component.selectedProjectId).toBeNull();
      expect(setItem).toHaveBeenCalled();
    });

    it('should return false and keep previous data on invalid JSON', () => {
      const setItem = spyOn(localStorage, 'setItem');
      const alertSpy = spyOn(window, 'alert');
      component.projects = [
        { id: 'p1', name: 'Antigo', description: '', status: 'Pendente', deadline: null, tasks: [] },
      ];
      component.standaloneTasks = [];
      component.selectedProjectId = 'p1';

      const result = component.importData('{invalid');

      expect(result).toBeFalse();
      expect(component.projects[0].name).toBe('Antigo');
      expect(component.selectedProjectId).toBe('p1');
      expect(setItem).not.toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalled();
    });
  });

  describe('normalizeData', () => {
    it('should coerce fields and fill defaults', () => {
      const data = component.normalizeData({
        projects: [{ id: 'p1', name: 'Projeto', description: 123, status: 'Inválido' }],
        standaloneTasks: [{ id: 't1', text: 'Tarefa', done: 'yes', subtasks: 'nope' }],
      });

      expect(data.projects.length).toBe(1);
      expect(data.projects[0].id).toBe('p1');
      expect(data.projects[0].name).toBe('Projeto');
      expect(data.projects[0].description).toBe('123');
      expect(data.projects[0].status).toBe('Pendente');
      expect(data.projects[0].deadline).toBeNull();
      expect(data.projects[0].tasks).toEqual([]);

      expect(data.standaloneTasks.length).toBe(1);
      expect(data.standaloneTasks[0].id).toBe('t1');
      expect(data.standaloneTasks[0].done).toBeFalse();
      expect(data.standaloneTasks[0].subtasks).toEqual([]);
    });

    it('should return empty arrays for non-object input', () => {
      const data = component.normalizeData(null);

      expect(data.projects).toEqual([]);
      expect(data.standaloneTasks).toEqual([]);
    });
  });

  describe('downloadExport', () => {
    beforeEach(() => {
      jasmine.clock().install();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should create a link, click it and revoke the object URL', () => {
      const createObjectURL = spyOn(URL, 'createObjectURL').and.returnValue('blob:test');
      const revokeObjectURL = spyOn(URL, 'revokeObjectURL');
      const click = spyOn(HTMLAnchorElement.prototype, 'click');

      component.downloadExport();

      expect(createObjectURL).toHaveBeenCalled();
      expect(click).toHaveBeenCalled();

      jasmine.clock().tick(0);
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:test');
    });
  });

  describe('countTasks', () => {
    it('should count nested tasks recursively', () => {
      component.projects = [
        {
          id: 'p1',
          name: 'P',
          description: '',
          status: 'Pendente',
          deadline: null,
          tasks: [
            {
              id: 'a',
              text: 'A',
              done: false,
              subtasks: [
                { id: 'a1', text: 'A1', done: false, subtasks: [], startDate: null, endDate: null, dependsOn: null },
                { id: 'a2', text: 'A2', done: false, subtasks: [], startDate: null, endDate: null, dependsOn: null },
              ],
              startDate: null,
              endDate: null,
              dependsOn: null,
            },
            { id: 'b', text: 'B', done: false, subtasks: [], startDate: null, endDate: null, dependsOn: null },
          ],
        },
      ];

      expect(component.countTasks(component.projects[0].tasks)).toBe(4);
    });
  });

  describe('saveTemplateFromProject', () => {
    it('should create a template from the selected project and strip runtime state', () => {
      const setItem = spyOn(localStorage, 'setItem');
      component.templates = [];
      component.projects = [
        {
          id: 'p1',
          name: 'Proj',
          description: 'Desc',
          status: 'Em andamento',
          deadline: '2026-01-01',
          tasks: [
            {
              id: 't1',
              text: 'T1',
              done: true,
              subtasks: [{ id: 't2', text: 'T1.1', done: false, subtasks: [], startDate: null, endDate: null, dependsOn: null }],
              startDate: null,
              endDate: null,
              dependsOn: null,
            },
          ],
        },
      ];
      component.selectedProjectId = 'p1';
      component.showSaveTemplateForm = true;
      component.templateName = 'Meu Template';
      component.templateDescription = 'Desc do template';

      component.saveTemplateFromProject();

      expect(component.templates.length).toBe(1);
      expect(component.templates[0].name).toBe('Meu Template');
      expect(component.templates[0].description).toBe('Desc do template');
      expect(component.templates[0].tasks[0].text).toBe('T1');
      expect(component.templates[0].tasks[0].subtasks[0].text).toBe('T1.1');
      expect((component.templates[0].tasks[0] as { done?: boolean }).done).toBeUndefined();
      expect(component.showSaveTemplateForm).toBeFalse();
      expect(setItem).toHaveBeenCalled();
    });

    it('should overwrite an existing template with the same name (case-insensitive)', () => {
      const setItem = spyOn(localStorage, 'setItem');
      component.templates = [
        { id: 'tpl-1', name: 'Duplicado', description: 'old', tasks: [] },
      ];
      component.projects = [
        { id: 'p1', name: 'Proj', description: '', status: 'Pendente', deadline: null, tasks: [] },
      ];
      component.selectedProjectId = 'p1';
      component.templateName = 'duplicado';
      component.templateDescription = 'new';

      component.saveTemplateFromProject();

      expect(component.templates.length).toBe(1);
      expect(component.templates[0].id).toBe('tpl-1');
      expect(component.templates[0].description).toBe('new');
      expect(setItem).toHaveBeenCalled();
    });
  });

  describe('createProjectFromTemplate', () => {
    it('should instantiate a fresh project with undone tasks', () => {
      const setItem = spyOn(localStorage, 'setItem');
      component.projects = [];
      component.showTemplates = true;
      const template = {
        id: 'tpl-1',
        name: 'Tpl',
        description: 'D',
        tasks: [
          { text: 'A', subtasks: [{ text: 'A1', subtasks: [] }] },
        ],
      };
      component.templates = [template];

      component.createProjectFromTemplate(template);

      expect(component.projects.length).toBe(1);
      const project = component.projects[0];
      expect(project.name).toBe('Tpl');
      expect(project.description).toBe('D');
      expect(project.status).toBe('Pendente');
      expect(project.deadline).toBeNull();
      expect(project.tasks[0].text).toBe('A');
      expect(project.tasks[0].done).toBeFalse();
      expect(project.tasks[0].subtasks[0].text).toBe('A1');
      expect(project.tasks[0].subtasks[0].done).toBeFalse();
      expect(component.showTemplates).toBeFalse();
      expect(component.selectedProjectId).toBe(project.id);
      expect(setItem).toHaveBeenCalled();
    });
  });

  describe('addProject with template', () => {
    it('should seed tasks from the selected template', () => {
      const setItem = spyOn(localStorage, 'setItem');
      component.projects = [];
      component.templates = [
        { id: 't1', name: 'Tpl', description: '', tasks: [{ text: 'A', subtasks: [] }] },
      ];
      component.newProjectName = 'Novo';
      component.newProjectTemplateId = 't1';

      component.addProject();

      expect(component.projects.length).toBe(1);
      expect(component.projects[0].tasks[0].text).toBe('A');
      expect(component.projects[0].tasks[0].done).toBeFalse();
      expect(component.newProjectTemplateId).toBeNull();
      expect(setItem).toHaveBeenCalled();
    });
  });

  describe('onNewProjectTemplateChange', () => {
    it('should prefill name and description from the template', () => {
      component.templates = [
        { id: 't1', name: 'Tpl', description: 'Desc', tasks: [] },
      ];

      component.onNewProjectTemplateChange('t1');

      expect(component.newProjectName).toBe('Tpl');
      expect(component.newProjectDescription).toBe('Desc');
    });
  });

  describe('deleteTemplate', () => {
    it('should remove the template and persist', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      const setItem = spyOn(localStorage, 'setItem');
      component.templates = [
        { id: 't1', name: 'A', description: '', tasks: [] },
        { id: 't2', name: 'B', description: '', tasks: [] },
      ];

      component.deleteTemplate('t1');

      expect(component.templates.length).toBe(1);
      expect(component.templates[0].id).toBe('t2');
      expect(setItem).toHaveBeenCalled();
    });
  });

  describe('exportTemplatesFilename', () => {
    it('should include an ISO date prefix', () => {
      expect(component.exportTemplatesFilename()).toMatch(
        /^project-manager-templates-\d{4}-\d{2}-\d{2}\.json$/
      );
    });
  });

  describe('exportTemplatesData', () => {
    it('should serialize templates', () => {
      component.templates = [
        { id: 't1', name: 'Tpl', description: '', tasks: [{ text: 'A', subtasks: [] }] },
      ];

      const parsed = JSON.parse(component.exportTemplatesData());

      expect(parsed.templates.length).toBe(1);
      expect(parsed.templates[0].name).toBe('Tpl');
      expect(parsed.templates[0].tasks[0].text).toBe('A');
    });
  });

  describe('importTemplatesData', () => {
    it('should import valid JSON and persist', () => {
      const setItem = spyOn(localStorage, 'setItem');
      const json = JSON.stringify({
        templates: [
          { id: 't1', name: 'Tpl', description: 'D', tasks: [{ text: 'A', subtasks: [] }] },
        ],
      });

      const result = component.importTemplatesData(json);

      expect(result).toBeTrue();
      expect(component.templates.length).toBe(1);
      expect(component.templates[0].name).toBe('Tpl');
      expect(setItem).toHaveBeenCalled();
    });

    it('should return false on invalid JSON', () => {
      const alertSpy = spyOn(window, 'alert');
      component.templates = [{ id: 't1', name: 'A', description: '', tasks: [] }];

      const result = component.importTemplatesData('{invalid');

      expect(result).toBeFalse();
      expect(component.templates.length).toBe(1);
      expect(alertSpy).toHaveBeenCalled();
    });
  });

  describe('normalizeTemplates', () => {
    it('should coerce fields and fill defaults', () => {
      const data = component.normalizeTemplates({
        templates: [
          { id: '', name: 123, description: null, tasks: [{ text: 'A', subtasks: 'nope' }] },
        ],
      });

      expect(data.length).toBe(1);
      expect(data[0].id).toBeTruthy();
      expect(data[0].name).toBe('123');
      expect(data[0].description).toBe('');
      expect(data[0].tasks.length).toBe(1);
      expect(data[0].tasks[0].text).toBe('A');
      expect(data[0].tasks[0].subtasks).toEqual([]);
    });

    it('should accept a bare array', () => {
      const data = component.normalizeTemplates([
        { name: 'X', description: '', tasks: [] },
      ]);

      expect(data.length).toBe(1);
      expect(data[0].name).toBe('X');
    });
  });

  describe('task editing', () => {
    it('startEditTask should record the task id and current text', () => {
      const task = { id: 't1', text: 'Original', done: false, subtasks: [], startDate: null, endDate: null, dependsOn: null };

      component.startEditTask(task);

      expect(component.editingTaskId).toBe('t1');
      expect(component.editingTaskText).toBe('Original');
    });

    it('saveEditTask should trim and update the text, clear state and persist', () => {
      const setItem = spyOn(localStorage, 'setItem');
      const task = { id: 't1', text: 'Original', done: false, subtasks: [], startDate: null, endDate: null, dependsOn: null };

      component.startEditTask(task);
      component.editingTaskText = '  Editado  ';

      component.saveEditTask(task);

      expect(task.text).toBe('Editado');
      expect(component.editingTaskId).toBeNull();
      expect(component.editingTaskText).toBe('');
      expect(setItem).toHaveBeenCalled();
    });

    it('saveEditTask should keep the original text when the edit is blank', () => {
      const task = { id: 't1', text: 'Original', done: false, subtasks: [], startDate: null, endDate: null, dependsOn: null };

      component.startEditTask(task);
      component.editingTaskText = '   ';

      component.saveEditTask(task);

      expect(task.text).toBe('Original');
      expect(component.editingTaskId).toBeNull();
    });

    it('saveEditTask should be a no-op for a different task id', () => {
      const setItem = spyOn(localStorage, 'setItem');
      const task = { id: 't1', text: 'Original', done: false, subtasks: [], startDate: null, endDate: null, dependsOn: null };
      component.editingTaskId = 'other';
      component.editingTaskText = 'Lixo';

      component.saveEditTask(task);

      expect(task.text).toBe('Original');
      expect(setItem).not.toHaveBeenCalled();
    });

    it('cancelEditTask should clear state without changing the task', () => {
      const task = { id: 't1', text: 'Original', done: false, subtasks: [], startDate: null, endDate: null, dependsOn: null };

      component.startEditTask(task);
      component.editingTaskText = 'Alterado';

      component.cancelEditTask();

      expect(component.editingTaskId).toBeNull();
      expect(component.editingTaskText).toBe('');
      expect(task.text).toBe('Original');
    });

    it('onTaskEditKeydown should save on Enter and cancel on Escape', () => {
      const task = { id: 't1', text: 'Original', done: false, subtasks: [], startDate: null, endDate: null, dependsOn: null };

      component.startEditTask(task);
      component.editingTaskText = 'Novo';
      component.onTaskEditKeydown(task, new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(task.text).toBe('Novo');
      expect(component.editingTaskId).toBeNull();

      component.startEditTask(task);
      component.editingTaskText = 'Lixo';
      component.onTaskEditKeydown(task, new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(component.editingTaskId).toBeNull();
      expect(component.editingTaskText).toBe('');
      expect(task.text).toBe('Novo');
    });
  });

  describe('task ordering', () => {
    const makeTask = (id: string, subtasks: Task[] = []): Task => ({
      id,
      text: id.toUpperCase(),
      done: false,
      subtasks,
      startDate: null,
      endDate: null,
      dependsOn: null,
    });

    it('moveTaskBy should move a task up and persist', () => {
      const setItem = spyOn(localStorage, 'setItem');
      const list = [makeTask('a'), makeTask('b'), makeTask('c')];

      component.moveTaskBy(list, 'c', -1);

      expect(list.map((t) => t.id)).toEqual(['a', 'c', 'b']);
      expect(setItem).toHaveBeenCalled();
    });

    it('moveTaskBy should move a task down', () => {
      const list = [makeTask('a'), makeTask('b'), makeTask('c')];

      component.moveTaskBy(list, 'a', 1);

      expect(list.map((t) => t.id)).toEqual(['b', 'a', 'c']);
    });

    it('moveTaskBy should be a no-op at the list bounds', () => {
      const setItem = spyOn(localStorage, 'setItem');
      const list = [makeTask('a'), makeTask('b')];

      component.moveTaskBy(list, 'a', -1);
      component.moveTaskBy(list, 'b', 1);
      component.moveTaskBy(list, 'missing', 1);

      expect(list.map((t) => t.id)).toEqual(['a', 'b']);
      expect(setItem).not.toHaveBeenCalled();
    });

    it('moveTaskBy should only reorder siblings of the given list', () => {
      const child = makeTask('a1');
      const parent = makeTask('a', [child]);
      const list = [parent, makeTask('b')];

      component.moveTaskBy(list, 'a1', -1);

      expect(list.map((t) => t.id)).toEqual(['a', 'b']);
      expect(list[0].subtasks.map((t) => t.id)).toEqual(['a1']);
    });

    it('moveTaskToPosition should place the dragged task at the target position', () => {
      const setItem = spyOn(localStorage, 'setItem');
      const list = [makeTask('a'), makeTask('b'), makeTask('c')];

      component.moveTaskToPosition(list, 'a', 'c');

      expect(list.map((t) => t.id)).toEqual(['b', 'c', 'a']);
      expect(setItem).toHaveBeenCalled();
    });

    it('moveTaskToPosition should move a task upward past its target', () => {
      const list = [makeTask('a'), makeTask('b'), makeTask('c')];

      component.moveTaskToPosition(list, 'c', 'a');

      expect(list.map((t) => t.id)).toEqual(['c', 'a', 'b']);
    });

    it('moveTaskToPosition should ignore a drop on itself or on an unknown task', () => {
      const setItem = spyOn(localStorage, 'setItem');
      const list = [makeTask('a'), makeTask('b')];

      component.moveTaskToPosition(list, 'a', 'a');
      component.moveTaskToPosition(list, 'a', 'missing');
      component.moveTaskToPosition(list, 'missing', 'b');

      expect(list.map((t) => t.id)).toEqual(['a', 'b']);
      expect(setItem).not.toHaveBeenCalled();
    });

    it('isFirstInList / isLastInList should describe the list bounds', () => {
      const list = [makeTask('a'), makeTask('b'), makeTask('c')];

      expect(component.isFirstInList(list, 'a')).toBeTrue();
      expect(component.isFirstInList(list, 'b')).toBeFalse();
      expect(component.isLastInList(list, 'c')).toBeTrue();
      expect(component.isLastInList(list, 'b')).toBeFalse();
      expect(component.isFirstInList(list, 'missing')).toBeTrue();
      expect(component.isLastInList(list, 'missing')).toBeFalse();
    });

    it('drag handlers should track the dragged task and clear on drop', () => {
      const list = [makeTask('a'), makeTask('b')];
      const dragStart = new Event('dragstart') as DragEvent;

      component.onTaskDragStart(list[0], list, dragStart);
      expect(component.draggedTaskId).toBe('a');

      const dragOver = new Event('dragover', { cancelable: true }) as DragEvent;
      component.onTaskDragOver(list[1], list, dragOver);
      expect(component.dropTargetId).toBe('b');

      const drop = new Event('drop', { cancelable: true }) as DragEvent;
      component.onTaskDrop(list[1], list, drop);

      expect(list.map((t) => t.id)).toEqual(['b', 'a']);
      expect(component.draggedTaskId).toBeNull();
      expect(component.dropTargetId).toBeNull();
    });

    it('should refuse drops coming from a different list', () => {
      const setItem = spyOn(localStorage, 'setItem');
      const list = [makeTask('a'), makeTask('b')];
      const otherList = [makeTask('x')];

      component.onTaskDragStart(otherList[0], otherList, new Event('dragstart') as DragEvent);

      const dragOver = new Event('dragover', { cancelable: true }) as DragEvent;
      component.onTaskDragOver(list[0], list, dragOver);
      expect(component.dropTargetId).toBeNull();

      const drop = new Event('drop', { cancelable: true }) as DragEvent;
      component.onTaskDrop(list[0], list, drop);

      expect(list.map((t) => t.id)).toEqual(['a', 'b']);
      expect(otherList.map((t) => t.id)).toEqual(['x']);
      expect(setItem).not.toHaveBeenCalled();
    });

    it('dropPositionIn should mark the marker below when moving down and above when moving up', () => {
      const list = [makeTask('a'), makeTask('b'), makeTask('c')];

      component.onTaskDragStart(list[0], list, new Event('dragstart') as DragEvent);
      expect(component.dropPositionIn(list, 'c')).toBe('below');
      expect(component.dropPositionIn(list, 'a')).toBeNull();

      component.onTaskDragStart(list[2], list, new Event('dragstart') as DragEvent);
      expect(component.dropPositionIn(list, 'a')).toBe('above');
      expect(component.dropPositionIn([makeTask('x')], 'a')).toBeNull();
    });

    it('should not treat top-level tasks as drop targets while dragging a subtask', () => {
      const child = makeTask('a1');
      const list = [makeTask('a', [child]), makeTask('b')];

      component.onTaskDragStart(child, list[0].subtasks, new Event('dragstart') as DragEvent);
      component.onTaskDragOver(
        list[1],
        list,
        new Event('dragover', { cancelable: true }) as DragEvent
      );

      expect(component.dropTargetId).toBeNull();
      expect(list.map((t) => t.id)).toEqual(['a', 'b']);
      expect(list[0].subtasks.map((t) => t.id)).toEqual(['a1']);
    });

    it('onTaskDragEnd should reset the drag state', () => {
      component.draggedTaskId = 'a';
      component.dropTargetId = 'b';

      component.onTaskDragEnd();

      expect(component.draggedTaskId).toBeNull();
      expect(component.dropTargetId).toBeNull();
    });

    describe('rendered list', () => {
      const dragEvent = (type: string, dataTransfer: DataTransfer): DragEvent =>
        new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer });

      const renderTasks = (ids: string[]): HTMLElement[] => {
        component.selectedProjectId = null;
        component.showTemplates = false;
        component.showTimeline = false;
        component.standaloneTasks = ids.map((id) => makeTask(id));
        fixture.detectChanges();
        return Array.from(
          fixture.nativeElement.querySelectorAll('.pm-task-list .pm-task-row')
        ) as HTMLElement[];
      };

      it('should reorder tasks by dragging one row onto another', () => {
        const rows = renderTasks(['a', 'b', 'c']);
        const dataTransfer = new DataTransfer();

        const handle = rows[0].querySelector('.pm-drag-handle') as HTMLElement;
        handle.dispatchEvent(dragEvent('dragstart', dataTransfer));
        fixture.detectChanges();

        expect(rows[0].classList).toContain('dragging');

        rows[2].dispatchEvent(dragEvent('dragover', dataTransfer));
        fixture.detectChanges();

        expect(rows[2].classList).toContain('drop-target');
        expect(rows[2].classList).toContain('drop-below');

        rows[2].dispatchEvent(dragEvent('drop', dataTransfer));
        fixture.detectChanges();

        expect(component.standaloneTasks.map((t) => t.id)).toEqual(['b', 'c', 'a']);
        expect(component.draggedTaskId).toBeNull();
        expect(component.dropTargetId).toBeNull();
        expect(rows.length).toBe(3);
      });

      it('should reorder tasks with the arrow buttons and disable them at the bounds', () => {
        const rows = renderTasks(['a', 'b', 'c']);
        const up = (row: HTMLElement) =>
          row.querySelector('[title="Mover para cima"]') as HTMLButtonElement;
        const down = (row: HTMLElement) =>
          row.querySelector('[title="Mover para baixo"]') as HTMLButtonElement;

        expect(up(rows[0]).disabled).toBeTrue();
        expect(down(rows[2]).disabled).toBeTrue();
        expect(up(rows[2]).disabled).toBeFalse();

        down(rows[0]).click();
        fixture.detectChanges();

        expect(component.standaloneTasks.map((t) => t.id)).toEqual(['b', 'a', 'c']);
      });
    });
  });

  describe('task scheduling', () => {
    const makeTask = (overrides: Partial<Task> = {}): Task => ({
      id: 't1',
      text: 'Tarefa',
      done: false,
      subtasks: [],
      startDate: null,
      endDate: null,
      dependsOn: null,
      ...overrides,
    });

    it('setTaskStartDate should set or clear and persist', () => {
      const setItem = spyOn(localStorage, 'setItem');
      const task = makeTask();

      component.setTaskStartDate(task, '2026-02-01');
      expect(task.startDate).toBe('2026-02-01');

      component.setTaskStartDate(task, '');
      expect(task.startDate).toBeNull();
      expect(setItem).toHaveBeenCalled();
    });

    it('setTaskEndDate should set or clear and persist', () => {
      const setItem = spyOn(localStorage, 'setItem');
      const task = makeTask();

      component.setTaskEndDate(task, '2026-02-05');
      expect(task.endDate).toBe('2026-02-05');

      component.setTaskEndDate(task, '');
      expect(task.endDate).toBeNull();
      expect(setItem).toHaveBeenCalled();
    });

    it('setTaskDependsOn should set or clear and persist', () => {
      const setItem = spyOn(localStorage, 'setItem');
      const task = makeTask();

      component.setTaskDependsOn(task, 't2');
      expect(task.dependsOn).toBe('t2');

      component.setTaskDependsOn(task, null);
      expect(task.dependsOn).toBeNull();
      expect(setItem).toHaveBeenCalled();
    });

    it('toggleTaskSchedule should toggle the scheduling panel', () => {
      const task = makeTask();

      component.toggleTaskSchedule(task);
      expect(component.schedulingTaskId as string | null).toBe('t1');

      component.toggleTaskSchedule(task);
      expect(component.schedulingTaskId).toBeNull();
    });

    it('flattenTasks should return tasks in pre-order', () => {
      const nested: Task[] = [
        {
          id: 'a',
          text: 'A',
          done: false,
          subtasks: [
            { id: 'a1', text: 'A1', done: false, subtasks: [], startDate: null, endDate: null, dependsOn: null },
          ],
          startDate: null,
          endDate: null,
          dependsOn: null,
        },
        { id: 'b', text: 'B', done: false, subtasks: [], startDate: null, endDate: null, dependsOn: null },
      ];

      const flat = component.flattenTasks(nested);

      expect(flat.map(t => t.id)).toEqual(['a', 'a1', 'b']);
    });

    it('dependencyOptions should reflect the current project or standalone tasks', () => {
      component.projects = [
        {
          id: 'p1',
          name: 'P',
          description: '',
          status: 'Pendente',
          deadline: null,
          tasks: [
            { id: 't1', text: 'T1', done: false, subtasks: [], startDate: null, endDate: null, dependsOn: null },
            { id: 't2', text: 'T2', done: false, subtasks: [], startDate: null, endDate: null, dependsOn: null },
          ],
        },
      ];
      component.standaloneTasks = [
        { id: 's1', text: 'S1', done: false, subtasks: [], startDate: null, endDate: null, dependsOn: null },
      ];
      component.selectedProjectId = 'p1';

      expect(component.dependencyOptions.map(t => t.id)).toEqual(['t1', 't2']);

      component.selectedProjectId = null;
      expect(component.dependencyOptions.map(t => t.id)).toEqual(['s1']);
    });

    it('normalizeData should backfill missing schedule fields with null', () => {
      const data = component.normalizeData({
        projects: [{ id: 'p1', name: 'P', tasks: [{ id: 't1', text: 'T' }] }],
        standaloneTasks: [
          { id: 's1', text: 'S', startDate: '2026-01-01', endDate: '2026-01-02', dependsOn: 'x' },
        ],
      });

      expect(data.projects[0].tasks[0].startDate).toBeNull();
      expect(data.projects[0].tasks[0].endDate).toBeNull();
      expect(data.projects[0].tasks[0].dependsOn).toBeNull();

      expect(data.standaloneTasks[0].startDate).toBe('2026-01-01');
      expect(data.standaloneTasks[0].endDate).toBe('2026-01-02');
      expect(data.standaloneTasks[0].dependsOn).toBe('x');
    });
  });
});
