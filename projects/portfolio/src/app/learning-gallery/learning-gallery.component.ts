import { Component } from '@angular/core';
import { CardComponent } from '../shared/card/card';
import { CardItem } from '../../models/card-item';
import { PLATFORM_LINKS } from '../platform-links';
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
    description: 'Plataforma para Aprender de Libras DE GRAÇA! 📚',
    image: 'https://www.svgrepo.com/show/489247/global.svg',
    link: 'https://www.sinalize.org'
  },
  {
    name: "Sinal Fala",
    description: 'Idiomas, cultura surda, tradução e neurodivergências (no tiktok) 👋',
    image: 'https://www.svgrepo.com/show/489256/puzzle.svg',
    link: 'https://www.tiktok.com/@sinal.fala'
  },
  {
    name: "Lab de Ferramentas",
    description: 'Laboratório de ferramentas (aleatórias) 🧪',
    image: 'https://www.svgrepo.com/show/489243/creativity-1.svg',
    link: '/tools'
  },
  // Phase 4 step 4 — the portfolio half of the cross-link. The platform's own
  // footer already points back here, so these two are what tie the sites
  // together once Cálculo stops being reachable from this origin.
  //
  // The icon is a local asset rather than another svgrepo URL: every other card
  // borrows a remote image, and adding one more dependency for a card about
  // *this* project seemed like the wrong trade. `public/` is what
  // `angular.json` actually ships, so this resolves under `<base href="/">`.
  {
    name: "VisuaLab",
    description: 'Cursos interativos de exatas: entenda explorando, aplique em problemas reais 📐',
    image: 'icons/visualab.svg',
    link: PLATFORM_LINKS.hub
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