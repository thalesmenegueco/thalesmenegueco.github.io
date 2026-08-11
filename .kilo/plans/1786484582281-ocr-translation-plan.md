# OCR & Translation Tool — Implementation Plan

## Goal
Add a fully offline, client-side OCR + translation tool at `/tools/ocr`, lazy-loaded to keep the main bundle under budget.

## Context
- Angular 20.1.0, standalone components, esbuild builder
- All existing projects are eagerly loaded; this will be the first lazy-loaded feature
- No existing services in the codebase; this will introduce the first injectable services
- Dark theme with CSS custom properties defined in `src/styles.scss`
- GitHub Pages deploy with `--base-href /`

## Key Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Translation model | Opus-MT (en↔pt) with NLLB-extensible architecture | Light first load (~30MB), service accepts model name parameter |
| Lazy loading | `loadComponent` on the main OCR container | Keeps Tesseract + Transformers out of main bundle |
| Sub-components | 4 child components per spec | Well-defined boundaries, each small and focused |
| Bounding box overlay | Skip in v1 | Canvas rendering adds complexity; can add later |
| Image preprocessing | Include basic downscale | Significant perf win; resize to max 1500px dimension |
| Cancellation | Include | UX necessity for long OCR runs |
| Progress | Include for both OCR and model download | Spec explicitly requires it |

## Files to Create

```
src/app/projects/componentized-projects/ocr/
├── ocr.component.ts          # Main container, orchestrates children
├── ocr.component.html        # Side-by-side layout
├── ocr.component.scss        # Grid/flexbox layout, dark theme
├── ocr.component.spec.ts     # Basic smoke tests
├── components/
│   ├── image-input.component.ts     # File picker + drag-drop + paste hint
│   ├── image-input.component.html
│   ├── image-input.component.scss
│   ├── image-preview.component.ts   # Image display
│   ├── image-preview.component.html
│   ├── image-preview.component.scss
│   ├── text-editor.component.ts     # Editable textarea + copy button
│   ├── text-editor.component.html
│   ├── text-editor.component.scss
│   ├── translator.component.ts      # Lang toggle + translate btn + progress
│   ├── translator.component.html
│   └── translator.component.scss
├── services/
│   ├── ocr.service.ts               # Tesseract.js worker wrapper
│   ├── translation.service.ts       # Transformers.js pipeline wrapper
│   └── image-clipboard.service.ts   # Paste event → Observable<Blob>
└── types.ts                         # OcrProgress, TranslateProgress interfaces
```

## Files to Modify

| File | Change |
|---|---|
| `package.json` | Add `tesseract.js@^6.0.0` and `@huggingface/transformers@^3.0.0` |
| `angular.json` | Increase initial bundle warning to 700KB (Tesseract+Transformers add overhead even lazy-loaded) |
| `src/app/app-routing.module.ts` | Add lazy route: `{ path: 'tools/ocr', loadComponent: () => import('...').then(m => m.OcrComponent) }` |
| `src/app/projects/projects.ts` | Add card entry for OCR tool |

## Implementation Steps (ordered)

### Step 1: Install dependencies
```bash
npm install tesseract.js@^6.0.0 @huggingface/transformers@^3.0.0
```

### Step 2: Create shared types
Create `src/app/projects/componentized-projects/ocr/types.ts` with:
- `OcrProgress { status: 'loading' | 'recognizing'; progress: number }`
- `TranslateProgress { status: 'downloading' | 'translating'; progress: number; modelSize?: string }`
- `LanguagePair { src: string; tgt: string; label: string }`

### Step 3: Create services
Create the three services, all `@Injectable({ providedIn: 'root' })`:

**ImageClipboardService**: Paste event listener → `Observable<Blob>`. Returns a cleanup function.

**OcrService**: Wraps `tesseract.js`. Key behaviors:
- Creates worker once via `createWorker(lang, 1)` (LSTM engine), caches and reuses
- `recognize(image, lang, onProgress)` returns text
- `terminate()` destroys worker
- Accepts abort signal for cancellation
- Rebuilds worker if language changes

**TranslationService**: Wraps `@huggingface/transformers`. Key behaviors:
- Constructor sets `env.allowLocalModels = false`
- `translate(text, modelName, srcLang, tgtLang, onProgress)` returns translated text
- Pipeline is cached per model name
- Model parameter enables NLLB swap later: `'Xenova/opus-mt-en-pt'` vs `'Xenova/nllb-200-distilled-600M'`
- `terminate()` disposes pipeline

### Step 4: Create child components

All children use `standalone: true`, accept `@Input()` and emit `@Output()`. Each follows existing codebase patterns (no Angular Material, plain HTML/SCSS, Angular 17+ `@for`/`@if`).

