# Browser-Based OCR & Translation Tool — Technical Spec

## Overview
Fully offline browser OCR + translation tool. No image data or text leaves the client.
Sub-project of portfolio at `thalesmenegueco.github.io/tools` → route `/tools/ocr`.
Stack: Angular 17+ (standalone components) + TypeScript + SCSS.

## Core Requirements
1. Upload image via file picker or clipboard paste (Ctrl+V) — no external processing
2. Return recognized text, editable by user
3. Translate recognized text to another language — no external API calls
4. Everything runs client-side via WASM + Web Workers

---

## Dependencies
```json
{
  "dependencies": {
    "tesseract.js": "^6.0.0",
    "@huggingface/transformers": "^3.0.0"
  }
}
```

### OCR: Tesseract.js v6
- Pure JS/WASM port of Tesseract OCR engine (Apache-2.0, 38k+ GitHub stars)
- 100+ languages: `por`, `eng`, `spa`, `fra`, etc.
- Runs in Web Worker → UI thread stays free
- Bundle: ~2 MB core + 1–4 MB per language data file (cached after first load)
- Returns text with bounding boxes (paragraph/word/char level)

### Translation: Transformers.js
- Runs ONNX models in-browser via WASM/WebGPU
- Model weights downloaded once from HuggingFace CDN, then cached in IndexedDB
- **No API calls at runtime** — all inference is local

**Model options (pick by use case):**

| Model | Size | Languages | When to use |
|---|---|---|---|
| `Xenova/opus-mt-en-pt` | ~30 MB | en↔pt only | Single pair, fastest, lightest |
| `Xenova/nllb-200-distilled-600M` | ~300 MB | 200 languages | Multi-language support needed |
| `Xenova/m2m100_418M` | ~200 MB | 100 languages | Middle ground |

**Recommended:** Start with Opus-MT for en↔pt (lighter), add NLLB if multi-language is required.

---

## Architecture

### Folder Structure
```text
src/app/features/ocr/
├── ocr.component.ts/html/scss     // Main container
├── components/
│   ├── image-input/                // File picker + drag-drop + paste hint
│   ├── image-preview/              // Canvas with optional bbox overlay
│   ├── text-editor/                // Editable recognized text
│   └── translator/                // Source/target lang selector + translate btn
├── services/
│   ├── ocr.service.ts              // Wraps Tesseract worker
│   ├── translation.service.ts      // Wraps Transformers.js pipeline
│   └── image-clipboard.service.ts  // Paste event handling
└── workers/
    └── tesseract.worker.ts         // Dedicated OCR worker (optional isolation)
```

### Lazy Loading
Load the entire OCR module lazily via Angular `loadComponent` or `loadChildren` to keep initial bundle small. The portfolio landing page must stay fast.

---

## Key Code Snippets

### 1. ImageClipboardService — Paste Handling
```typescript
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ImageClipboardService {
  private imagePasted$ = new Subject<Blob>();
  readonly imagePasted = this.imagePasted$.asObservable();

  attachPasteListener(target: HTMLElement | Document = document): () => void {
    const handler = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items ?? [];
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const blob = item.getAsFile();
          if (blob) {
            e.preventDefault();
            this.imagePasted$.next(blob);
          }
        }
      }
    };
    target.addEventListener('paste', handler);
    return () => target.removeEventListener('paste', handler);
  }
}
```

### 2. OcrService — Tesseract Worker Wrapper
```typescript
import { Injectable } from '@angular/core';
import createWorker, { Worker } from 'tesseract.js';

export interface OcrProgress {
  status: 'loading' | 'recognizing';
  progress: number; // 0..1
}

@Injectable({ providedIn: 'root' })
export class OcrService {
  private worker: Worker | null = null;
  private currentLang = '';

  async recognize(
    image: File | Blob | string,
    lang = 'por+eng',
    onProgress?: (p: OcrProgress) => void
  ): Promise<string> {
    // Create worker once, reuse for subsequent calls (HUGE perf win)
    if (!this.worker || this.currentLang !== lang) {
      this.worker = await createWorker(lang, 1, {
        logger: (m: any) => onProgress?.(m as OcrProgress),
      });
      this.currentLang = lang;
    }
    const { data: { text } } = await this.worker.recognize(image);
    return text.trim();
  }

  async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}
```

