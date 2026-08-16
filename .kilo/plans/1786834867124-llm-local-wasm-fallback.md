# Plano — Test-LLMs: fallback WASM (CPU) para navegadores sem WebGPU

## Objetivo

Hoje o "LLM Local" só roda quando o navegador tem WebGPU; sem WebGPU exibe um aviso
vermelho e desabilita o botão. O objetivo é permitir que **qualquer navegador** experimente
um LLM: manter o caminho WebGPU (web-llm) como primário e adicionar um **fallback local via
WebAssembly/CPU** com `@huggingface/transformers` (Transformers.js). Sem servidor, sem API key —
mesma promessa "local" do projeto, só que rodando em CPU quando não há GPU.

## Decisões confirmadas

- **Abordagem do fallback**: WASM local (Transformers.js) — não API na nuvem.
- **Modelos do fallback (WASM)**:
  - Desktop: `onnx-community/SmolLM2-360M-Instruct` (`dtype: 'q4'`, ~0,2 GB).
  - Mobile/memória baixa: `onnx-community/SmolLM2-135M-Instruct` (`dtype: 'q4'`, ~0,1 GB).
- **Mobile / low-RAM**: seleção automática — em dispositivos móveis ou com pouca RAM usa o modelo
  menor (135M) para caber na memória do aparelho.
- **Caminho WebGPU**: mantém `Qwen2.5-0.5B-Instruct-q4f16_1-MLC` via `@mlc-ai/web-llm`.

## Decisões técnicas (seguindo padrões do repo)

- **Backend selecionável**: extrair uma interface `LlmBackend` e transformar o `LlmService` em
  fachada que escolhe o backend. Segue o padrão de DI do repo (`InjectionToken` + factory default),
  como já feito em `LLM_ENGINE_FACTORY`/`WEBGPU_DETECTOR`.
- **Seleção automática**: em `initialize()`, se `webGpuDetector()` → `WebGpuBackend`; senão, se
  `typeof WebAssembly !== 'undefined'` → `WasmBackend`; senão erro amigável.
- **Fallback em runtime**: se o caminho WebGPU for escolhido mas o `initialize()` lançar
  `WebGPUNotAvailableError`/`WebGPUNotFoundError` (importados de `@mlc-ai/web-llm`), tenta o
  `WasmBackend` automaticamente. Erros de rede/download **não** disparam fallback (mantém o erro atual).
- **Worker dedicado para WASM** (`llm-wasm.worker.ts`), espelhando `llm.worker.ts`, para não travar
  a UI durante inferência em CPU. Transformers.js fica **fora do bundle inicial** (só carregado no
  chunk do worker, instanciado sob demanda) para respeitar o budget inicial de 1 MB.
- **Seleção de modelo WASM por capacidade do dispositivo**: `WASM_MODEL_DETECTOR` (novo
  `InjectionToken`) retorna o modelo conforme o aparelho — `135M` quando móvel (UA
  Mobile/Android/iPhone/iPad, ou `maxTouchPoints > 0 && screen.width < 1024`) **ou**
  `navigator.deviceMemory <= 4`; senão `360M`. Mantém 360M em desktops Firefox/Safari (sem
  `deviceMemory` e não-mobile).
- **Mensagens**: manter `ChatMessage[]` e `SYSTEM_PROMPT` (pt-BR) na fachada; cada backend formata
  para o seu engine (web-llm → `ChatCompletionMessageParam`; transformers.js → `apply_chat_template`).
- **Progresso WASM**: `pipeline(..., { progress_callback })` do transformers.js mapeia
  `{ status, file, progress }` → `progressPercent`/`status` amigável, igual ao caminho WebGPU.
- **Sem streaming** (fora de escopo): `generate()` continua retornando a resposta completa por turno.
- **Convenções**: standalone components, `@if`/`@for`, kebab-case, CSS vars do tema
  (`--color-surface`, `--color-text-accent`, `--color-text-secondary`, `--color-border`).

## Arquivos

### Novos

1. `src/app/projects/componentized-projects/test-llms/services/llm-backend.ts`
   - `export type LlmBackendKind = 'webgpu' | 'wasm'`
   - `export interface BackendProgress { progressPercent: number; status: string }`
   - `export interface LlmBackend { readonly kind: LlmBackendKind; initialize(onProgress: (p: BackendProgress) => void): Promise<void>; generate(messages: ChatMessage[]): Promise<string>; dispose(): Promise<void> }`

