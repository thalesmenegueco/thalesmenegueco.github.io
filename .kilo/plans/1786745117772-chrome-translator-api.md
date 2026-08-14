# Plano: substituir tradução por Chrome Translator API (OCR)

## Objetivo
Substituir a tradução atual (HuggingFace transformers) da página de OCR pela
Chrome Translator API, com suporte a PT/FR/IT/DE/EN, detecção automática de
idioma via LanguageDetector e fallback informativo para navegadores sem suporte.

## Estado atual (levantado no código)
- `src/app/projects/componentized-projects/ocr/services/translation.service.ts`
  usa `@huggingface/transformers` (NLLB-200 distilled 600M, baixa ~300MB na 1ª
  execução do par de idiomas).
- `components/translator.component.ts` tem toggle PT↔EN e barra de progresso de
  download do modelo.
- `ocr.component.ts` orquestra: `handleTranslate('pt-en' | 'en-pt')` envia
  `modelName/srcLang/tgtLang` e chama `this.translator.terminate()` no destroy.
- `types.ts` expõe `TranslateProgress` e `LanguagePair` (este último sem uso).
- Padrões do projeto: standalone components, `@Input()/@Output()`, sem signals,
  sem OnPush, SCSS com variáveis globais (`--color-text`, `--color-text-secondary`,
  `--color-text-accent`, `--radius-card`), componentes "burros" orquestrados por
  `OcrComponent`. Testes: Jasmine + Karma (`npm test`).

## Decisões
1. **Remover `@huggingface/transformers` completamente.** Fallback para navegador
   sem a API = apenas mensagem informativa (confirmado com o usuário).
2. **Idiomas:** `pt`, `en`, `fr`, `it`, `de`. UI = dois `<select>`:
   origem (com opção "Auto" quando LanguageDetector disponível) e destino.
   Padrões: origem = `auto` (ou `pt` sem detecção), destino = `en`.
3. **Detecção automática no serviço** quando origem = `auto` e `LanguageDetector`
   disponível. Normalizar o código BCP-47 detectado (ex.: `pt-BR` → `pt`) para o
   conjunto suportado; se não mapear, usar `pt`. Se origem === destino após
   detectar, retornar o texto sem chamar a API.
4. **Cache de `Translator` por par** (`Map` com chave `${src}|${tgt}`), recriando
   só quando o par muda; `LanguageDetector` como singleton; `destroy()` libera
   tudo no `ngOnDestroy`.
5. **Feature detection:** `'Translator' in self` e `'LanguageDetector' in self`
   (o `Translator` é exposto em `self`, conforme a spec).
6. **Remover a UI de progresso de download de modelo** (Chrome baixa o pacote de
   idioma automaticamente). Manter estado "Traduzindo..."; usar
   `Translator.availability()` para avisar quando o pacote precisar ser baixado
   na 1ª vez (`downloadable`) e tratar `unavailable` como erro.
7. **Tipos ambientais** das APIs em um `.d.ts` local (ainda não existem em
   `lib.dom.d.ts`).

## Tarefas (ordem de execução)

1. **Tipos ambientais** — criar
   `src/app/projects/componentized-projects/ocr/translator-api.d.ts` com
   `declare global` para `Translator`, `TranslatorAvailability`,
   `TranslatorCreateOptions` (`sourceLanguage`, `targetLanguage`, `monitor`),
   `LanguageDetector`, `LanguageDetectionResult` e os tipos do `monitor` de
   download. Expor no `Window & typeof globalThis`.

2. **`types.ts`** — remover `TranslateProgress` e `LanguagePair`; manter
   `OcrProgress`; adicionar:
   - `SUPPORTED_LANGUAGES: readonly LanguageOption[]` (`pt/en/fr/it/de` com
     rótulos).
   - `interface LanguageOption { code: string; label: string }`.

3. **Reescrever `TranslationService`** — nova implementação:
   - getters `isSupported` / `canDetect` (feature detection).
   - `normalizeLanguage(code: string): string | null` (mapeia variantes regionais
     para o conjunto suportado).
   - `translate(text, { source, target }): Promise<string>`:
     detectar se `source === 'auto'`; validar par com `Translator.availability()`;
     obter/criar translator do cache; `await translator.translate(text)`.
   - `destroy(): Promise<void>` — `destroy()` de todos os translators e do
     detector, limpar caches.
   - Remover imports e lógica do HuggingFace.

