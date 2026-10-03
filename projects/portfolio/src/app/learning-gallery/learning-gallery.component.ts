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
  // The two cards for the projects themselves carry real screenshots instead of
  // a borrowed icon: a print of the running product says more in a glance than a
  // generic glyph, and these are the two worth the space. Both files live in
  // `public/images/`, the folder `angular.json` actually ships, so they resolve
  // relative to `<base href="/">` exactly as `icons/visualab.svg` does.
  //
  // A screenshot also costs a card something an icon never did: the two prints
  // are near-square but not square, so `card.scss` puts every card's media in a
  // square frame — otherwise a 24 px height difference between neighbouring
  // cards would shift their titles out of line. See the `aspect-ratio` note
  // there, which is a no-op for the square icons the other cards still use.
  { name: "Sinalize!",
    description: 'Plataforma para Aprender de Libras DE GRAÇA! 📚',
    image: 'images/sinalize-preview.png',
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
  // Like the Sinalize! card above, this one shows a real screenshot of the
  // platform rather than the `icons/visualab.svg` glyph it used to carry. That
  // icon is still shipped and still used as the platform's own favicon-style
  // mark; it is simply no longer what this card leads with.
  {
    name: "VisuaLab",
    description: 'Cursos interativos de exatas: entenda explorando, aplique em problemas reais 📐',
    image: 'images/visualab-preview.png',
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