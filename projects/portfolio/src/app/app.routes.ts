import { Routes } from '@angular/router';
import { LearningGalleryComponent } from './learning-gallery/learning-gallery.component';
import { ProjectsComponent } from './projects/projects';

import { PrecificacaoPageComponent } from './projects/pages/page-components/precificacao-page-component/precificacao-page-component';
import { SimpleMath } from './projects/componentized-projects/simple-math/simple-math';
import { ProjectManager } from './projects/componentized-projects/project-manager/project-manager';

/**
 * The portfolio's routes.
 *
 * This file was `app-routing.module.ts`, which was a module in name only: it
 * exported a plain `Routes` array, and the `@NgModule` wrapper around that array
 * was never what the app bootstrapped. `main.ts` bootstraps through
 * `bootstrapApplication(AppComponent, appConfig)`, so `app.config.ts` was always
 * the one real consumer — it hands this array to `provideRouter`. The wrapper is
 * gone, together with `app.module.ts`, which nothing referenced.
 *
 * The `estudos` surface — its hub plus the three Cálculo modules — now lives in
 * the `ml-platform` app, see docs/migration-implementation-plan.md § Phase 3.
 * Its routes left this file in the same commit as the move (hazard H1), because
 * leaving them behind would have made this app fail to compile. What replaces
 * them is Phase 4's work: an `/estudos` landing page that points at the platform,
 * plus redirect stubs for the old deep URLs. Both are deliberately **not** here
 * yet — they need the platform's public address, and `ml-platform`'s own
 * `index.html` records why a provisional `*.vercel.app` URL is not good enough to
 * publish: pointing at it is worse than pointing at nothing.
 */
export const routes: Routes = [
  { path: 'project-gallery', component: LearningGalleryComponent },
  { path: 'tools', component: ProjectsComponent },
  { path: 'tools/precificacao-semijoias', component: PrecificacaoPageComponent },
  { path: 'tools/calcular-hipotenusa', component: SimpleMath },
  { path: 'tools/project-manager', component: ProjectManager },
  { path: 'tools/ocr', loadComponent: () => import('./projects/componentized-projects/ocr/ocr.component').then(m => m.OcrComponent) },
  { path: 'tools/test-llms', loadComponent: () => import('./projects/componentized-projects/test-llms/test-llms').then(m => m.TestLlms) },
  { path: 'tools/explore-data', loadComponent: () => import('./projects/componentized-projects/explore-data/explore-data').then(m => m.ExploreData) },
  { path: 'tools/measure-it', loadComponent: () => import('./projects/componentized-projects/measure-it/measure-it').then(m => m.MeasureIt) },
  { path: '', redirectTo: '/project-gallery', pathMatch: 'full' },
  { path: '**', redirectTo: '/project-gallery' }
];
