import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service';

interface MockTranslator {
  translate: jasmine.Spy;
  destroy: jasmine.Spy;
}

interface MockDetector {
  detect: jasmine.Spy;
  destroy: jasmine.Spy;
}

describe('TranslationService', () => {
  let service: TranslationService;

  let translatorCreate: jasmine.Spy;
  let translatorTranslate: jasmine.Spy;
  let translatorDestroy: jasmine.Spy;
  let availability: jasmine.Spy;

  let detectorCreate: jasmine.Spy;
  let detectorDetect: jasmine.Spy;
  let detectorDestroy: jasmine.Spy;

  function makeTranslator(): MockTranslator {
    translatorTranslate = jasmine.createSpy('translator.translate').and.resolveTo('hello');
    translatorDestroy = jasmine.createSpy('translator.destroy');
    return { translate: translatorTranslate, destroy: translatorDestroy };
  }

  function makeDetector(): MockDetector {
    detectorDetect = jasmine
      .createSpy('detector.detect')
      .and.resolveTo([{ detectedLanguage: 'pt-BR', confidence: 0.99 }]);
    detectorDestroy = jasmine.createSpy('detector.destroy');
    return { detect: detectorDetect, destroy: detectorDestroy };
  }

  function installApis(): void {
    translatorCreate = jasmine.createSpy('Translator.create').and.callFake(() => Promise.resolve(makeTranslator()));
    availability = jasmine.createSpy('Translator.availability').and.resolveTo('available');
    detectorCreate = jasmine.createSpy('LanguageDetector.create').and.callFake(() => Promise.resolve(makeDetector()));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).Translator = { create: translatorCreate, availability };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).LanguageDetector = {
      create: detectorCreate,
      availability: jasmine.createSpy('LanguageDetector.availability').and.resolveTo('available'),
    };
  }

  function uninstallApis(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (globalThis as any).Translator;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (globalThis as any).LanguageDetector;
  }

  beforeEach(() => {
    uninstallApis();
    installApis();

    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslationService);
  });

  afterEach(async () => {
    await service.destroy();
    uninstallApis();
  });

  it('should report feature detection for Translator and LanguageDetector', () => {
    expect(service.isSupported).toBeTrue();
    expect(service.canDetect).toBeTrue();
  });

  it('should report unsupported when the APIs are missing', () => {
    uninstallApis();
    expect(service.isSupported).toBeFalse();
    expect(service.canDetect).toBeFalse();
  });

  it('should normalize regional variants to the supported set', () => {
    expect(service.normalizeLanguage('pt-BR')).toBe('pt');
    expect(service.normalizeLanguage('EN')).toBe('en');
    expect(service.normalizeLanguage('de-DE')).toBe('de');
    expect(service.normalizeLanguage('ja')).toBeNull();
    expect(service.normalizeLanguage('')).toBeNull();
  });

  it('should translate using a translator created for the pair', async () => {
    const result = await service.translate('olá', { source: 'pt', target: 'en' });

    expect(result).toBe('hello');
    expect(availability).toHaveBeenCalledWith({ sourceLanguage: 'pt', targetLanguage: 'en' });
    expect(translatorCreate).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({ sourceLanguage: 'pt', targetLanguage: 'en' })
    );
    expect(translatorTranslate).toHaveBeenCalledWith('olá');
  });

  it('should reuse the cached translator for the same language pair', async () => {
    await service.translate('olá', { source: 'pt', target: 'en' });
    await service.translate('tudo bem', { source: 'pt', target: 'en' });

    expect(translatorCreate).toHaveBeenCalledTimes(1);
    expect(translatorTranslate).toHaveBeenCalledTimes(2);
  });

  it('should auto-detect the source and skip the API when source equals target', async () => {
    const result = await service.translate('olá', { source: 'auto', target: 'pt' });

    expect(result).toBe('olá');
    expect(detectorCreate).toHaveBeenCalledTimes(1);
    expect(detectorDetect).toHaveBeenCalledWith('olá');
    expect(translatorCreate).not.toHaveBeenCalled();
  });

  it('should reject when the language pair is unavailable', async () => {
    availability.and.resolveTo('unavailable');

    await expectAsync(
      service.translate('olá', { source: 'pt', target: 'de' })
    ).toBeRejectedWithError(/não é suportada/);
  });

  it('should fall back to pt when detection is unavailable and source is auto', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (globalThis as any).LanguageDetector;

    const result = await service.translate('olá', { source: 'auto', target: 'en' });

    expect(result).toBe('hello');
    expect(translatorCreate).toHaveBeenCalledWith(
      jasmine.objectContaining({ sourceLanguage: 'pt', targetLanguage: 'en' })
    );
  });

  it('should retry once when create() fails while the language pack downloads', async () => {
    translatorCreate.and.callFake(() => {
      if ((translatorCreate.calls.count() as number) === 1) {
        return Promise.reject(new DOMException('Unable to create translator', 'NotSupportedError'));
      }
      return Promise.resolve(makeTranslator());
    });

    const result = await service.translate('olá', { source: 'pt', target: 'en' });

    expect(result).toBe('hello');
    expect(translatorCreate).toHaveBeenCalledTimes(2);
  });

  it('should surface a friendly message when the language pack cannot be created', async () => {
    translatorCreate.and.callFake(() =>
      Promise.reject(new DOMException('Unable to create translator for the given source and target language.', 'NotSupportedError'))
    );

    await expectAsync(
      service.translate('olá', { source: 'pt', target: 'de' })
    ).toBeRejectedWithError(/pacote de idioma não pôde ser baixado/);
  });

  it('should destroy all cached translators and the detector', async () => {
    await service.translate('olá', { source: 'auto', target: 'en' });
    await service.destroy();

    expect(translatorDestroy).toHaveBeenCalledTimes(1);
    expect(detectorDestroy).toHaveBeenCalledTimes(1);
  });
});
