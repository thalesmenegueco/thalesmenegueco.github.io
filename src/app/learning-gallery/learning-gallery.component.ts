import { Component } from '@angular/core';
import { CardComponent } from '../shared/card/card';
import { CardItem } from '../../models/card-item';
import { PageTranslation } from '../../models/pageTranslation';
import { SignLanguageTranslation } from '../shared/sign-language-translation/sign-language-translation';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-learning-gallery',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './learning-gallery.component.html',
  styleUrl: './learning-gallery.component.scss'
})

export class LearningGalleryComponent {

  interests: CardItem[] = [
  { name: "Sinalize!",
    description: 'Plataforma para Aprender de Libras DE GRAÇA!',
    image: 'https://www.svgrepo.com/show/489247/global.svg',
    link: 'https://www.sinalize.org'
  },
  {
    name: "Sinal Fala",
    description: 'Idiomas, cultura surda, tradução e neurodivergências (no tiktok)',
    image: 'https://www.svgrepo.com/show/489256/puzzle.svg',
    link: 'https://www.tiktok.com/@sinal.fala'
  },
  {
    name: "Lab de Apps",
    description: 'Laboratório de ferramentas (aleatórios)',
    image: 'https://www.svgrepo.com/show/489243/creativity-1.svg',
    link: 'https://thalesmenegueco.github.io/tools'
  }
];

  safeUrl: SafeResourceUrl;
  galleryPageTranslation: PageTranslation;

  constructor(private sanitizer: DomSanitizer) {
    const googleDriveUrl = 'https://drive.google.com/file/d/1zmGmxSO6K9euinx1KVMHSNURTMmgeMVb/preview';
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(googleDriveUrl);

    this.galleryPageTranslation = {
    linkForVideo: this.safeUrl,
    videoDescription: "Tradução em língua Brasileira de Sinais da galeria de interesses"
  }

  }

}