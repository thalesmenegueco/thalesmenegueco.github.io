import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { HomeComponent } from './home/home.component';
// import { LearningGalleryComponent } from './learning-gallery/learning-gallery.component';

@NgModule({
  imports: [
    AppComponent,
    BrowserModule,
    AppRoutingModule
  ],
  providers: []
})
export class AppModule { }