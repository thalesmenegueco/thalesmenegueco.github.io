import { Injectable } from '@angular/core';
import { createWorker, Worker } from 'tesseract.js';
import { OcrProgress } from '../types';

@Injectable({ providedIn: 'root' })
export class OcrService {
  private worker: Worker | null = null;
  private currentLang = '';

  async recognize(
    image: File | Blob | string,
    lang = 'por+eng',
    onProgress?: (p: OcrProgress) => void,
    signal?: AbortSignal
  ): Promise<string> {
    if (!this.worker || this.currentLang !== lang) {
      this.worker = await createWorker(lang, 1, {
        logger: (m) => {
          if (m.status === 'loading tesseract core' || m.status === 'recognizing text') {
            onProgress?.({
              status: m.status === 'loading tesseract core' ? 'loading' : 'recognizing',
              progress: m.progress ?? 0,
            });
          }
        },
      });
      this.currentLang = lang;
    }

    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const result = await this.worker.recognize(image);
    return result.data.text.trim();
  }

  async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      this.currentLang = '';
    }
  }
}
