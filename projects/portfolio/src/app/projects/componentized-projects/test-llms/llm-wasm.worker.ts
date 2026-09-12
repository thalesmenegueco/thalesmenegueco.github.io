import { env, pipeline } from '@huggingface/transformers';
import type {
  ProgressInfo,
  TextGenerationOutput,
  TextGenerationPipeline,
} from '@huggingface/transformers';
import type { ChatMessage } from './types';

env.allowRemoteModels = true;
env.allowLocalModels = false;
env.useBrowserCache = true;

let generator: TextGenerationPipeline | null = null;

type WasmRequest =
  | { type: 'init'; modelId: string }
  | { type: 'generate'; messages: ChatMessage[] }
  | { type: 'dispose' };

type WasmResponse =
  | { type: 'progress'; progressPercent: number; status: string }
  | { type: 'ready'; modelId: string }
  | { type: 'result'; text: string }
  | { type: 'error'; message: string };

type WorkerScope = {
  onmessage: ((event: MessageEvent) => void) | null;
  postMessage(message: unknown): void;
  close(): void;
};

const ctx = self as unknown as WorkerScope;

function post(message: WasmResponse): void {
  ctx.postMessage(message);
}

function mapProgress(info: ProgressInfo): { progressPercent: number; status: string } {
  switch (info.status) {
    case 'initiate':
      return { progressPercent: 0, status: `Preparando download de ${info.file}...` };
    case 'download':
      return { progressPercent: 0, status: `Baixando ${info.file}...` };
    case 'progress':
      return {
        progressPercent: Math.round(info.progress),
        status: `Baixando ${info.file} (${Math.round(info.progress)}%)`,
      };
    case 'done':
      return { progressPercent: 100, status: `Download concluído: ${info.file}` };
    case 'ready':
      return { progressPercent: 100, status: 'Modelo carregado. Pode conversar!' };
  }
}

async function handleInit(modelId: string): Promise<void> {
  generator = await createGenerator(modelId, (info) => {
    post({ type: 'progress', ...mapProgress(info) });
  });

  post({ type: 'ready', modelId });
}

function createGenerator(
  modelId: string,
  onProgress: (info: ProgressInfo) => void
): Promise<TextGenerationPipeline> {
  return pipeline<'text-generation'>('text-generation', modelId, {
    dtype: 'q4',
    device: 'wasm',
    progress_callback: onProgress,
  });
}

async function handleGenerate(messages: ChatMessage[]): Promise<void> {
  if (!generator) {
    post({ type: 'error', message: 'Modelo WASM ainda não foi carregado.' });
    return;
  }

  const output = (await generator(messages, {
    max_new_tokens: 256,
    do_sample: false,
  })) as TextGenerationOutput;

  const generated = output[0]?.generated_text;
  let text = '';

  if (Array.isArray(generated)) {
    const last = generated[generated.length - 1];
    text = typeof last?.content === 'string' ? last.content : '';
  } else if (typeof generated === 'string') {
    text = generated;
  }

  if (!text) {
    post({ type: 'error', message: 'O modelo retornou uma resposta vazia. Tente novamente.' });
    return;
  }

  post({ type: 'result', text });
}

ctx.onmessage = (event: MessageEvent): void => {
  const request = event.data as WasmRequest;

  const run = async (): Promise<void> => {
    if (request.type === 'init') {
      await handleInit(request.modelId);
    } else if (request.type === 'generate') {
      await handleGenerate(request.messages);
    } else if (request.type === 'dispose') {
      generator = null;
      ctx.close();
    }
  };

  run().catch((err: unknown) => {
    post({
      type: 'error',
      message: err instanceof Error ? err.message : 'Falha ao executar o modelo WASM.',
    });
  });
};
