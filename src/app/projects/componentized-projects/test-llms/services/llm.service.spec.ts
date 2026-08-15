import { TestBed } from '@angular/core/testing';
import {
  LLM_ENGINE_FACTORY,
  LlmEngineFactory,
  LlmService,
  MODEL_ID,
  WEBGPU_DETECTOR,
  WebGpuDetector,
} from './llm.service';
import { InitProgressReport } from '@mlc-ai/web-llm';

describe('LlmService', () => {
  let service: LlmService;

  let engineFactory: jasmine.Spy;
  let createSpy: jasmine.Spy;
  let unloadSpy: jasmine.Spy;
  let initProgressCallback: (report: InitProgressReport) => void;
  let webGpuDetector: jasmine.Spy;

  function makeEngine() {
    createSpy = jasmine.createSpy('create').and.resolveTo({
      choices: [{ message: { content: 'Olá!' } }],
    });
    unloadSpy = jasmine.createSpy('unload').and.resolveTo(undefined);

    return { chat: { completions: { create: createSpy } }, unload: unloadSpy };
  }

  beforeEach(() => {
    engineFactory = jasmine
      .createSpy('engineFactory')
      .and.callFake((_modelId: string, cb: (report: InitProgressReport) => void) => {
        initProgressCallback = cb;
        return Promise.resolve(makeEngine());
      });

    webGpuDetector = jasmine.createSpy('webGpuDetector').and.resolveTo(true);

    TestBed.configureTestingModule({
      providers: [
        { provide: LLM_ENGINE_FACTORY, useValue: engineFactory as LlmEngineFactory },
        { provide: WEBGPU_DETECTOR, useValue: webGpuDetector as WebGpuDetector },
      ],
    });

    service = TestBed.inject(LlmService);
  });

  it('should report WebGPU support from the detector', async () => {
    await expectAsync(service.detectWebGpuSupport()).toBeResolvedTo(true);
    expect(webGpuDetector).toHaveBeenCalled();
  });

  it('should report no WebGPU support when the detector returns false', async () => {
    webGpuDetector.and.resolveTo(false);

    await expectAsync(service.detectWebGpuSupport()).toBeResolvedTo(false);
  });

  it('should initialize the engine and map progress/status', async () => {
    await service.initialize();

    expect(engineFactory).toHaveBeenCalledOnceWith(MODEL_ID, jasmine.any(Function));
    expect(service.isReady).toBeTrue();
    expect(service.progressPercent).toBe(100);
    expect(service.errorMessage).toBeNull();

    initProgressCallback({ progress: 0.42, timeElapsed: 1, text: 'Loading model from url' });

    expect(service.progressPercent).toBe(42);
    expect(service.status).toBe('Baixando modelo...');
  });

  it('should map cache loading status to Portuguese', async () => {
    await service.initialize();

    initProgressCallback({ progress: 0.5, timeElapsed: 1, text: 'Loading model from cache' });

    expect(service.status).toBe('Carregando modelo do cache...');
  });

  it('should keep unknown status text as-is', async () => {
    await service.initialize();

    initProgressCallback({ progress: 0.5, timeElapsed: 1, text: 'Some custom step' });

    expect(service.status).toBe('Some custom step');
  });

  it('should set an error and reject when initialization fails', async () => {
    engineFactory.and.callFake(() => Promise.reject(new Error('no gpu')));

    await expectAsync(service.initialize()).toBeRejected();

    expect(service.isReady).toBeFalse();
    expect(service.errorMessage).toContain('no gpu');
  });

  it('should generate a reply, injecting the system prompt first', async () => {
    await service.initialize();

    const reply = await service.generate([{ role: 'user', content: 'Oi' }]);

    expect(reply).toBe('Olá!');
    expect(createSpy).toHaveBeenCalledWith({
      messages: [
        { role: 'system', content: jasmine.any(String) },
        { role: 'user', content: 'Oi' },
      ],
    });

    const messages = createSpy.calls.mostRecent().args[0].messages;
    expect(messages[0].role).toBe('system');
    expect(messages[0].content).toContain('português');
  });

  it('should reject when generating before initialization', async () => {
    await expectAsync(service.generate([{ role: 'user', content: 'Oi' }])).toBeRejectedWithError(
      /não foi carregado/
    );
    expect(engineFactory).not.toHaveBeenCalled();
  });

  it('should dispose the engine and reset state', async () => {
    await service.initialize();
    await service.dispose();

    expect(unloadSpy).toHaveBeenCalledTimes(1);
    expect(service.isReady).toBeFalse();
    expect(service.progressPercent).toBe(0);
    expect(service.errorMessage).toBeNull();
  });
});
