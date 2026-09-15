/*
import { Routes } from '@angular/router';
export const routes: Routes = [];
*/


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { HomeComponent } from './home/home.component'; // Importar o componente
import { LearningGalleryComponent } from './learning-gallery/learning-gallery.component'; // Importar o componente LearningGallery
import { ProjectsComponent } from './projects/projects'; // Importar o componente

import { PrecificacaoPageComponent } from './projects/pages/page-components/precificacao-page-component/precificacao-page-component';
import { SimpleMath } from './projects/componentized-projects/simple-math/simple-math';
import { ProjectManager } from './projects/componentized-projects/project-manager/project-manager';

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
  // The estudo surface (estudos hub + the three Cálculo modules) moved to the
  // `ml-platform` app — see docs/migration-implementation-plan.md, Phase 3.
  // Its routes were removed here in the same commit as the move (hazard H1):
  // leaving them would make this app fail to compile. The `/estudos` hub route
  // comes back as a thin landing page pointing at the platform in Phase 4,
  // together with redirect stubs for `/estudos/calculo/*` and `/tools/calculus`.
  { path: '', redirectTo: '/project-gallery', pathMatch: 'full' },
  { path: '**', redirectTo: '/project-gallery' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }