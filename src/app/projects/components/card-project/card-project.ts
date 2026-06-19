import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-project',
  standalone: true,
  styleUrl: './card-project.scss',
  imports: [],
  template: `
    <div class= "group-interest">
      <div class="button-hover-shadow">
        <a [href]="link">
          <img [src]="image" alt="{{ name }}" class="image">
          <h2>{{ name }}</h2>  
          <div class="content">
            <div><span>{{ description }}</span></div>
          </div>
        </a>
      </div>
    </div>`,
})

export class CardProject {
  @Input() image!: string;
  @Input() name!: string;
  @Input() description!: string;
  @Input() link?: string;
}
