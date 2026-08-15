# Plano — Test-LLMs: chat local com LLM no navegador

## Objetivo

Criar uma nova ferramenta no Lab (`/tools/test-llms`) que baixa um modelo LLM leve
(`Qwen2.5-0.5B-Instruct-q4f16_1-MLC`) via `@mlc-ai/web-llm`, roda 100% no navegador
(WebGPU) e oferece um chat multi-turno com histórico.

## Decisões confirmadas

- **Modelo**: `Qwen2.5-0.5B-Instruct-q4f16_1-MLC` (~350–500 MB, cacheado no OPFS do navegador).
- **Chat**: multi-turno com histórico (mensagens de usuário e assistente) + botão de limpar conversa.
- **Dependência**: `@mlc-ai/web-llm@^0.2.84` **já está no `package.json`** — nenhuma instalação necessária.

## Decisões técnicas (seguindo padrões do repo)

- **Convenções**: standalone component, propriedades de classe simples (sem `signal()`, alinhado a
  `simple-math`/`project-manager`/`ocr`), `@if`/`@for`, kebab-case de arquivos, CSS vars do tema
  (`--color-surface`, `--color-text-accent`, `--color-text-secondary`, `--color-border`, `--radius-card`).
- **Engine**: `CreateWebWorkerEngine` (roda em worker, evita travar a UI) — não `CreateMLCEngine`.
- **Detecção de WebGPU**: como o `wasmSupported` do OCR, expor `isWebGpuSupported`
  (`'gpu' in navigator`) e exibir aviso amigável + desabilitar o botão de download quando ausente.
  Sem fallback WASM/CPU nesta versão (ver Riscos).
- **Serviço**: `LlmService` em `services/` (padrão do OCR), `@Injectable({ providedIn: 'root' })`.
- **Rotas**: carregamento **lazy** (`loadComponent`, como o `ocr`), para não inflar o bundle inicial.
- **Card**: novo item em `projects.ts` `interests[]`.
- **System prompt**: instruir o modelo a responder em português.

## Arquivos

### Novos
1. `src/app/projects/componentized-projects/test-llms/types.ts`
   - `export interface ChatMessage { role: 'system' | 'user' | 'assistant'; content: string }`
2. `src/app/projects/componentized-projects/test-llms/services/llm.service.ts`
   - `LlmService` com estado: `status`, `progressPercent`, `isReady`, `errorMessage`.
   - `get isWebGpuSupported(): boolean` (`typeof navigator !== 'undefined' && 'gpu' in navigator`).
   - `async initialize()`: chama `CreateWebWorkerEngine(modelId, { initProgressCallback })`;
     mapeia `report.progress` (0–1) → `progressPercent` (0–100) e `report.text` → `status` amigável (pt-BR);
     define `isReady`/`errorMessage` em sucesso/falha.
   - `async generate(messages: ChatMessage[]): Promise<string>`: injeta system prompt (pt-BR) e usa
     `engine.chat.completions.create({ messages })`; retorna `reply.choices[0].message.content`.
   - `async dispose()`: `engine?.dispose()` + reset de estado.
   - **Testabilidade**: a criação do engine fica atrás de um `InjectionToken` (factory que default
     para `CreateWebWorkerEngine`), para o spec fornecer um fake engine.
3. `src/app/projects/componentized-projects/test-llms/services/llm.service.spec.ts`
   - Fornece engine fake via `InjectionToken`; cobre: `isWebGpuSupported`, `initialize` sucesso/erro
     (mapeia progresso/status), `generate` (envia mensagens + system prompt e retorna conteúdo),
     erro quando não inicializado.

### Preencher (já existem vazios)
4. `test-llms.ts` — componente `TestLlms` (`selector: 'app-test-llms'`, `imports: [FormsModule]`):
   - `messages: ChatMessage[]`, `userInput = ''`, `isGenerating = false`, `webGpuSupported`.
   - `ngOnInit` captura `webGpuSupported`; `ngOnDestroy` chama `llm.dispose()`.
   - `downloadModel()` → `llm.initialize()`; `send()` → adiciona msg do usuário, chama `generate`,
     adiciona resposta, trata erro; `clearChat()` reseta `messages`.
5. `test-llms.html` — layout:
   - Cabeçalho + subtítulo (padrão `ocr.component.html`).
   - Aviso WebGPU (`@if (!webGpuSupported)`).
   - Estado "não pronto": botão `Baixar e Ativar IA` + barra de progresso (`status`/`progressPercent`).
   - Estado pronto: lista de mensagens (`@for`), input + botão `Enviar` (com `isGenerating`),
     botão `Limpar conversa`.
6. `test-llms.scss` — seguir `simple-math.scss`/`ocr.component.scss` (variáveis de tema, progress-bar
   reutilizável, responsivo).
7. `test-llms.spec.ts` — `TestBed.configureTestingModule` com `LlmService` mockado;
   "should create" + teste de `send()`/`clearChat()`.

### Editar
8. `src/app/app-routing.module.ts` — adicionar rota lazy:
   `{ path: 'tools/test-llms', loadComponent: () => import('./projects/componentized-projects/test-llms/test-llms').then(m => m.TestLlms) }`.
9. `src/app/projects/projects.ts` — adicionar card em `interests`:
   `{ name: 'LLM Local', description: 'Baixe e rode um LLM (Qwen 0.5B) direto no seu navegador', image: '<svgrepo url>', link: './tools/test-llms' }`.

## Ordem de execução

1. `types.ts`
2. `services/llm.service.ts`
3. `test-llms.ts` (componente)
4. `test-llms.html`
5. `test-llms.scss`
6. `test-llms.spec.ts` + `services/llm.service.spec.ts`
7. Rota em `app-routing.module.ts`
8. Card em `projects.ts`

## Validação

- `npm test` — novos specs passam (Karma/Jasmine).
- `npm run build` — build de produção OK (verificar chunk do web-llm; rota lazy não deve inflar bundle inicial).
- Manual (`ng serve` → `/tools/test-llms`):
  - Sem WebGPU → aviso exibido, botão desabilitado.
  - Com WebGPU → download com progresso; após concluir, chat multi-turno responde em pt-BR;
    `Limpar conversa` zera histórico; recarregar a página carrega do cache (rápido, sem novo download).
- Deploy (GitHub Pages): confirmar em produção que o modelo baixa (ver Riscos sobre headers).

## Riscos / observações

- **WebGPU indisponível** (navegadores antigos): exibir aviso e não tentar carregar. Fallback WASM/CPU
  (lento) fica fora de escopo; pode ser adicionado depois via opção do engine.
- **Headers de hospedagem**: GitHub Pages não permite definir `Cross-Origin-Opener-Policy` /
  `Cross-Origin-Embedder-Policy`. O web-llm v0.2.x funciona em hosting estático sem cross-origin
  isolation, mas validar em produção; se houver falha de carregamento, checar console e documentar.
- **Primeiro download (~350–500 MB)**: mostrar progresso claro; o cache OPFS evita re-download.
- **Tipos do WebLLM**: usar tipos exportados pelo pacote (`ChatCompletionMessageParam`) em vez de `as any`.
- **Streaming**: fora de escopo nesta versão (resposta única por turno, como no guia do usuário).
