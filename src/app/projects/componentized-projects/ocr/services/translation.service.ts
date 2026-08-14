import { Injectable } from '@angular/core';
import { SUPPORTED_LANGUAGES, TranslateRequest } from '../types';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private translators = new Map<string, Translator>();
  private detector: LanguageDetector | null = null;
  private detectorPromise: Promise<LanguageDetector> | null = null;

  get isSupported(): boolean {
    return typeof self !== 'undefined' && 'Translator' in self && !!self.Translator;
  }

  get canDetect(): boolean {
    return typeof self !== 'undefined' && 'LanguageDetector' in self && !!self.LanguageDetector;
  }

  normalizeLanguage(code: string): string | null {
    if (!code) {
      return null;
    }
    const base = code.trim().toLowerCase().split('-')[0];
    return SUPPORTED_LANGUAGES.some((lang) => lang.code === base) ? base : null;
  }

  async translate(text: string, request: TranslateRequest): Promise<string> {
    if (!this.isSupported) {
      throw new Error(
        'Tradução indisponível neste navegador. Use o Chrome 138 ou superior com a Translator API habilitada.'
      );
    }

    let source = request.source;
    if (source === 'auto') {
      source = (await this.detectLanguage(text)) ?? 'pt';
    }

    const sourceLang = this.normalizeLanguage(source) ?? 'pt';
    const targetLang = this.normalizeLanguage(request.target) ?? 'en';

    if (sourceLang === targetLang) {
      return text;
    }

    const availability = await self.Translator!.availability({
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
    });

    console.info(`[translation] ${sourceLang}→${targetLang} availability: ${availability}`);

    if (availability === 'unavailable') {
      throw new Error(`Tradução de ${sourceLang} para ${targetLang} não é suportada neste Chrome.`);
    }

    try {
      const translator = await this.getTranslator(sourceLang, targetLang);
      return await translator.translate(text);
    } catch (err) {
      throw this.toFriendlyError(err, sourceLang, targetLang);
    }
  }

  async destroy(): Promise<void> {
    for (const translator of this.translators.values()) {
      translator.destroy();
    }
    this.translators.clear();

    this.detector?.destroy();
    this.detector = null;
    this.detectorPromise = null;
  }

  private async detectLanguage(text: string): Promise<string | null> {
    if (!this.canDetect) {
      return null;
    }

    const detector = await this.getDetector();
    const results = await detector.detect(text);
    const best = results.find((r) => r.confidence > 0) ?? results[0];
    return best?.detectedLanguage ?? null;
  }

  private async getDetector(): Promise<LanguageDetector> {
    if (this.detector) {
      return this.detector;
    }
    if (!this.detectorPromise) {
      this.detectorPromise = self.LanguageDetector!.create();
    }
    this.detector = await this.detectorPromise;
    return this.detector;
  }

  private async getTranslator(source: string, target: string): Promise<Translator> {
    const key = `${source}|${target}`;
    const cached = this.translators.get(key);

    if (cached) {
      return cached;
    }

    const translator = await this.createTranslator(source, target);
    this.translators.set(key, translator);
    return translator;
  }

  private async createTranslator(source: string, target: string): Promise<Translator> {
    try {
      return await self.Translator!.create({
        sourceLanguage: source,
        targetLanguage: target,
        monitor: (monitor) => {
          monitor.addEventListener('downloadprogress', (event) => {
            const percent = event.total ? Math.round((event.loaded / event.total) * 100) : 0;
            console.info(`[translation] downloading ${source}→${target}: ${percent}%`);
          });
        },
      });
    } catch (err) {
      // Chromium may reject the first create() while the language pack is still
      // being downloaded (availability() reports 'downloadable' for privacy).
      // Give the download a moment and retry once.
      console.warn(`[translation] create(${source}→${target}) failed, retrying once`, err);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return self.Translator!.create({
        sourceLanguage: source,
        targetLanguage: target,
      });
    }
  }

  private toFriendlyError(err: unknown, source: string, target: string): Error {
    if (err instanceof DOMException) {
      return new Error(
        `Não foi possível criar o tradutor ${source}→${target}: o pacote de idioma não pôde ser baixado. ` +
          'Verifique sua conexão e se "Usar o Google Tradutor" está ativado em Configurações → Idiomas do Chrome.'
      );
    }
    if (err instanceof Error) {
      return err;
    }
    return new Error('Falha na tradução. Tente novamente.');
  }
}
