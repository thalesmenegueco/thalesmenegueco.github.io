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

export const routes: Routes = [
  { path: 'home', component: HomeComponent },              // Rota /home
  { path: 'project-gallery', component: LearningGalleryComponent }, // Rota /learning-gallery
  { path: 'projects', component: ProjectsComponent }, // Rota /projects 
  { path: 'projects/precificacao-semijoias', component: PrecificacaoPageComponent }, // Rota /projects/precificacao-semijoias
  { path: '', redirectTo: '/project-gallery', pathMatch: 'full' },   // Redirecionar raiz para /home
  { path: '**', redirectTo: '/project-gallery' }                     // Redirecionar rotas inválidas - PROBLEMA???
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }