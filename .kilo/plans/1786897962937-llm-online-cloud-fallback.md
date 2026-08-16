# Plano — Test-LLMs: fallback online (Cloudflare Workers AI) para mobile

## Objetivo

O "LLM Local" hoje roda local no navegador em duas camadas — WebGPU (Qwen 0.5B via
`@mlc-ai/web-llm`) e WASM/CPU (SmolLM2 135M/360M via `@huggingface/transformers`) — mas o
caminho WASM falha em Android (Chrome/Brave), porque WebGPU não está disponível na maioria dos
celulares e o `onnxruntime-web` multithread exige `SharedArrayBuffer` (que o GitHub Pages não
serve). Resultado: no mobile o usuário vê "Falha ao carregar o modelo…".

Objetivo: manter o caminho **local (privado)** como padrão no desktop e adicionar uma **terceira
camada online** — um Cloudflare Worker que chama **Workers AI** (sem API key externa) — usada como
padrão no **mobile**, com um seletor visível "Local (privado) / Online (nuvem)" para o usuário
trocar quando quiser. Respostas do online vêm por **streaming (SSE)**.

## Decisões confirmadas (com o usuário)

- **Autenticação**: proxy serverless (Cloudflare Worker) — a chave/conta fica no servidor, nunca no JS.
- **Provedor**: Cloudflare Workers AI (binding `AI`, sem API key separada; free tier diário).
- **Quando usa online**: padrão por dispositivo + toggle manual.
  - Mobile → padrão **Online**; Desktop → padrão **Local** (WebGPU→WASM, sem auto-fallback para nuvem).
  - Toggle "Local (privado) / Online (nuvem)" permite forçar o contrário.
  - Quando Online está ativo, exibir aviso claro: mensagens saem do dispositivo (vão à Cloudflare).
- **Streaming**: **sim** — o contrato `LlmBackend.generate` passa a receber um callback `onToken`.
  - Backend **cloud**: SSE real (tokens incrementais).
  - Backend **webgpu**: `stream: true` do web-llm (tokens incrementais).
  - Backend **wasm**: mantém resposta única; emite `onToken(textoCompleto)` uma vez no final.

## Arquitetura / fluxo

```
TestLlms (UI)
  └─ LlmService (fachada)  mode: 'local' | 'online'
       ├─ WebGpuBackend   (web-llm, Qwen 0.5B, stream:true)
       ├─ WasmBackend     (transformers.js, SmolLM2, não-stream)
       └─ CloudBackend    (fetch POST → Cloudflare Worker → Workers AI, SSE)
```

- `LlmService.initialize()` lê `mode`:
  - `'online'` → `CloudBackend` (sem download; `initialize()` resolve imediatamente).
  - `'local'` → fluxo atual: `webGpuDetector()` → WebGPU; se lançar erro de WebGPU → WASM;
    se ambos falharem, mantém o erro (não pula para nuvem automaticamente).
- `LlmService.generate(messages, onToken)` delega ao backend ativo, repassando `onToken`.
- Detecção de dispositivo unificada em `services/device.ts`, reusada pelo WASM (modelo 135M/360M)
  e pelo `LlmService` (modo padrão).

## Arquivos

### Novos — Worker Cloudflare (pasta raiz `cloudflare-worker/test-llms/`)

1. `cloudflare-worker/test-llms/wrangler.jsonc`
   ```jsonc
   {
     "name": "test-llms",
     "main": "src/index.ts",
     "compatibility_date": "2026-08-16",
     "ai": { "binding": "AI" }
   }
   ```

2. `cloudflare-worker/test-llms/src/index.ts`
   - `export interface Env { AI: Ai }`.
   - `const MODEL = '@cf/meta/llama-3.1-8b-instruct'` (constante; alternativa pt-BR forte:
     `@cf/qwen/qwen2.5-7b-instruct`).
   - `const ALLOWED_ORIGINS = ['https://thalesmenegueco.github.io', 'http://localhost:4200']`.
   - `fetch(request, env)`:
     - `OPTIONS` → 204 com headers CORS (`Access-Control-Allow-Origin` refletido se origem
       permitida, `Access-Control-Allow-Methods: POST, OPTIONS`, `Access-Control-Allow-Headers: Content-Type`).
     - `POST` → valida `Origin` contra `ALLOWED_ORIGINS` (403 se fora), lê JSON `{ messages }`
       (`{ role: 'system'|'user'|'assistant', content }[]`), chama
       `env.AI.run(MODEL, { messages, stream: true })`.
     - Streama resposta SSE (`Content-Type: text/event-stream`): para cada chunk
       `{ response: string }` → `data: {"token":"<json-escaped>"}\n\n`; ao final `data: [DONE]\n\n`.
     - Erro → resposta não-200 com JSON `{ error }` (para o client mostrar).
   - Manter system prompt do lado do client (já vem em `messages`), não aqui.

