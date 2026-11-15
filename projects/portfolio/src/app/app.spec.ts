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
   * The shell the visitor actually gets: skip link, sticky nav with the five
   * section anchors, the routed surface and the footer.
   *
   * The nav targets are asserted as `/#section` because that form is what
   * makes the nav work from `/tools` too — a bare `#section` would be a jump
   * to nothing on the tools pages. `app.routes.spec.ts` covers where they land.
   */
  it('should render the shell: skip link, nav anchors, outlet and footer', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const skipLink = compiled.querySelector('.skip-link');
    expect(skipLink?.getAttribute('href')).toBe('#conteudo');

    expect(compiled.querySelector('app-nav .nav__name')?.textContent).toContain(
      'Thales Menegueço',
    );

    const navTargets = [...compiled.querySelectorAll('app-nav .nav__links a')].map(
      (link) => link.getAttribute('href'),
    );
    expect(navTargets).toEqual([
      '/#sobre',
      '/#projetos',
      '/#ferramentas',
      '/#trajetoria',
      '/#contato',
    ]);

    expect(compiled.querySelector('router-outlet')).toBeTruthy();

    // The footer is where the outbound links live now, so every page gets them
    // without repeating the list inside each template.
    const footerHrefs = [...compiled.querySelectorAll('footer a')].map((link) =>
      link.getAttribute('href'),
    );
    expect(footerHrefs).toContain('/');
    expect(footerHrefs).toContain('/tools');
    expect(footerHrefs).toContain('https://github.com/thalesmenegueco');
  });
});
