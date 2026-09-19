import { Routes } from '@angular/router';
import { EstudosLandingComponent } from './estudos/estudos-landing.component';
import { LearningGalleryComponent } from './learning-gallery/learning-gallery.component';
import { PLATFORM_LINKS } from './platform-links';
import { ExternalRedirectComponent } from './redirect/external-redirect.component';
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
 * the one real consumer — it hands this array to `provideRouter`.
 *
 * The `estudos` surface — its hub plus the three Cálculo modules — moved to the
 * `ml-platform` app in Phase 3 and its routes left this file in the same commit
 * (hazard H1), because leaving them behind would have made this app fail to
 * compile. Phase 4 puts the path back in two halves: a thin landing page at
 * `/estudos` (step 2), and redirect stubs for the old deep URLs (step 3), since
 * merging is what removes Cálculo from this app's live deploy.
 *
 * **Order matters in the two blocks below, and it is not incidental.** Angular's
 * default `pathMatch` is `'prefix'`, so `{ path: 'tools' }` also matches
 * `tools/calculus`. The stubs are therefore declared *before* the generic
 * `tools` route rather than relying on the router's own specificity ordering.
 * `app.routes.spec.ts` asserts both halves of that — `/tools` still renders the
 * tools index, and `/tools/calculus` redirects — so a future reorder fails the
 * suite instead of silently sending visitors to the wrong page.
 */
export const routes: Routes = [
  { path: 'project-gallery', component: LearningGalleryComponent },

  // Phase 4 step 2 — the platform's landing page, keeping the nav entry's
  // meaning ("Exatas em Movimento") after the hub itself moved away.
  {
    path: 'estudos',
    component: EstudosLandingComponent,
    title: 'VisuaLab — cursos interativos de exatas',
  },

  // Phase 4 step 3 — the retired deep URLs. GitHub Pages cannot issue a real
  // 301, so these are routes that hand off to the platform from the client.
  // They work because the deploy workflow copies the built `index.html` over
  // `404.html`, which means a deep link boots the SPA with its path intact.
  {
    path: 'estudos/calculo/teoria',
    component: ExternalRedirectComponent,
    data: { redirectTo: PLATFORM_LINKS.calculoTeoria },
  },
  {
    path: 'estudos/calculo/aplicada',
    component: ExternalRedirectComponent,
    data: { redirectTo: PLATFORM_LINKS.calculoAplicada },
  },
  {
    path: 'estudos/calculo/processo',
    component: ExternalRedirectComponent,
    data: { redirectTo: PLATFORM_LINKS.calculoProcesso },
  },
  // `/tools/calculus` already forwarded to `/estudos/calculo/teoria` before the
  // move, so it inherits that destination rather than getting a new one.
  {
    path: 'tools/calculus',
    component: ExternalRedirectComponent,
    data: { redirectTo: PLATFORM_LINKS.calculoTeoria },
  },

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
