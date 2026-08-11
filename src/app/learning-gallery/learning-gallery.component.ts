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
    image: 'https://media-public.canva.com/uwdzU/MAFQ9vuwdzU/1/tl.png',
    link: 'https://www.tiktok.com/@sinal.fala'
  },
  {
    name: "Sinal Fala",
    description: 'Idiomas, cultura surda, tradução e neurodivergências (no tiktok)',
    image: 'https://media-public.canva.com/kcveY/MAEUZkkcveY/1/tl.png',
    link: 'https://www.tiktok.com/@sinais.sinapses'
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