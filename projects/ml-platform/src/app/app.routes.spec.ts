import { routes } from './app.routes';
import { STUDY_SUBJECTS } from './studies/study-catalog';

/**
 * Encodes the Phase 3 gate — "every module route loads lazily" — as an
 * assertion instead of a grep over `dist/`, plus the catalogue/route contract:
 * every available module is reachable in both path forms, and a module that is
 * not available has no route at all.
 */
describe('app routes', () => {
  const paths = routes.map((route) => route.path);
  const moduleRoutes = routes.filter((route) => !!route.path && route.path !== '**');

  it('serves the hub at the root, eagerly', () => {
    const hub = routes.find((route) => route.path === '');

    expect(hub).toBeTruthy();
    expect(hub?.component).toBeTruthy();
    expect(hub?.loadComponent).toBeUndefined();
  });

  it('lazy-loads every module route and renders none eagerly', () => {
    expect(moduleRoutes.length).toBeGreaterThan(0);

    for (const route of moduleRoutes) {
      expect(route.loadComponent).toBeTruthy();
      expect(route.component).toBeUndefined();
    }
  });

  it('answers every available module on both of its paths', () => {
    for (const subject of STUDY_SUBJECTS) {
      for (const module of subject.modules) {
        if (module.status !== 'available' || !module.route) {
          continue;
        }

        expect(paths).toContain(module.route.replace(/^\//, ''));
        expect(paths).toContain(`curso/${subject.id}/${module.kind}/${module.id}`);
      }
    }
  });

  it('gives no route to a module that is not available', () => {
    for (const subject of STUDY_SUBJECTS) {
      for (const module of subject.modules) {
        if (module.status === 'available') {
          continue;
        }

        expect(paths).not.toContain(
          `curso/${subject.id}/${module.kind}/${module.id}`,
        );
      }
    }
  });
});
