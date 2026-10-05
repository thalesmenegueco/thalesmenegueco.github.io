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

  /**
   * The homepage's cards, in the order they read left to right.
   *
   * The order is deliberate: the two projects with a real product behind them
   * lead — Sinalize! then VisuaLab, both of which show a screenshot of the
   * running thing — and the tools lab follows. This is also why `Sinal Fala` is
   * no longer a card here: it is a TikTok channel rather than a project with a
   * product of its own, so as a card it was given the same weight as the two
   * real projects and, worse, sat *between* them. It closes the page as a quiet
   * strip instead — see `sinalFalaLink` and the template.
   *
   * The two cards with screenshots carry real prints instead of a borrowed icon:
   * a print of the running product says more in a glance than a generic glyph.
   * Both files live in `public/images/`, the folder `angular.json` actually
   * ships, so they resolve relative to `<base href="/">`.
   *
   * Both also set `roundedImage`, and that flag is why the card component has one
   * at all: a screenshot is an opaque rectangle, so a radius frames it, while the
   * SVG icon on the tools card is a transparent glyph that the same radius would
   * clip rather than frame. `card.scss` carries the pixel measurements.
   *
   * Screenshots and icons alike are sized by a shared media *height* rather than
   * a shared square box, which is what keeps the row on one baseline even though
   * these two prints are near-square rather than square (0.93 and 1.07).
   */
  interests: CardItem[] = [
  { name: "Sinalize!",
    description: 'Plataforma para Aprender Libras DE GRAÇA! 📚',
    image: 'images/sinalize-preview.png',
    link: 'https://www.sinalize.org',
    roundedImage: true
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
    description: 'Cursos interativos de Exatas 📐',
    image: 'images/visualab-preview.png',
    link: PLATFORM_LINKS.hub,
    roundedImage: true
  },
  {
    name: "Ferramentas",
    description: 'Ferramentas e Experimentos 🧪',
    image: 'https://www.svgrepo.com/show/489243/creativity-1.svg',
    link: '/tools'
  }
];

  /**
   * Where the Sinal Fala channel lives, now that it is not a card.
   *
   * Kept as a field rather than inlined in the template for the same reason
   * `platform-links.ts` exists: the component's outbound URLs sit together, so
   * moving one is one edit in one place.
   */
  readonly sinalFalaLink = 'https://www.tiktok.com/@sinal.fala';

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