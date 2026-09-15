import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    // The real route table, so this spec also fails if `app.routes.ts` stops
    // being buildable from the catalogue.
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  // Replaces the generated "Hello, ml-platform" assertion, which only passed
  // while the template was still the Angular placeholder. See
  // docs/migration-implementation-plan.md § Phase 3, prerequisite 4.
  it('should render the platform brand and the portfolio attribution', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.site-nav__brand')?.textContent).toContain('VisualML');
    expect(compiled.querySelector('.site-footer')?.textContent).toContain('Thales Menegueço');
  });
});
