/*
import { Routes } from '@angular/router';
export const routes: Routes = [];
*/


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // Importar o componente

export const routes: Routes = [
  { path: 'home', component: HomeComponent },              // Rota /home
  { path: '', redirectTo: '/home', pathMatch: 'full' },   // Redirecionar raiz para /home
  { path: '**', redirectTo: '/home' }                     // Redirecionar rotas inválidas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }