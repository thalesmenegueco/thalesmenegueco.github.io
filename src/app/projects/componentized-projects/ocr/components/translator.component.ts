import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateProgress } from '../types';

@Component({
  selector: 'app-translator',
  standalone: true,
  imports: [],
  templateUrl: './translator.component.html',
  styleUrl: './translator.component.scss',
})
export class TranslatorComponent {
  @Input() sourceText = '';
  @Input() translatedText = '';
  @Input() isProcessing = false;
  @Input() progress: TranslateProgress | null = null;
  @Input() errorMessage: string | null = null;

  @Output() translate = new EventEmitter<void>();
  @Output() copyTranslated = new EventEmitter<void>();

  direction: 'pt-en' | 'en-pt' = 'pt-en';

  copyStatus: 'idle' | 'copied' | 'error' = 'idle';

  toggleDirection(): void {
    this.direction = this.direction === 'pt-en' ? 'en-pt' : 'pt-en';
  }

  onTranslate(): void {
    this.translate.emit();
  }

  async onCopyTranslated(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.translatedText);
      this.copyStatus = 'copied';
      setTimeout(() => (this.copyStatus = 'idle'), 2000);
    } catch {
      this.copyStatus = 'error';
      setTimeout(() => (this.copyStatus = 'idle'), 2000);
    }
  }

  get canTranslate(): boolean {
    return !!this.sourceText?.trim() && !this.isProcessing;
  }

  get progressPercent(): number {
    return Math.round((this.progress?.progress ?? 0) * 100);
  }
}
