import { Injectable } from '@angular/core';
import { pipeline, env } from '@huggingface/transformers';
import type { TranslationPipeline } from '@huggingface/transformers';
import { TranslateProgress } from '../types';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private pipelines = new Map<string, TranslationPipeline>();

  constructor() {
    env.allowLocalModels = false;
  }

  async translate(
    text: string,
    modelName: string,
    srcLang: string,
    tgtLang: string,
    onProgress?: (p: TranslateProgress) => void
  ): Promise<string> {
    let translator = this.pipelines.get(modelName);

    if (!translator) {
      onProgress?.({ status: 'downloading', progress: 0, modelSize: modelName.includes('nllb') ? '~300 MB' : '~30 MB' });

      translator = await pipeline('translation', modelName, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        progress_callback: (info: any) => {
          if (info.status === 'progress' && info.progress !== undefined) {
            onProgress?.({ status: 'downloading', progress: info.progress });
          }
        },
      }) as unknown as TranslationPipeline;

      this.pipelines.set(modelName, translator);
    }

    onProgress?.({ status: 'translating', progress: 0 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const output = await translator(text, { src_lang: srcLang, tgt_lang: tgtLang } as any);

    onProgress?.({ status: 'translating', progress: 1 });

    if (Array.isArray(output)) {
      return (output[0] as { translation_text: string }).translation_text;
    }
    return (output as { translation_text: string }).translation_text;
  }

  async terminate(): Promise<void> {
    for (const [, p] of this.pipelines) {
      await p.dispose?.();
    }
    this.pipelines.clear();
  }
}
