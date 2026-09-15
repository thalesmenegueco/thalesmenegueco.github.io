import { Type } from '@angular/core';
import { Routes } from '@angular/router';
import { ModuleKind } from '@shared/learning';
import { StudiesComponent } from './studies/studies.component';
import { STUDY_SUBJECTS } from './studies/study-catalog';

/**
 * Which component renders which module.
 *
 * A module's existence, title and status are **data** (`STUDY_SUBJECTS`). The
 * component that teaches it is **code**, so the binding lives here. A module
 * whose `subject:kind` has no binding simply has no route, which is why the
 * catalogue can list `coming-soon` courses without any routing work.
 */
const MODULE_COMPONENTS: Record<string, () => Promise<Type<unknown>>> = {
  'calculo:teoria': () =>
    import('./calculus/calculus.component').then((m) => m.CalculusComponent),
  'calculo:aplicada': () =>
    import('./calculus-practice/calculus-practice.component').then(
      (m) => m.CalculusPracticeComponent,
    ),
  'calculo:processo': () =>
    import('./calculus-process-lab/calculus-process-lab.component').then(
      (m) => m.CalculusProcessLabComponent,
    ),
};

function moduleKey(subjectId: string, kind: ModuleKind): string {
  return `${subjectId}:${kind}`;
}

/**
 * One route per available module, generated from the catalogue. Every module
 * answers on two paths:
 *
 *  - its own `route` (`/calculo/teoria`) — canonical, memorable, and what the
 *    portfolio's Phase 4 redirect stubs will target;
 *  - the generalised form (`/curso/:subjectId/:moduleKind/:moduleId`), so a
 *    course is addressable by its position in the catalogue rather than by a
 *    hand-written path.
 *
 * Both entries share one lazily-loaded component, so the two forms cannot drift
 * apart. Note that the generalised path is generated *per available module*
 * rather than as a single parameterised route: choosing a component from route
 * parameters is a code decision (see `MODULE_COMPONENTS`), so a module with no
 * component correctly has no generalised route either.
 */
const moduleRoutes: Routes = STUDY_SUBJECTS.flatMap((subject) =>
  subject.modules.flatMap((module) => {
    const loadComponent = MODULE_COMPONENTS[moduleKey(subject.id, module.kind)];
    if (!loadComponent || !module.route) {
      return [];
    }

    return [
      {
        path: module.route.replace(/^\//, ''),
        loadComponent,
        title: module.title,
      },
      {
        path: `curso/${subject.id}/${module.kind}/${module.id}`,
        loadComponent,
        title: module.title,
      },
    ];
  }),
);

export const routes: Routes = [
  // The hub is eager on purpose: it is the landing surface, and lazy-loading it
  // would only add a round trip before first paint. It pulls in no course
  // widget — the same constraint every module route below obeys.
  {
    path: '',
    component: StudiesComponent,
    title: 'VisualML — Aprender Machine Learning visualmente',
  },
  ...moduleRoutes,
  { path: '**', redirectTo: '' },
];
