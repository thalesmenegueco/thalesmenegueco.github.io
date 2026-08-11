import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-image-input',
  standalone: true,
  imports: [],
  templateUrl: './image-input.component.html',
  styleUrl: './image-input.component.scss',
})
export class ImageInputComponent {
  @Input() disabled = false;
  @Output() imageSelected = new EventEmitter<File | Blob>();

  isDragging = false;
  errorMessage: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.validateAndEmit(file);
    }
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.validateAndEmit(file);
    }
  }

  private validateAndEmit(file: File): void {
    this.errorMessage = null;
    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Por favor, selecione um arquivo de imagem.';
      return;
    }
    this.imageSelected.emit(file);
  }
}