**ImageInputComponent**:
- File `<input>` with accept="image/*"
- Drag-and-drop zone with visual feedback (dashed border highlight)
- Paste hint text: "Tip: cole uma imagem com Ctrl+V"
- `@Output() imageSelected = new EventEmitter<File | Blob>()`
- Validates file type is image/*

**ImagePreviewComponent**:
- `@Input() imageSrc: string | null`
- Shows `<img>` with `max-height: 400px`, `object-fit: contain`
- Hides when `imageSrc` is null
- Loading spinner while image loads

**TextEditorComponent**:
- `@Input() text: string`
- `@Output() textChange = new EventEmitter<string>()`
- `<textarea>` bound to text, user can edit before translating
- Copy button (uses `navigator.clipboard.writeText`)
- Shows character count

**TranslatorComponent**:
- Language direction toggle: PT→EN / EN→PT (Opus-MT supports both directions as separate models, so v1 uses two model instances or a single en→pt with input swap logic)
- Translate button (disabled when no text or already processing)
- `@Input() sourceText: string`
- `@Output() translated = new EventEmitter<string>()`
- Progress bar during model download and translation
- Error display for failures

### Step 5: Create main OCR container

**OcrComponent** (standalone, imports all 4 children + `NgIf`/`NgFor` from `@angular/common`):
- Injects all 3 services
- `ngOnInit`: subscribes to clipboard paste events
- `handleImage(blob)`: creates object URL → shows preview → runs OCR → populates text editor
- `handleTranslate()`: calls translation service, shows result
- `ngOnDestroy`: calls `ocr.terminate()` and `translator.terminate()`, revokes object URLs
- Layout: side-by-side columns (image + recognized text + translation) on desktop, stacked on mobile
- Processing states: idle → recognizing → done → translating → done
- WASM support check on init — show error if `typeof WebAssembly === 'undefined'`

### Step 6: Register route (lazy-loaded)
In `src/app/app-routing.module.ts`:
```ts
{ path: 'tools/ocr', 
  loadComponent: () => import('./projects/componentized-projects/ocr/ocr.component')
    .then(m => m.OcrComponent) }
```
Remove any eager import. The `loadComponent` syntax is natively supported by the Angular 20 router with `provideRouter`.

### Step 7: Add card entry
In `src/app/projects/projects.ts`, add to `interests` array:
```ts
{ name: "OCR & Tradução",
  description: 'Extraia e traduza textos de imagens — 100% offline, direto no navegador',
  image: 'assets/ocr-card.png',
  link: './tools/ocr'
}
```

### Step 8: Update build budget
In `angular.json`, bump initial bundle warning to 700KB (Tesseract/Transformers add unavoidable baseline overhead even as lazy chunks).

### Step 9: Run tests and verify
```bash
npx ng test --include='**/ocr/**/*.spec.ts'
npx ng build --configuration production
```

## Edge Cases & Error Handling

| Scenario | Behavior |
|---|---|
| Non-image file pasted | Clipboard service silently ignores non-image/* items |
| Non-image file selected | ImageInput validates accept attribute; show inline error |
| Corrupt/unreadable image | OcrService catches Tesseract errors, component shows "Recognition failed" |
| Model download fails (network/CDN down) | TranslationService catches, component shows "Translation failed — check connection" |
| Browser lacks WASM | Show banner: "Seu navegador não suporta WebAssembly. Use Chrome, Firefox, ou Edge." |
| Very large image (>4000px) | Canvas downscale to max 1500px before OCR (in OcrService) |
| User navigates away during OCR | Component's `ngOnDestroy` calls `ocr.terminate()`, aborting the worker |
| Second visit (cached models) | Worker/pipeline creation is near-instant since data is cached in IndexedDB |
| Mobile viewport | Flexbox columns stack vertically; image constrained to viewport width |

## Translation Extensibility

The `TranslationService.translate()` accepts `modelName` as a parameter. To add NLLB later:
1. Add a model selector dropdown in `TranslatorComponent`
2. Pass `'Xenova/nllb-200-distilled-600M'` instead of `'Xenova/opus-mt-en-pt'`
3. Add language code mapping (e.g., `por_Latn`, `eng_Latn`)
No refactoring of the service interface needed.

## Performance Timeline (user-facing)

1. **First visit, cold cache:**
   - Page loads instantly (OCR chunk lazy, ~0KB in main bundle)
   - Navigate to `/tools/ocr` → chunk download (~50KB component code)
   - Upload image → Tesseract core + `por+eng` data download (~6MB) → OCR runs
   - Click translate → Opus-MT model download (~30MB) → translation runs
   
2. **Subsequent visits:**
   - OCR: worker reused if component not destroyed; otherwise ~2s to reload from cache
   - Translation: model loaded from IndexedDB, ~1s
