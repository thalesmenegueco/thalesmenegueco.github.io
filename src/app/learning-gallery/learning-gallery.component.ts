import { Component } from '@angular/core';
import { InterestComponent } from './components/interest/interest';
import { Interest } from '../../models/interest';



@Component({
  selector: 'app-learning-gallery',
  standalone: true,
  imports: [InterestComponent],
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
];
}
