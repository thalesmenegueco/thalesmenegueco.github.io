import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLink, provideRouter } from '@angular/router';
import { PROGRESS_KEYS } from '@shared/progress';
import { routes } from '../app.routes';
import { StudiesComponent } from './studies.component';
import { STUDY_SUBJECTS } from './study-catalog';

/**
 * The hub is the platform's front door: it renders the catalogue, links what is
 * available, and stays honest about what is not.
 */
describe('StudiesComponent (hub)', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [StudiesComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  afterEach(() => localStorage.clear());

  function render() {
    const fixture = TestBed.createComponent(StudiesComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('renders every subject in the catalogue', () => {
    expect(
      (render().nativeElement as HTMLElement).querySelectorAll('.subject').length,
    ).toBe(STUDY_SUBJECTS.length);
  });

  it('links an available module to its canonical path, in-app', () => {
    const cta = render().debugElement.query(By.css('a.module-cta'));

    expect(cta.nativeElement.getAttribute('href')).toBe('/calculo/teoria');
    // The hub used to emit a plain `[href]`, which forced a full page load on
    // every course click. `routerLink` renders the same href but routes
    // client-side — asserted on the directive, since the rendered attribute is
    // identical either way.
    expect(cta.injector.get(RouterLink, null)).toBeTruthy();
  });

  it('shows a coming-soon module as unavailable and unlinked', () => {
    const element = render().nativeElement as HTMLElement;
    const unavailable = STUDY_SUBJECTS.flatMap((s) => s.modules).filter(
      (m) => m.status === 'coming-soon',
    );

    expect(unavailable.length).toBeGreaterThan(0);
    expect(element.querySelectorAll('.module-card--muted').length).toBe(
      unavailable.length,
    );
    expect(element.querySelector('.module-card--muted a.module-cta')).toBeNull();
    expect(
      element.querySelector('.module-card--muted .module-cta--disabled')
        ?.textContent,
    ).toContain('Em breve');
  });

  it('stays silent when nothing has been completed', () => {
    const element = render().nativeElement as HTMLElement;

    expect(element.querySelector('.hub-progress')).toBeNull();
    expect(element.querySelectorAll('.module-meta__done').length).toBe(0);
  });

  it('aggregates saved progress across the tracked modules', () => {
    localStorage.setItem(
      PROGRESS_KEYS.calculus,
      JSON.stringify(['lesson-1', 'lesson-2']),
    );
    localStorage.setItem(PROGRESS_KEYS.calculusPractice, JSON.stringify(['p1']));

    const element = render().nativeElement as HTMLElement;

    expect(element.querySelector('.hub-progress')?.textContent).toContain('3');
    expect(element.querySelectorAll('.module-meta__done').length).toBe(2);
  });
});
