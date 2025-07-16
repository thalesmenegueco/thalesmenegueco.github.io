import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [
    AppRoutingModule,
    AppComponent,
    HomeComponent
  ],
  providers: []
})
export class AppModule { }