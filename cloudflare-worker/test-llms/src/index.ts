export interface Env {
  AI: Ai;
}

const MODEL = '@cf/meta/llama-3.1-8b-instruct';

const ALLOWED_ORIGINS = [
  'https://thalesmenegueco.github.io',
  'http://localhost:4200',
];

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type StreamChunk = { response?: unknown };

function isAllowedOrigin(origin: string | null): boolean {
  return origin !== null && ALLOWED_ORIGINS.includes(origin);
}

function corsHeaders(origin: string | null): Headers {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type');
  if (isAllowedOrigin(origin)) {
    headers.set('Access-Control-Allow-Origin', origin as string);
    headers.set('Vary', 'Origin');
  }
  return headers;
}

function jsonResponse(body: unknown, status: number, origin: string | null): Response {
  const headers = corsHeaders(origin);
  headers.set('Content-Type', 'application/json');
  return new Response(JSON.stringify(body), { status, headers });
}

function extractToken(chunk: unknown): string {
  if (typeof chunk === 'string') {
    try {
      const parsed = JSON.parse(chunk) as StreamChunk;
      return typeof parsed.response === 'string' ? parsed.response : '';
    } catch {
      return chunk;
    }
  }

  if (chunk && typeof chunk === 'object' && 'response' in chunk) {
    const response = (chunk as StreamChunk).response;
    return typeof response === 'string' ? response : '';
  }

  return '';
}

function toSseStream(stream: ReadableStream): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = stream.getReader();

      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          const token = extractToken(value);
          if (token) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`));
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (err) {
        controller.error(err);
        return;
      }

      controller.close();
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin');

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405, origin);
    }

    if (!isAllowedOrigin(origin)) {
      return jsonResponse({ error: 'Origin not allowed' }, 403, origin);
    }

    let body: { messages?: ChatMessage[] };
    try {
      body = (await request.json()) as { messages?: ChatMessage[] };
    } catch {
      return jsonResponse({ error: 'Corpo da requisição inválido.' }, 400, origin);
    }

    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return jsonResponse({ error: 'O campo "messages" é obrigatório.' }, 400, origin);
    }

    try {
      const stream = (await env.AI.run(MODEL, {
        messages: body.messages,
        stream: true,
      })) as ReadableStream;

      const headers = corsHeaders(origin);
      headers.set('Content-Type', 'text/event-stream');
      headers.set('Cache-Control', 'no-cache');

      return new Response(toSseStream(stream), { headers });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Falha no serviço de IA. Tente novamente.';
      return jsonResponse({ error: message }, 500, origin);
    }
  },
};
