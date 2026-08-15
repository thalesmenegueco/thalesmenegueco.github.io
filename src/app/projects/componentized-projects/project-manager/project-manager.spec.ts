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
});
