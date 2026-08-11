/*
import { Routes } from '@angular/router';
export const routes: Routes = [];
*/


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // Importar o componente
import { LearningGalleryComponent } from './learning-gallery/learning-gallery.component'; // Importar o componente LearningGallery
import { ProjectsComponent } from './projects/projects'; // Importar o componente

import { PrecificacaoPageComponent } from './projects/pages/page-components/precificacao-page-component/precificacao-page-component';
import { SimpleMath } from './projects/componentized-projects/simple-math/simple-math';
import { ProjectManager } from './projects/componentized-projects/project-manager/project-manager';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },              // Rota /home
  { path: 'project-gallery', component: LearningGalleryComponent }, // Rota /learning-gallery
  { path: 'tools', component: ProjectsComponent }, // Rota /projects 
  { path: 'tools/precificacao-semijoias', component: PrecificacaoPageComponent }, // Rota /projects/precificacao-semijoias
  { path: 'tools/calcular-hipotenusa', component: SimpleMath }, // Rota /tools/calcular-hipotenusa
  { path: 'tools/project-manager', component: ProjectManager },
  { path: '', redirectTo: '/project-gallery', pathMatch: 'full' },   // Redirecionar raiz para /home
  { path: '**', redirectTo: '/project-gallery' }                     // Redirecionar rotas inválidas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }