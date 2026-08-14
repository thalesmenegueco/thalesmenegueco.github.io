import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageOption, SUPPORTED_LANGUAGES, TranslateRequest } from '../types';

@Component({
  selector: 'app-translator',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './translator.component.html',
  styleUrl: './translator.component.scss',
})
export class TranslatorComponent {
  @Input() sourceText = '';
  @Input() translatedText = '';
  @Input() isProcessing = false;
  @Input() errorMessage: string | null = null;
  @Input() supported = true;
  @Input() canDetect = false;

  @Output() translate = new EventEmitter<TranslateRequest>();
  @Output() copyTranslated = new EventEmitter<void>();

  languages: LanguageOption[] = [...SUPPORTED_LANGUAGES];

  private _source = 'auto';
  target = 'en';

  copyStatus: 'idle' | 'copied' | 'error' = 'idle';

  get source(): string {
    if (!this.canDetect && this._source === 'auto') {
      return 'pt';
    }
    return this._source;
  }

  set source(value: string) {
    this._source = value;
  }

  onTranslate(): void {
    this.translate.emit({ source: this.source, target: this.target });
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
}