2. `src/app/projects/componentized-projects/test-llms/services/webgpu-backend.ts`
   - `WebGpuBackend` (`@Injectable`), injeta `LLM_ENGINE_FACTORY`.
   - Move a lógica atual de engine (worker + `CreateWebWorkerMLCEngine`, `initProgressCallback`,
     `chat.completions.create` com system prompt) para cá, expondo `LlmBackend`.
   - Reaproveita `MODEL_ID`, `SYSTEM_PROMPT` e o mapeamento de status (`toStatusText`).

3. `src/app/projects/componentized-projects/test-llms/services/wasm-backend.ts`
   - `WasmBackend` (`@Injectable`), injeta `WASM_WORKER_FACTORY` (novo `InjectionToken`, default
     `() => new Worker(new URL('../llm-wasm.worker', import.meta.url), { type: 'module' })`) e
     `WASM_MODEL_DETECTOR` (novo `InjectionToken`, default `detectWasmModel`).
   - Protocolo de mensagens com o worker: `init` / `progress` / `ready` / `generate` / `result` /
     `error` / `dispose`. Expõe `LlmBackend` com `kind: 'wasm'`.
   - Constantes: `WASM_MODEL_STANDARD = 'onnx-community/SmolLM2-360M-Instruct'`,
     `WASM_MODEL_SMALL = 'onnx-community/SmolLM2-135M-Instruct'`; `dtype: 'q4'`, `device: 'wasm'`.
   - `detectWasmModel()`: aplica a regra de capacidade (mobile/low-RAM → `WASM_MODEL_SMALL`) e
     retorna o id do modelo; o `WasmBackend` envia o modelo escolhido ao worker no `init` e expõe
     o nome escolhido para a UI (`activeModel`).

4. `src/app/projects/componentized-projects/test-llms/llm-wasm.worker.ts`
   - Worker que importa `@huggingface/transformers`, monta
     `pipeline('text-generation', modelId, { dtype: 'q4', device: 'wasm', progress_callback })`
     de forma lazy (na mensagem `init`), com `modelId` recebido da main thread (360M ou 135M).
   - Em `generate`: aplica `apply_chat_template` (system + histórico) via tokenizer e roda
     `generator(text, { max_new_tokens, do_sample: false })`; devolve o texto via `result`.
   - Configura `env` (cache do navegador ligado, caminhos WASM do onnxruntime via CDN padrão).

5. `src/app/projects/componentized-projects/test-llms/services/llm.service.spec.ts`
   - Testes da fachada: seleção de backend (webgpu vs wasm), fallback em runtime quando o
     `WebGpuBackend` lança erro de WebGPU, delegação de `generate`/`dispose`, mapeamento de progresso.

### Editar

6. `src/app/projects/componentized-projects/test-llms/services/llm.service.ts`
   - Vira fachada: mantém estado público (`status`, `progressPercent`, `isReady`, `errorMessage`)
     e adiciona `activeBackend: LlmBackendKind | null` e `activeModel: string | null` (nome do
     modelo WASM escolhido, ex.: SmolLM2-135M em mobile).
   - `initialize()`: detecta WebGPU → escolhe backend; injeta `WEBGPU_DETECTOR`, `WebGpuBackend`,
     `WasmBackend`; trata fallback em runtime; expõe `progressPercent`/`status` via callback comum.
   - `generate()`/`dispose()` delegam ao backend ativo; `dispose()` destrói ambos se necessário.
   - Remove a criação direta de engine (agora em `webgpu-backend.ts`).