**Key perf points:**
- `createWorker(lang, 1, ...)` — the `1` selects LSTM engine (faster, more accurate)
- `lang = 'por+eng'` loads both — each extra lang adds 1–4 MB + load time
- Worker is cached → second image reuses it instantly
- Call `terminate()` in `ngOnDestroy`

### 3. TranslationService — Transformers.js Pipeline
```typescript
import { Injectable } from '@angular/core';
import { pipeline, env, TranslationPipeline } from '@huggingface/transformers';

env.allowLocalModels = false; // Use remote CDN, cached automatically

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private translator: TranslationPipeline | null = null;

  // Option A: NLLB (multi-language, ~300 MB)
  async translateNllb(
    text: string, srcLang: string, tgtLang: string
  ): Promise<string> {
    if (!this.translator) {
      this.translator = await pipeline(
        'translation', 'Xenova/nllb-200-distilled-600M'
      );
    }
    const output = await this.translator(text, {
      src_lang: srcLang,  // e.g. 'por_Latn'
      tgt_lang: tgtLang,  // e.g. 'eng_Latn'
    });
    return Array.isArray(output) ? output[0].translation_text : output.translation_text;
  }

  // Option B: Opus-MT (single pair, ~30 MB, faster)
  async translateOpus(text: string): Promise<string> {
    if (!this.translator) {
      this.translator = await pipeline(
        'translation', 'Xenova/opus-mt-en-pt'
      );
    }
    const output = await this.translator(text);
    return Array.isArray(output) ? output[0].translation_text : output.translation_text;
  }
}
```

**NLLB language codes:** `por_Latn`, `eng_Latn`, `spa_Latn`, `fra_Latn`, `deu_Latn`, `ita_Latn`

### 4. OcrComponent — Main Container (simplified)
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { OcrService } from './services/ocr.service';
import { TranslationService } from './services/translation.service';
import { ImageClipboardService } from './services/image-clipboard.service';

@Component({
  selector: 'app-ocr',
  standalone: true,
  templateUrl: './ocr.component.html',
})
export class OcrComponent implements OnInit, OnDestroy {
  imagePreview: string | null = null;
  recognizedText = '';
  translatedText = '';
  isProcessing = false;
  progress = 0;
  statusMessage = '';

  srcLang = 'por_Latn';
  tgtLang = 'eng_Latn';

  constructor(
    private ocr: OcrService,
    private translator: TranslationService,
    private clipboard: ImageClipboardService
  ) {}

  ngOnInit() {
    this.clipboard.imagePasted.subscribe((blob) => this.handleImage(blob));
  }

  ngOnDestroy() {
    this.ocr.terminate();
  }

  onFileSelected(file: File): void {
    this.handleImage(file);
  }

  private async handleImage(blob: Blob): Promise<void> {
    this.imagePreview = URL.createObjectURL(blob);
    this.isProcessing = true;
    this.statusMessage = 'Recognizing text...';
    try {
      this.recognizedText = await this.ocr.recognize(
        blob, 'por+eng',
        (p) => (this.progress = Math.round(p.progress * 100))
      );
    } catch {
      this.statusMessage = 'Recognition failed.';
    } finally {
      this.isProcessing = false;
    }
  }

