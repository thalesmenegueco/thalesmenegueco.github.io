import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImageInputComponent } from './components/image-input.component';
import { ImagePreviewComponent } from './components/image-preview.component';
import { TextEditorComponent } from './components/text-editor.component';
import { TranslatorComponent } from './components/translator.component';
import { OcrService } from './services/ocr.service';
import { TranslationService } from './services/translation.service';
import { ImageClipboardService } from './services/image-clipboard.service';
import { OcrProgress, TranslateRequest } from './types';

@Component({
  selector: 'app-ocr',
  standalone: true,
  imports: [
    ImageInputComponent,
    ImagePreviewComponent,
    TextEditorComponent,
    TranslatorComponent,
  ],
  templateUrl: './ocr.component.html',
  styleUrl: './ocr.component.scss',
})
export class OcrComponent implements OnInit, OnDestroy {
  imageSrc: string | null = null;
  recognizedText = '';
  translatedText = '';
  isProcessing = false;
  isTranslating = false;
  ocrProgress: OcrProgress | null = null;
  errorMessage: string | null = null;
  translateError: string | null = null;
  wasmSupported: boolean | null = null;
  translatorSupported = false;
  translatorCanDetect = false;

  private objectUrls: string[] = [];
  private ocrAbortController: AbortController | null = null;

  constructor(
    private ocr: OcrService,
    private translator: TranslationService,
    private clipboard: ImageClipboardService
  ) {}

  ngOnInit(): void {
    this.wasmSupported = typeof WebAssembly !== 'undefined';
    this.translatorSupported = this.translator.isSupported;
    this.translatorCanDetect = this.translator.canDetect;
    this.clipboard.attach(document);
    this.clipboard.imagePasted.subscribe((blob) => this.handleImage(blob));
  }

  ngOnDestroy(): void {
    this.ocr.terminate();
    this.translator.destroy();
    this.ocrAbortController?.abort();
    for (const url of this.objectUrls) {
      URL.revokeObjectURL(url);
    }
  }

  handleImage(blob: File | Blob): void {
    if (this.isProcessing) {
      this.ocrAbortController?.abort();
    }

    this.ocrAbortController = new AbortController();
    this.resetState();
    this.isProcessing = true;
    this.ocrProgress = { status: 'loading', progress: 0 };
    this.errorMessage = null;

    if (blob instanceof File && !blob.type.startsWith('image/')) {
      this.errorMessage = 'Por favor, selecione um arquivo de imagem.';
      this.isProcessing = false;
      return;
    }

    const url = URL.createObjectURL(blob);
    this.objectUrls.push(url);
    this.imageSrc = url;

    this.ocr
      .recognize(blob, 'por+eng', (p) => (this.ocrProgress = p), this.ocrAbortController.signal)
      .then((text) => {
        if (!this.ocrAbortController?.signal.aborted) {
          this.recognizedText = text;
          if (!text) {
            this.errorMessage = 'Nenhum texto reconhecido na imagem.';
          }
        }
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        this.errorMessage = 'Falha no reconhecimento. Verifique se a imagem contém texto legível.';
      })
      .finally(() => {
        if (!this.ocrAbortController?.signal.aborted) {
          this.isProcessing = false;
        }
      });
  }

  handleTranslate(request: TranslateRequest): void {
    if (!this.recognizedText.trim()) {
      return;
    }

    this.isTranslating = true;
    this.translateError = null;
    this.translatedText = '';

    this.translator
      .translate(this.recognizedText, request)
      .then((text) => {
        this.translatedText = text;
      })
      .catch((err) => {
        console.error('Translation error:', err);
        this.translateError =
          err instanceof Error
            ? err.message
            : 'Falha na tradução. Tente novamente.';
      })
      .finally(() => {
        this.isTranslating = false;
      });
  }

  cancelOcr(): void {
    this.ocrAbortController?.abort();
    this.isProcessing = false;
  }

  onTextChange(text: string): void {
    this.recognizedText = text;
    this.translatedText = '';
    this.translateError = null;
  }

  round(value: number): number {
    return Math.round(value);
  }

  private resetState(): void {
    this.recognizedText = '';
    this.translatedText = '';
    this.errorMessage = null;
    this.translateError = null;
  }
}
