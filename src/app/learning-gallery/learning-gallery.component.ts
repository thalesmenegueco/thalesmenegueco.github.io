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
    description: 'A comunidade surda tem me ensinado muito por meio da Libras - Língua Brasileira de Sinais',
    image: 'https://media-public.canva.com/uwdzU/MAFQ9vuwdzU/1/tl.png' 
  },
  { name: "Ciência de dados",
    description: 'Sempre gostei de entender as motivos por trás das coisas, agora tenho ferramentas para isso.',
    image: 'https://media-public.canva.com/P_-Pc/MAFM7jP_-Pc/1/tl.png'
  },
  {
    name: "Autismo",
    description: 'Canal no WhatsApp que fala sobre TEA (Transtorno do Espectro Autista) e suas vivências associadas.',
    image: 'https://media-public.canva.com/kcveY/MAEUZkkcveY/1/tl.png',
    link: 'https://whatsapp.com/channel/0029Vb5wSyFL7UVOqnmurb1Z'
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