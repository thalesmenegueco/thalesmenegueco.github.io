import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImageInputComponent } from './components/image-input.component';
import { ImagePreviewComponent } from './components/image-preview.component';
import { TextEditorComponent } from './components/text-editor.component';
import { TranslatorComponent } from './components/translator.component';
import { OcrService } from './services/ocr.service';
import { TranslationService } from './services/translation.service';
import { ImageClipboardService } from './services/image-clipboard.service';
import { OcrProgress, TranslateProgress } from './types';

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
  translateProgress: TranslateProgress | null = null;
  errorMessage: string | null = null;
  translateError: string | null = null;
  wasmSupported: boolean | null = null;

  private objectUrls: string[] = [];
  private ocrAbortController: AbortController | null = null;

  constructor(
    private ocr: OcrService,
    private translator: TranslationService,
    private clipboard: ImageClipboardService
  ) {}

  ngOnInit(): void {
    this.wasmSupported = typeof WebAssembly !== 'undefined';
    this.clipboard.attach(document);
    this.clipboard.imagePasted.subscribe((blob) => this.handleImage(blob));
  }

  ngOnDestroy(): void {
    this.ocr.terminate();
    this.translator.terminate();
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

  handleTranslate(direction: 'pt-en' | 'en-pt'): void {
    if (!this.recognizedText.trim()) {
      return;
    }

    this.isTranslating = true;
    this.translateError = null;
    this.translatedText = '';

    // NLLB-200: single bidirectional model supporting both en↔pt.
    // FLORES-200 language codes: por_Latn (Portuguese), eng_Latn (English)
    const modelName = 'Xenova/nllb-200-distilled-600M';
    const srcLang = direction === 'pt-en' ? 'por_Latn' : 'eng_Latn';
    const tgtLang = direction === 'pt-en' ? 'eng_Latn' : 'por_Latn';

    this.translator
      .translate(
        this.recognizedText,
        modelName,
        srcLang,
        tgtLang,
        (p) => (this.translateProgress = p)
      )
      .then((text) => {
        this.translatedText = text;
      })
      .catch((err) => {
        console.error('Translation error:', err);
        this.translateError = 'Falha na tradução. Verifique sua conexão (o modelo precisa ser baixado na primeira execução).';
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
    this.translateProgress = null;
  }
}