3. `cloudflare-worker/test-llms/README.md`
   - Passos: `npm create cloudflare@latest` (ou criar manualmente), colar os arquivos,
     `npx wrangler deploy`, copiar a URL gerada (`https://test-llms.<subdomínio>.workers.dev`)
     para `CLOUD_WORKER_URL` no Angular. Observações de free tier e CORS.

### Novos — Angular

4. `src/app/projects/componentized-projects/test-llms/services/device.ts`
   - `export interface DeviceInfo { isMobile: boolean; isLowMemory: boolean }`.
   - `export function detectDevice(): DeviceInfo` — extrai a heurística atual de
     `wasm-backend.ts` (`isLowCapacityDevice`): UA `Mobile|Android|iPhone|iPad|iPod`,
     `maxTouchPoints > 0 && screen.width < 1024`, `MacIntel && maxTouchPoints > 1` (iPad desktop),
     `navigator.deviceMemory <= 4`.
   - `isMobile` = UA mobile OU touch-tablet OU iPad-em-desktop-mode. `isLowMemory` = `deviceMemory <= 4`.

5. `src/app/projects/componentized-projects/test-llms/services/cloud-backend.ts`
   - `export const CLOUD_WORKER_URL = 'https://test-llms.<SUB>.workers.dev'` (placeholder a editar).
   - `CLOUD_WORKER_URL_TOKEN` (InjectionToken) + `CLOUD_FETCH` (InjectionToken, default `fetch.bind(globalThis)`)
     para testabilidade.
   - `CloudBackend implements LlmBackend`, `kind = 'cloud'`, `activeModelLabel = 'Llama 3.1 8B (Cloudflare)'`.
   - `initialize(onProgress)`: sem download; `onProgress({ 100, 'Online: pronto para conversar.' })` e resolve.
   - `generate(messages, onToken): Promise<string>`:
     - `fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ messages }) })`.
     - Se `!response.ok` → lê texto/JSON e lança `Error` amigável.
     - Lê `response.body.getReader()`, decodifica chunks, separa por `\n\n`, parseia linhas
       `data:`. Para cada `{ token }` chama `onToken(token)` e acumula em buffer; `[DONE]` encerra;
       resolve com o texto acumulado. Trata `AbortError`/network com mensagem amigável.
   - `dispose()`: aborta request em andamento (guardar `AbortController`); sem mais estado.

### Editar — Angular

6. `services/llm-backend.ts`
   - `export type LlmBackendKind = 'webgpu' | 'wasm' | 'cloud'`.
   - `export type LlmMode = 'local' | 'online'`.
   - `generate(messages: ChatMessage[], onToken: (token: string) => void): Promise<string>`.

7. `services/webgpu-backend.ts`
   - `generate(messages, onToken)`: usar `stream: true` em `chat.completions.create`, iterar
     `for await (const chunk of ...)` acumulando `chunk.choices[0]?.delta?.content`, chamando
     `onToken(delta)`; retorna texto completo.

8. `services/wasm-backend.ts`
   - `generate(messages, onToken)`: após receber `result` do worker, chamar `onToken(response.text)`
     uma vez e retornar. Worker (`llm-wasm.worker.ts`) fica **inalterado** (já devolve texto completo).
   - Trocar `isLowCapacityDevice` local por `detectDevice()` de `device.ts` (comportamento idêntico).

9. `services/llm.service.ts`
   - Novos campos públicos: `mode: LlmMode`, `isMobile: boolean`, `activeModel: string | null`
     (já existe), `activeBackend` (estender tipo).
   - `get defaultMode(): LlmMode` → `this.isMobile ? 'online' : 'local'` (via `detectDevice()`).
   - Construtor injeta `CloudBackend`; `dispose()` também chama `cloudBackend.dispose()`.
   - `setMode(mode: LlmMode): Promise<void>` — `dispose()` do backend atual, reseta `isReady`/erro,
     define `this.mode`.
   - `initialize()`: `mode === 'online'` → `initializeBackend(cloudBackend)`; senão fluxo WebGPU→WASM atual.
   - `generate(messages, onToken)` delega; `toFriendlyError` ganha mensagem específica para falha
     de rede/CORS do online ("Não foi possível conectar ao serviço online. Verifique sua conexão.").
   - Manter `initializeBackend` atualizando `activeModel` para cloud também (label do modelo).

10. `test-llms.ts`
    - Campos: `mode: LlmMode = this.llm.defaultMode`; `webGpuSupported`/`wasmSupported` mantidos.
    - `get isOnline()` e `get actionLabel()` (Online → "Conectar"; Local → "Baixar e Ativar IA").
    - `get canRun()`: Online → sempre `true`; Local → `webGpuSupported === true || wasmSupported`.
    - `setMode(mode)`: `await this.llm.setMode(mode); this.mode = mode;` (e limpar chat/erro se necessário).
    - `downloadModel()` → renomear/ajustar para `activate()` (mesma chamada `this.llm.initialize()`).
    - `send()` com streaming: empurra mensagem do usuário; captura `history = [...this.messages]`
      **antes** de criar um placeholder `assistant`; empurra `{ role:'assistant', content:'' }`;
      `await this.llm.generate(history, (token) => assistantMessage.content += token)`;
      ao final `assistantMessage.content = reply` (garante texto final); em erro, seta mensagem de erro.

