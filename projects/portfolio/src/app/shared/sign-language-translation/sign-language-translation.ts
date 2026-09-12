import { Component, Input } from '@angular/core';
import {  SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-sign-language-translation',
  standalone: true,
  styleUrl: './sign-language-translation.scss',
  imports: [],
  template: `
    <div class="container-translation">
      <iframe [src]="linkForVideo" [title]="videoDescription" frameborder="0" allow="autoplay"></iframe>
    </div>`
})
export class SignLanguageTranslation {

  @Input() linkForVideo!:SafeResourceUrl;
  @Input() videoDescription?: string;
  
}
