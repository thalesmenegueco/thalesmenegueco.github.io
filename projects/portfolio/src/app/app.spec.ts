import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  /**
   * This test used to assert `Hello, learning-gallery` inside an `h1`.
   *
   * Neither exists: that heading was the Angular CLI template's placeholder, and
   * the shell this app actually renders is a nav, a `router-outlet` and a footer.
   * It survived Phase 1's rename to `portfolio` as a permanently failing test, so
   * it is replaced by assertions on the shell a visitor really gets — including
   * the two nav entry points, since those are the whole reason the shell exists.
   */
  it('should render the shell: brand, both nav entries and the router outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('nav h2')?.textContent).toContain('Thales Menegueço');

    const navTargets = [...compiled.querySelectorAll('nav a')].map((link) =>
      link.getAttribute('href'),
    );
    expect(navTargets).toEqual(['/project-gallery', '/estudos']);

    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
