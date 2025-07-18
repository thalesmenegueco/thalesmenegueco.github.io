/*
import { Routes } from '@angular/router';
export const routes: Routes = [];
*/


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // Importar o componente
import { LearningGalleryComponent } from './learning-gallery/learning-gallery.component'; // Importar o componente LearningGallery

export const routes: Routes = [
  { path: 'home', component: HomeComponent },              // Rota /home
  { path: 'learning-gallery', component: LearningGalleryComponent }, // Rota /learning-gallery
  { path: '', redirectTo: '/home', pathMatch: 'full' },   // Redirecionar raiz para /home
  { path: '**', redirectTo: '/home' }                     // Redirecionar rotas inválidas - PROBLEMA???
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }