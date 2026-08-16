# Test-LLMs — Cloudflare Worker (Workers AI)

Proxy serverless que chama o **Workers AI** da Cloudflare e devolve a resposta em
**SSE (streaming)** para o front Angular do "LLM Local".

## Por que existe?

O caminho local (WebGPU/WASM) falha na maioria dos celulares (sem WebGPU, e o
`onnxruntime-web` multithread exige `SharedArrayBuffer`, que o GitHub Pages não serve).
Este worker oferece uma terceira camada **online**, sem API key externa: a conta da
Cloudflare fica no servidor, nunca no JavaScript do front.

## Deploy

1. Crie um projeto Cloudflare (ou use um existente) e copie esta pasta (`test-llms`).

   ```bash
   npm create cloudflare@latest -- test-llms
   # ou crie manualmente: coloque wrangler.jsonc + src/index.ts
   ```

2. Instale as dependências de dev:

   ```bash
   npm i -D wrangler @cloudflare/workers-types
   ```

3. Faça login e publique:

   ```bash
   npx wrangler login
   npx wrangler deploy
   ```

4. Copie a URL gerada (ex.: `https://test-llms.<subdomínio>.workers.dev`) e cole em
   `src/app/projects/componentized-projects/test-llms/services/cloud-backend.ts`
   na constante `CLOUD_WORKER_URL` (troque o placeholder `https://test-llms.<SUB>.workers.dev`).

## Testar localmente

```bash
npx wrangler dev
```

> `wrangler dev` também consome a cota do Workers AI da sua conta.

## Observações

- **Free tier**: o Workers AI tem cota diária gratuita de tokens. Para uso real, considere
  rate limit por IP no worker.
- **CORS**: só são aceitas origens em `ALLOWED_ORIGINS` (`https://thalesmenegueco.github.io`
  e `http://localhost:4200`). Ajuste se publicar em outro domínio.
- **Modelo**: `@cf/meta/llama-3.1-8b-instruct`. Os IDs do catálogo do Workers AI mudam com o
  tempo; confira o ID atual e troque a constante `MODEL` se necessário. Alternativa forte em
  pt-BR: `@cf/qwen/qwen2.5-7b-instruct`.
- **SSE**: o front consome o stream com `fetch` + `response.body.getReader()` (não usa
  `EventSource`, pois o `EventSource` só faz GET, sem body POST).
- **Endpoint público**: como qualquer front estático, este worker não tem autenticação.
  Aceitável para demo, limitado pela cota free tier.
