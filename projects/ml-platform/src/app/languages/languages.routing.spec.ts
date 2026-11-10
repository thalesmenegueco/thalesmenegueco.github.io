import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../app.routes';
import { LanguageHubComponent } from './language-hub.component';
import { MandarinReaderComponent } from './mandarin-reader.component';

/**
 * The languages surface is reachable without the exatas catalogue: both routes
 * are lazy, and both resolve at their real address. The build-time half is
 * `../app.routes.spec.ts`, which already sweeps every non-hub route for
 * `loadComponent`; this is the half that actually navigates.
 */
describe('languages routing', () => {
  const languageRoute = (path: string) =>
    routes.find((route) => route.path === path);

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
  });

  it('declares the hub and the reader as lazy routes', () => {
    for (const path of ['linguas', 'linguas/mandarim/:textId']) {
      const route = languageRoute(path);

      expect(route).withContext(path).toBeTruthy();
      expect(route?.loadComponent).withContext(path).toBeTruthy();
      expect(route?.component).withContext(path).toBeUndefined();
    }
  });

  it('renders the reading hub at /linguas', async () => {
    const harness = await RouterTestingHarness.create('/linguas');

    expect(harness.routeNativeElement?.querySelector('.language-hub')).toBeTruthy();
    expect(harness.routeDebugElement?.componentInstance).toBeInstanceOf(
      LanguageHubComponent,
    );
  });

  it('opens a reading at /linguas/mandarim/:textId', async () => {
    const harness = await RouterTestingHarness.create();

    const component = await harness.navigateByUrl(
      '/linguas/mandarim/hsk1-meu-domingo',
      MandarinReaderComponent,
    );

    expect(component).toBeInstanceOf(MandarinReaderComponent);
    expect(harness.routeNativeElement?.querySelector('.title')?.textContent).toContain(
      'Meu domingo',
    );
  });

  it('keeps an unknown text id inside the reader, not on a blank page', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/linguas/mandarim/nao-existe', MandarinReaderComponent);

    expect(harness.routeNativeElement?.querySelector('.reader-missing')).toBeTruthy();
  });
});
