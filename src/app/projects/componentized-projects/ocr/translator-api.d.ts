type TranslatorAvailability = 'unavailable' | 'downloadable' | 'downloading' | 'available';

interface TranslatorDownloadProgressEvent extends Event {
  loaded: number;
  total: number;
}

interface TranslatorMonitor extends EventTarget {
  addEventListener(
    type: 'downloadprogress',
    listener: (event: TranslatorDownloadProgressEvent) => void
  ): void;
}

interface TranslatorCreateOptions {
  sourceLanguage: string;
  targetLanguage: string;
  monitor?: (monitor: TranslatorMonitor) => void;
}

interface Translator {
  translate(text: string): Promise<string>;
  destroy(): void;
}

interface TranslatorStatic {
  create(options: TranslatorCreateOptions): Promise<Translator>;
  availability(options: {
    sourceLanguage: string;
    targetLanguage: string;
  }): Promise<TranslatorAvailability>;
}

interface LanguageDetectionResult {
  detectedLanguage: string;
  confidence: number;
}

interface LanguageDetectorCreateOptions {
  monitor?: (monitor: TranslatorMonitor) => void;
}

interface LanguageDetector {
  detect(text: string): Promise<LanguageDetectionResult[]>;
  destroy(): void;
}

interface LanguageDetectorStatic {
  create(options?: LanguageDetectorCreateOptions): Promise<LanguageDetector>;
  availability(): Promise<TranslatorAvailability>;
}

interface Window {
  Translator?: TranslatorStatic;
  LanguageDetector?: LanguageDetectorStatic;
}
