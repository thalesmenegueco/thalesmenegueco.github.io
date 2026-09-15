import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { CalculusComponent } from './calculus/calculus.component';

/**
 * Proves the routing contract at runtime, not just on paper: the catalogue's
 * canonical path and the generalised path both resolve, and both pull in the
 * lazily-loaded module component. The build-time check is `app.routes.spec.ts`;
 * this is the one that actually navigates.
 */
describe('app routing', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
  });

  it('renders the hub at the root', async () => {
    const harness = await RouterTestingHarness.create('/');

    expect(harness.routeNativeElement?.querySelector('.studies-shell')).toBeTruthy();
  });

  it('resolves a module on its canonical path', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(
      '/calculo/teoria',
      CalculusComponent,
    );

    expect(component).toBeInstanceOf(CalculusComponent);
  });

  it('resolves the same module on its generalised path', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(
      '/curso/calculo/teoria/calculo-teoria',
      CalculusComponent,
    );

    expect(component).toBeInstanceOf(CalculusComponent);
  });

  it('sends an unknown path back to the hub', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/rota-que-nao-existe');

    expect(harness.routeNativeElement?.querySelector('.studies-shell')).toBeTruthy();
  });
});