11. `test-llms.html`
    - Seletor de modo no topo do card: dois botões "Local (privado)" / "Online (nuvem)" com estado ativo.
    - Aviso quando `mode === 'online'`:
      "Modo online: suas mensagens são enviadas à Cloudflare para processamento e não ficam apenas
      no seu dispositivo." (reusa `.llm-info-note`).
    - Bloco setup: texto/hint condicional (Online não menciona download de modelo; Local mantém hint atual).
    - Manter progresso apenas para Local; Online mostra status simples.
    - Streaming já funciona por mutação do mesmo `chat-bubble` (nenhuma mudança estrutural no chat).

12. `test-llms.scss`
    - `.mode-toggle` (flex, gap), `.mode-button` (estilo neutro) e `.mode-button--active`
      (fundo `var(--color-text-accent)`, texto `#111`), seguindo os botões existentes.

13. `services/llm.service.spec.ts`
    - Atualizar mocks para novo `generate(messages, onToken)` e `mode`/`CloudBackend`.
    - Novos casos: modo online escolhe cloud; modo local mantém WebGPU→WASM; `defaultMode`
      (mobile→online, desktop→local); `setMode` reseta estado; `dispose` chama cloud; streaming
      repassa `onToken`.

14. `test-llms.spec.ts`
    - Atualizar mock (`generate` com callback, `mode`, `defaultMode`, `setMode`, `isMobile`).
    - Novos casos: botão "Conectar" habilitado no online mesmo sem WebGPU/WASM; aviso online renderizado;
      streaming anexa tokens no placeholder; toggle chama `setMode`.

15. `src/app/projects/projects.ts` (opcional, baixa prioridade)
    - Descrição do card "LLM Local" → mencionar "local no navegador ou online (Cloudflare)".

## Ordem de execução

1. `services/device.ts` (extrai detector).
2. `services/llm-backend.ts` (tipos + assinatura `generate` com `onToken`).
3. `services/webgpu-backend.ts` (streaming) e `services/wasm-backend.ts` (emitir token único + `detectDevice`).
4. `services/cloud-backend.ts`.
5. `services/llm.service.ts` (fachada com `mode` + cloud + streaming).
6. `test-llms.ts` + `test-llms.html` + `test-llms.scss`.
7. `cloudflare-worker/test-llms/` (wrangler + worker + README).
8. Specs (`llm.service.spec.ts`, `test-llms.spec.ts`).
9. `npm test` e `npm run build`.

## Validação

- `npm test` — specs atualizados passam (Karma/Jasmine).
- `npm run build` — produção OK; transformers.js/web-llm continuam fora do bundle inicial; cloud
  backend é minúsculo (só `fetch`).
- Manual:
  - Desktop Chrome (WebGPU) → Local segue funcionando com streaming incremental.
  - Desktop Firefox (sem WebGPU) → Local via WASM responde (não-stream) sem regressão.
  - Android Chrome/Brave → padrão **Online**, chat responde por streaming, aviso de privacidade visível.
  - Toggle para "Local" no mobile → tenta WASM (pode falhar; erro amigável) — não quebra o app.
  - Toggle para "Online" no desktop → responde via Cloudflare, aviso visível.
  - CORS: abrir a página publicada e confirmar sem erro de preflight.

## Riscos / observações

- **Endpoint público**: o Worker não tem autenticação (mesma limitação de qualquer front estático).
  Aceitável para demo; limitado pelo free tier do Workers AI. Mitigação futura: rate limit por IP no
  Worker ou token rotativo. Fora de escopo agora.
- **Free tier / modelo**: `@cf/meta/llama-3.1-8b-instruct` com streaming; confirmar ID atual no
  catálogo do Workers AI (IDs mudam). `wrangler dev` também consome a cota da conta.
- **SSE via `fetch` + `getReader`**: funciona em navegadores modernos; não usar `EventSource`
  (só GET, sem body POST). Parsear por `\n\n` e tolerar eventos divididos entre chunks.
- **Streaming local**: web-llm suporta `stream:true`; transformers.js mantém não-stream (token único)
  para evitar rework do worker — interface unificada preserva a UI.
- **`CLOUD_WORKER_URL`**: placeholder que precisa ser substituído pela URL real do worker após deploy.
- **Privacidade**: deixar claro no aviso que o modo online envia o histórico da conversa à Cloudflare.

## Fora de escopo

- Autenticação/rate limiting do Worker além do free tier.
- Persistir a escolha Local/Online no `localStorage`.
- Corrigir o caminho WASM mobile (ex.: `numThreads: 1`/COOP-COEP) — a UI já oferece "Local" no
  mobile para quem quiser tentar, mas o padrão passa a ser Online.
