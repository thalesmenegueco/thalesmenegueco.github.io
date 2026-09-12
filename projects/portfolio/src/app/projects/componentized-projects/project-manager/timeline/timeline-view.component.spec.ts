import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineViewComponent } from './timeline-view.component';
import { TIMELINE_FIXTURE } from './timeline.fixture';
import { TimelineItem } from './timeline.types';

describe('TimelineViewComponent', () => {
  let component: TimelineViewComponent;
  let fixture: ComponentFixture<TimelineViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineViewComponent);
    component = fixture.componentInstance;
  });

  const render = (items: TimelineItem[] = TIMELINE_FIXTURE) => {
    component.items = items;
    fixture.detectChanges();
  };

  const barButtonFor = (label: string): HTMLButtonElement => {
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('.tl-bar')
    ) as HTMLButtonElement[];
    const button = buttons.find((b) => (b.getAttribute('aria-label') ?? '').includes(label));
    if (!button) {
      throw new Error(`Bar not found for label: ${label}`);
    }
    return button;
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a loading state', () => {
    component.loading = true;
    render();
    expect(fixture.nativeElement.textContent).toContain('Carregando');
  });

  it('should render an empty state when there are no items', () => {
    render([]);
    expect(fixture.nativeElement.querySelector('.tl-state')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Nenhum projeto');
  });

  it('should render a validation-error state for invalid dates', () => {
    const invalid: TimelineItem[] = [
      { id: 'p1', kind: 'project', label: 'P1', start: '', end: '', dependencies: [] },
      { id: 't1', kind: 'task', parentId: 'p1', label: 'Invertida', start: '2026-02-05', end: '2026-02-01', dependencies: [] },
    ];
    render(invalid);
    expect(fixture.nativeElement.querySelector('.tl-issue')).toBeTruthy();
  });

  it('should render labels and bars for scheduled items', () => {
    render();
    expect(fixture.nativeElement.querySelectorAll('.tl-label').length).toBe(
      TIMELINE_FIXTURE.length
    );
    expect(fixture.nativeElement.querySelectorAll('.tl-bar').length).toBe(TIMELINE_FIXTURE.length);
  });

  it('should emit selectItem on bar click', () => {
    render();
    const emitted: string[] = [];
    component.selectItem.subscribe((id) => emitted.push(id));

    barButtonFor('Desenvolver').click();
    fixture.detectChanges();

    expect(emitted).toEqual(['t2']);
    expect(component.selectedId).toBe('t2');
  });

  it('should select on Enter and Space keydown', () => {
    render();
    const button = barButtonFor('Desenvolver');

    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();
    expect(component.selectedId).toBe('t2');
  });

  it('should clear selection on Escape', () => {
    render();
    component.select('t2');
    fixture.detectChanges();

    barButtonFor('Desenvolver').dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    fixture.detectChanges();

    expect(component.selectedId).toBeNull();
  });

  it('should highlight direct predecessors and indirect ancestors', () => {
    render();
    component.select('t3');

    expect(component.isDirectPredecessor('t2')).toBeTrue();
    expect(component.isAncestor('t1')).toBeTrue();
    expect(component.isDirectPredecessor('t1')).toBeFalse();
  });

  it('should not mutate the source items', () => {
    const snapshot = JSON.stringify(TIMELINE_FIXTURE);
    render();
    component.select('t3');
    expect(JSON.stringify(TIMELINE_FIXTURE)).toBe(snapshot);
  });

  it('should recompute when config changes', () => {
    render();
    const widthBefore = component.layout.contentWidth;
    component.config = { ...component.config, unitWidth: 48 };
    expect(component.layout.contentWidth).not.toBe(widthBefore);
  });
});