  async onTranslate(): Promise<void> {
    if (!this.recognizedText) return;
    this.isProcessing = true;
    this.statusMessage = 'Translating... (first run downloads model)';
    try {
      this.translatedText = await this.translator.translateNllb(
        this.recognizedText, this.srcLang, this.tgtLang
      );
    } catch {
      this.statusMessage = 'Translation failed.';
    } finally {
      this.isProcessing = false;
      this.statusMessage = '';
    }
  }
}
```

---

## GitHub Pages Deployment Notes

- **baseHref:** Set to `/tools/` in `angular.json` or pass `--base-href /tools/` on build
- **HTTPS:** GitHub Pages is HTTPS-only → Web Workers, WASM, and Clipboard API all work
- **Model hosting:** HuggingFace CDN is the default source for Transformers.js models — works fine from GitHub Pages. For fully self-hosted, place `.onnx` files in repo `/assets/models/` and set `env.localModelPath`
- **Tesseract language data:** Default CDN is `https://tessdata.projectnaptha.com/4.0.0`. Can self-host in `/assets/tessdata/` if needed
- **No service worker conflicts:** Tesseract.js uses Cache API, Transformers.js uses IndexedDB — both work on GitHub Pages

---

## Performance Strategy

1. **Lazy load** the OCR module — don't include Tesseract in main bundle
2. **Create worker once, reuse** — never call `Tesseract.recognize()` directly (it spawns a new worker each time)
3. **Use LSTM engine** (`oem: 1`) — faster and more accurate than legacy
4. **Minimal language data** — only load `por+eng`, not all languages
5. **Image preprocessing** (optional): downscale large images before recognition — Tesseract works well at 300 DPI equivalent; oversized images just waste time
6. **Progress bars:** Show for both OCR (Tesseract provides logger) and model download (Transformers.js)
7. **Model size warning:** Inform user that first translation downloads ~30 MB (Opus-MT) or ~300 MB (NLLB) — cached after first run

---

## UX Polish (Portfolio-Quality)

- **Drag-and-drop zone** with visual feedback (not just file input)
- **Paste hint:** "Tip: paste an image with Ctrl+V"
- **Side-by-side layout:** image preview | recognized text | translated text
- **Bounding box overlay** (optional flex): Tesseract returns `data.words[].bbox` — draw on `<canvas>` over image to show what was recognized
- **Editable text area** for recognized text (user can fix OCR errors before translating)
- **Copy buttons** for both recognized and translated text
- **Language switcher** dropdown that rebuilds Tesseract worker with new language data
- **Cancellation** — allow stopping long OCR runs

---

## Accessibility

- Show `aria-live` status messages for processing states
- Progress bars must have `role="progressbar"` with `aria-valuenow`
- Canvas elements need `alt`/`aria-label`
- Keyboard-accessible file input and language selectors
- Clear error messages for: non-image paste, corrupt files, model download failure, unsupported browser

---

## Browser Compatibility

- **WASM:** All modern browsers (Chrome 57+, Firefox 52+, Safari 11+)
- **Web Workers:** All modern browsers
- **Clipboard API (paste):** Chrome, Firefox, Edge, Safari 13+
- **WebGPU (optional, faster model inference):** Chrome 113+, Firefox preview — Transformers.js falls back to WASM automatically
- **IndexedDB:** All modern browsers (for model caching)

---

## File Checklist for Generation

When building with Kilo Code, generate files like these:

1. `src/app/features/ocr/ocr.component.ts` — main container
2. `src/app/features/ocr/ocr.component.html` — layout template
3. `src/app/features/ocr/ocr.component.scss` — styles (flexbox/grid side-by-side)
4. `src/app/features/ocr/services/ocr.service.ts`
5. `src/app/features/ocr/services/translation.service.ts`
6. `src/app/features/ocr/services/image-clipboard.service.ts`
7. `src/app/features/ocr/components/image-input/image-input.component.ts`
8. `src/app/features/ocr/components/image-preview/image-preview.component.ts`
9. `src/app/features/ocr/components/text-editor/text-editor.component.ts`
10. `src/app/features/ocr/components/translator/translator.component.ts`
11. Route registration in app routing with `loadComponent` + `baseHref: '/tools/'`
12. `angular.json` — ensure assets include any self-hosted model/tessdata folders if used