7. `src/app/projects/componentized-projects/test-llms/test-llms.ts`
   - Adiciona `wasmSupported = typeof WebAssembly !== 'undefined'`.
   - `canRun = webGpuSupported === true || wasmSupported` (gatilho do botão).
   - Exibe em `llm.activeBackend` qual backend está ativo após `initialize()` e em
     `llm.activeModel` qual modelo WASM foi selecionado (pequeno aviso, ex.: "modelo menor por
     causa de memória limitada").

8. `src/app/projects/componentized-projects/test-llms/test-llms.html`
   - Substitui o aviso rígido por mensagens contextuais:
     - `webGpuSupported === false && wasmSupported` → nota informativa (não bloqueante):
       "WebGPU não detectado — o modelo rodará via WebAssembly (CPU), mais lento, mas funciona."
     - sem WebGPU e sem WebAssembly → mantém aviso de navegador incompatível.
   - Botão `Baixar e Ativar IA` habilitado quando `canRun` (não só `webGpuSupported === true`).
   - Mostra o modelo ativo (`llm.activeModel`) como dica discreta quando em modo WASM.

9. `src/app/projects/componentized-projects/test-llms/test-llms.scss`
   - Adiciona `.llm-info-note` (estilo informativo, cor `--color-text-accent`/neutra), mantendo
     `.webgpu-warning` para o caso de navegador totalmente incompatível.

10. `src/app/projects/componentized-projects/test-llms/test-llms.spec.ts`
    - Atualiza mock do `LlmService` (novo `activeBackend`, `wasmSupported`) e adiciona casos:
      botão habilitado com WASM (sem WebGPU), nota informativa renderizada, botão desabilitado
      apenas quando nem WebGPU nem WASM.

11. `package.json`
    - Adicionar dependência `@huggingface/transformers` (v3.x; resolver versão na implementação).

## Ordem de execução

1. `package.json` + `npm install @huggingface/transformers`.
2. `services/llm-backend.ts` (interface + tipos).
3. `services/webgpu-backend.ts` (extrai lógica atual).
4. `llm-wasm.worker.ts` + `services/wasm-backend.ts`.
5. Refatorar `services/llm.service.ts` em fachada.
6. Atualizar `test-llms.ts` + `test-llms.html` + `test-llms.scss`.
7. Atualizar `test-llms.spec.ts` + criar `services/llm.service.spec.ts`.
8. `npm test` + `npm run build`.

## Validação

- `npm test` — specs novos e atualizados passam (Karma/Jasmine).
- `npm run build` — produção OK; transformers.js/onnxruntime **não** inflam o bundle inicial
  (verificar chunks e budget de 1 MB).
- Manual (`ng serve` → `/tools/test-llms`):
  - Chrome/Edge com WebGPU → caminho WebGPU atual continua funcionando (sem regressão).
  - Firefox ou Safari (sem WebGPU) → nota informativa, botão habilitado, modelo SmolLM2 baixa
    (~0,2 GB no desktop), chat multi-turno responde em pt-BR (mais lento).
  - Dispositivo móvel / emulador com touch e tela pequena (ou `deviceMemory` baixo) → seleciona
    SmolLM2-135M (~0,1 GB); carrega e gera sem estourar a memória.
  - Simular falha de WebGPU em runtime (desativar GPU/`chrome://flags`) → fallback automático para WASM.
  - Recarregar a página → segundo carregamento usa cache do navegador.

## Riscos / observações

- **Compatibilidade de bundling**: `@huggingface/transformers`/`onnxruntime-web` com esbuild do
  Angular 20 pode exigir `allowedCommonJsDependencies` ou ajuste de assets. Validar no build;
  se o onnxruntime pedir assets `.wasm`, usar o CDN padrão do transformers.js (sem servidor nosso).
- **Worker-in-worker**: onnxruntime pode criar seus próprios workers (multithread). Se isso conflitar
  com o worker dedicado, cair para execução em thread principal (`device: 'wasm'`) e documentar o
  trade-off de jank na UI.
- **Nome/quantização do modelo**: confirmar que `onnx-community/SmolLM2-360M-Instruct` e
  `onnx-community/SmolLM2-135M-Instruct` possuem variante `q4` ONNX no Hub; ajustar os repo ids se
  necessário.
- **Detecção de dispositivo**: `navigator.deviceMemory` só existe no Chromium; iPadOS 13+ se passa
  por desktop Mac (usar `navigator.platform === 'MacIntel' && maxTouchPoints > 1` como heurística
  extra); UA sniffing é imperfeito — aceitar falsos positivos em favor de não estourar memória.
- **Performance CPU**: SmolLM2 em WASM é lento em dispositivos fracos — deixar claro na UI
  ("mais lento") e manter `max_new_tokens` moderado.
- **Primeiro download (0,1–0,2 GB conforme o modelo)**: mostrar progresso via `progress_callback`;
  cache do navegador evita re-download (padrão do transformers.js).
- **Streaming**: fora de escopo; resposta única por turno, como o caminho WebGPU atual.
