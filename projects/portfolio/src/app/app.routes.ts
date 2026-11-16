import { Routes } from '@angular/router';
import { EstudosLandingComponent } from './estudos/estudos-landing.component';
import { OnePageComponent } from './one-page/one-page.component';
import { PLATFORM_LINKS } from './platform-links';
import { ProjectsComponent } from './projects/projects';
import { ExternalRedirectComponent } from './redirect/external-redirect.component';

import { PrecificacaoPageComponent } from './projects/pages/page-components/precificacao-page-component/precificacao-page-component';
import { SimpleMath } from './projects/componentized-projects/simple-math/simple-math';
import { ProjectManager } from './projects/componentized-projects/project-manager/project-manager';

/**
 * The portfolio's routes.
 *
 * The root is now the scroll portfolio (`OnePageComponent`): six sections,
 * anchor nav, one page. The old `/project-gallery` gallery it replaced is
 * gone as a page but kept as a redirect, because older posts and the README
 * still point at that URL and a 404 there would be the site's own problem.
 *
 * `/tools` and its apps are untouched surfaces with their own layouts; they
 * keep their routes and inherit the new palette through the legacy token
 * aliases in `styles.scss`. `/estudos` stays as the VisuaLab hand-off (Phase 4
 * of the migration), and the retired Cálculo deep links still forward to the
 * platform.
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
  {
    path: '',
    component: OnePageComponent,
    title: 'Thales Menegueço — construo o que imagino',
  },

  // Retired page, kept as a URL: the gallery's content now lives in the
  // one-page root's Projetos and Ferramentas sections.
  { path: 'project-gallery', redirectTo: '', pathMatch: 'full' },

  // The platform's landing page. The nav entry used to be "Exatas em
  // Movimento"; the platform now presents two labs (Lab das Formas and Lab das
  // Palavras), so this page promises both and links to both.
  {
    path: 'estudos',
    component: EstudosLandingComponent,
    title: 'VisuaLab — matemática e mandarim',
  },

  // Retired deep URLs. GitHub Pages cannot issue a real 301, so these are
  // routes that hand off to the platform from the client. They work because
  // the deploy workflow copies the built `index.html` over `404.html`, which
  // means a deep link boots the SPA with its path intact.
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

  { path: 'tools', component: ProjectsComponent, title: 'Lab de ferramentas — Thales Menegueço' },
  // Each tool gets a title of its own: before this, every tool page inherited
  // the one-page title in the tab, which is invisible on the page and wrong in
  // a history entry, a bookmark or a shared link.
  { path: 'tools/precificacao-semijoias', component: PrecificacaoPageComponent, title: 'Precificação de semijoias — Thales Menegueço' },
  { path: 'tools/calcular-hipotenusa', component: SimpleMath, title: 'Cálculos simples — Thales Menegueço' },
  { path: 'tools/project-manager', component: ProjectManager, title: 'Gerencie projetos — Thales Menegueço' },
  { path: 'tools/ocr', title: 'OCR & tradução — Thales Menegueço', loadComponent: () => import('./projects/componentized-projects/ocr/ocr.component').then(m => m.OcrComponent) },
  { path: 'tools/explore-data', title: 'Explore dados — Thales Menegueço', loadComponent: () => import('./projects/componentized-projects/explore-data/explore-data').then(m => m.ExploreData) },
  { path: 'tools/measure-it', title: 'Meça isto! — Thales Menegueço', loadComponent: () => import('./projects/componentized-projects/measure-it/measure-it').then(m => m.MeasureIt) },
  { path: '**', redirectTo: '' }
];
