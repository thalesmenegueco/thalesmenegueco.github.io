import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { EstudosLandingComponent } from './estudos/estudos-landing.component';
import { PLATFORM_LINKS } from './platform-links';
import { ProjectsComponent } from './projects/projects';
import { ExternalNavigator } from './redirect/external-navigator';
import { ExternalRedirectComponent } from './redirect/external-redirect.component';

/**
 * The Phase 4 contract, asserted against the real router rather than read off
 * the route table.
 *
 * The load-bearing claim is the first pair of tests. Angular's default
 * `pathMatch` is `'prefix'`, so `{ path: 'tools' }` also matches
 * `tools/calculus`; the stub therefore has to be declared before it. That is a
 * property of array order, which nothing else in the build would notice if
 * someone reordered the file — so `/tools` rendering the tools index and
 * `/tools/calculus` redirecting are both pinned here.
 *
 * `ExternalNavigator` is replaced with a spy because the real one calls
 * `window.location.replace`, which in a Karma browser would tear the test runner
 * out of its own page.
 */
describe('app routing', () => {
  const navigatorSpy = jasmine.createSpyObj<ExternalNavigator>('ExternalNavigator', ['go']);

  beforeEach(() => {
    navigatorSpy.go.calls.reset();
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        { provide: ExternalNavigator, useValue: navigatorSpy },
      ],
    });
  });

  it('still renders the tools index at /tools', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/tools', ProjectsComponent);

    expect(component).toBeInstanceOf(ProjectsComponent);
    expect(navigatorSpy.go).not.toHaveBeenCalled();
  });

  it('redirects /tools/calculus to the platform, not to the tools index', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(
      '/tools/calculus',
      ExternalRedirectComponent,
    );

    expect(component).toBeInstanceOf(ExternalRedirectComponent);
    expect(navigatorSpy.go).toHaveBeenCalledWith(PLATFORM_LINKS.calculoTeoria);
  });

  it('renders the landing page at /estudos', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/estudos', EstudosLandingComponent);

    expect(component).toBeInstanceOf(EstudosLandingComponent);
    expect(navigatorSpy.go).not.toHaveBeenCalled();
  });

  // Every retired Cálculo URL, paired with the platform route it must reach —
  // so a typo in one of them fails here rather than in production.
  const retiredUrls: ReadonlyArray<readonly [string, string]> = [
    ['/estudos/calculo/teoria', PLATFORM_LINKS.calculoTeoria],
    ['/estudos/calculo/aplicada', PLATFORM_LINKS.calculoAplicada],
    ['/estudos/calculo/processo', PLATFORM_LINKS.calculoProcesso],
  ];

  for (const [oldUrl, expectedTarget] of retiredUrls) {
    it(`sends ${oldUrl} to ${expectedTarget}`, async () => {
      const harness = await RouterTestingHarness.create();
      await harness.navigateByUrl(oldUrl, ExternalRedirectComponent);

      expect(navigatorSpy.go).toHaveBeenCalledWith(expectedTarget);
    });
  }

  it('sends an unknown path back to the gallery', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/rota-que-nao-existe');

    expect(harness.routeNativeElement).toBeTruthy();
    expect(navigatorSpy.go).not.toHaveBeenCalled();
  });
});