4. **Refatorar `TranslatorComponent`** — substituir o toggle por dois selects
   (importar `FormsModule`), opção "Auto" condicionada a `canDetect`, emitir
   `{ source, target }` via `@Output() translate`; remover `progress`/`TranslateProgress`
   e a UI de download; adicionar mensagem de fallback quando `!supported`
   (mantém o botão "Copiar tradução").

5. **Atualizar `OcrComponent`** — trocar `handleTranslate(direction)` por
   `handleTranslate({ source, target })`; remover `translateProgress` e as
   constantes NLLB; expor `translatorSupported`/`translatorCanDetect` para o
   template; trocar `this.translator.terminate()` por `this.translator.destroy()`
   no `ngOnDestroy`.

6. **Templates/estilos** — `ocr.component.html`: passar `[supported]`/`[canDetect]`
   ao `<app-translator>`. `translator.component.html`: selects + mensagem de
   fallback. `translator.component.scss`: estilo dos `<select>` coerente com os
   botões existentes (fundo `rgba(255,255,255,0.08)`, borda `0.15`, radius 8px) e
   uma classe de mensagem informativa (padrão do `.wasm-warning`).

7. **Remover dependência** — tirar `@huggingface/transformers` do `package.json`
   e rodar `npm install` (atualiza `package-lock.json`).

8. **Testes** — criar `translation.service.spec.ts` (mockar `self.Translator` e
   `self.LanguageDetector`; cobrir feature detection, cache por par — `create`
   chamado uma vez, caminho auto-detect, normalização e erro `unavailable`).
   Criar `translator.component.spec.ts` (selects renderizam e emitem
   `{ source, target }`). Garantir que `ocr.component.spec.ts` continua passando.

9. **Textos** — ajustar o subtítulo da página (`ocr.component.html`) e a descrição
   do card em `projects.ts` para refletir que a tradução exige o Chrome.

## Arquivos afetados
- `src/app/projects/componentized-projects/ocr/translator-api.d.ts` (novo)
- `src/app/projects/componentized-projects/ocr/types.ts`
- `src/app/projects/componentized-projects/ocr/services/translation.service.ts`
- `src/app/projects/componentized-projects/ocr/components/translator.component.ts`
- `src/app/projects/componentized-projects/ocr/components/translator.component.html`
- `src/app/projects/componentized-projects/ocr/components/translator.component.scss`
- `src/app/projects/componentized-projects/ocr/ocr.component.ts`
- `src/app/projects/componentized-projects/ocr/ocr.component.html`
- `src/app/projects/componentized-projects/ocr/services/translation.service.spec.ts` (novo)
- `src/app/projects/componentized-projects/ocr/components/translator.component.spec.ts` (novo)
- `package.json` / `package-lock.json`
- `src/app/projects/projects.ts` (texto do card, opcional)

## Riscos / notas
- **Disponibilidade:** Chrome Translator/LanguageDetector exigem Chrome 138+ e,
  atualmente, podem exigir flag/origin trial e contexto seguro (HTTPS/localhost).
  Fora do Chrome só a mensagem de fallback aparece.
- **Variantes regionais** no resultado do LanguageDetector (ex.: `pt-BR`); tratar
  com `normalizeLanguage`.
- **Origem === destino** após detecção: retornar texto sem chamar a API.
- **Pares não suportados:** `Translator.availability()` pode retornar
  `unavailable`; exibir mensagem de erro clara.

## Validação
- `npm run build` (typecheck strict + AOT com `strictTemplates`).
- `npm test` (Karma/Jasmine).
- Manual: no Chrome com a API habilitada, testar auto-detect, cada par de idiomas,
  e no Firefox confirmar a mensagem de fallback.

## Fora de escopo
- Manter tradução em navegadores sem Chrome (fallback por modelo).
- Tradução de idiomas fora do conjunto PT/FR/IT/DE/EN.
