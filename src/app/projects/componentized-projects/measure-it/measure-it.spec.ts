import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureIt } from './measure-it';

describe('MeasureIt', () => {
  let component: MeasureIt;
  let fixture: ComponentFixture<MeasureIt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeasureIt],
    }).compileComponents();

    fixture = TestBed.createComponent(MeasureIt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start on the paste tool with initial badges', () => {
    expect(component.tool).toBe('paste');
    expect(component.zoomBadge).toBe('Zoom: 100%');
    expect(component.scaleBadge).toBe('Escala: não calibrada');
    expect(component.imageBadge).toBe('Imagens: 0');
  });

  it('should switch tool and update the status message', () => {
    component.setTool('measure');

    expect(component.tool).toBe('measure');
    expect(component.statusTitle).toBe('Modo medir');
  });

  it('should reset view back to 100% zoom', () => {
    component.zoomIn();
    expect(component.zoomBadge).toBe('Zoom: 120%');

    component.resetView();
    expect(component.zoomBadge).toBe('Zoom: 100%');
  });
});
