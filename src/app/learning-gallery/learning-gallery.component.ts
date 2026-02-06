import { Component } from '@angular/core';
import { InterestComponent } from './components/interest/interest';
import { Interest } from '../../models/interest';
import { PageTranslation } from '../../models/pageTranslation';
import { SignLanguageTranslation } from '../shared/sign-language-translation/sign-language-translation';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';




@Component({
  selector: 'app-learning-gallery',
  standalone: true,
  imports: [InterestComponent, SignLanguageTranslation],
  templateUrl: './learning-gallery.component.html',
  styleUrl: './learning-gallery.component.scss'
})



export class LearningGalleryComponent {

  interests: Interest[] = [
  { name: "Língua de sinais",
    description: 'Perfil no Tiktok que fala sobre cultura surda e interpretação, em Libras + português',
    image: 'https://media-public.canva.com/uwdzU/MAFQ9vuwdzU/1/tl.png',
    link: 'https://www.tiktok.com/@sinais.sinapses'
  },
  { name: "Ciência de dados",
    description: 'Visualizar padrões de diagnóstico de autismo em adultos usando ciência de dados.',
    image: 'https://media-public.canva.com/P_-Pc/MAFM7jP_-Pc/1/tl.png',
    link:'https://github.com/thalesmenegueco/autism-screening-on-adults'
  },
  {
    name: "Neurodivergência",
    description: 'Perfil no Tiktok que fala sobre neurodivergência, em Libras + português.',
    image: 'https://media-public.canva.com/kcveY/MAEUZkkcveY/1/tl.png',
    link: 'https://www.tiktok.com/@sinais.sinapses'
  },
  {
    name: "Dev + IA",
    description: 'Laboratório público de desenvolvimento assistido por IA no Github, vem construir e aprender junto!',
    image: 'https://media-public.canva.com/vWzo0/MAG0udvWzo0/1/tl.png',
    link: 'https://github.com/thalesmenegueco/ai-assisted-dev-lab'
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