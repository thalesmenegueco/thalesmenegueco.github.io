import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManager } from './project-manager';

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
        { id: 't1', text: 'Tarefa', done: false, subtasks: [] },
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
                { id: 'a1', text: 'A1', done: false, subtasks: [] },
                { id: 'a2', text: 'A2', done: false, subtasks: [] },
              ],
            },
            { id: 'b', text: 'B', done: false, subtasks: [] },
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
              subtasks: [{ id: 't2', text: 'T1.1', done: false, subtasks: [] }],
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
});
