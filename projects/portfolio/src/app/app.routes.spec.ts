import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { EstudosLandingComponent } from './estudos/estudos-landing.component';
import { OnePageComponent } from './one-page/one-page.component';
import { PLATFORM_LINKS } from './platform-links';
import { ProjectsComponent } from './projects/projects';
import { ExternalNavigator } from './redirect/external-navigator';
import { ExternalRedirectComponent } from './redirect/external-redirect.component';

/**
 * The routing contract, asserted against the real router rather than read off
 * the route table.
 *
 * Two claims are load-bearing here. The first pair pins the tools ordering:
 * Angular's default `pathMatch` is `'prefix'`, so `{ path: 'tools' }` also
 * matches `tools/calculus`; the stub therefore has to be declared before it,
 * and a reorder of the route file has to fail the suite rather than silently
 * send visitors to the wrong page.
 *
 * The rest cover the one-page migration: `/` is the scroll portfolio,
 * `/project-gallery` still resolves (it is linked from older posts and the
 * README) and the retired Cálculo URLs still hand off to the platform.
 *
 * `ExternalNavigator` is replaced with a spy because the real one calls
 * `window.location.replace`, which in a Karma browser would tear the test
 * runner out of its own page.
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

  it('renders the scroll portfolio at the root', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/', OnePageComponent);

    expect(component).toBeInstanceOf(OnePageComponent);
    expect(navigatorSpy.go).not.toHaveBeenCalled();
  });

  it('still resolves the retired /project-gallery URL to the one-page root', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(
      '/project-gallery',
      OnePageComponent,
    );

    expect(component).toBeInstanceOf(OnePageComponent);
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

  it('sends an unknown path back to the one-page root', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/rota-que-nao-existe', OnePageComponent);

    expect(component).toBeInstanceOf(OnePageComponent);
    expect(navigatorSpy.go).not.toHaveBeenCalled();
  });
});
