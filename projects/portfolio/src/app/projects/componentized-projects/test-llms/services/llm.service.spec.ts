import { TestBed } from '@angular/core/testing';
import { LlmService, WEBGPU_DETECTOR, WebGpuDetector } from './llm.service';
import { WebGpuBackend } from './webgpu-backend';
import { WasmBackend } from './wasm-backend';
import { CloudBackend } from './cloud-backend';
import { BackendProgress } from './llm-backend';

describe('LlmService', () => {
  let service: LlmService;

  let webGpuDetector: jasmine.Spy;

  let webGpuBackend: {
    kind: 'webgpu';
    activeModelLabel: string;
    initialize: jasmine.Spy;
    generate: jasmine.Spy;
    dispose: jasmine.Spy;
  };

  let wasmBackend: {
    kind: 'wasm';
    selectedModel: string | null;
    readonly activeModelLabel: string;
    initialize: jasmine.Spy;
    generate: jasmine.Spy;
    dispose: jasmine.Spy;
  };

  let cloudBackend: {
    kind: 'cloud';
    activeModelLabel: string;
    initialize: jasmine.Spy;
    generate: jasmine.Spy;
    dispose: jasmine.Spy;
  };

  beforeEach(() => {
    webGpuDetector = jasmine.createSpy('webGpuDetector').and.resolveTo(true);

    webGpuBackend = {
      kind: 'webgpu',
      activeModelLabel: 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC',
      initialize: jasmine.createSpy('webGpuInitialize').and.resolveTo(undefined),
      generate: jasmine.createSpy('webGpuGenerate').and.resolveTo('Olá!'),
      dispose: jasmine.createSpy('webGpuDispose').and.resolveTo(undefined),
    };

    wasmBackend = {
      kind: 'wasm',
      selectedModel: 'onnx-community/SmolLM2-360M-Instruct-ONNX',
      get activeModelLabel() {
        return this.selectedModel ?? '';
      },
      initialize: jasmine.createSpy('wasmInitialize').and.resolveTo(undefined),
      generate: jasmine.createSpy('wasmGenerate').and.resolveTo('Olá!'),
      dispose: jasmine.createSpy('wasmDispose').and.resolveTo(undefined),
    };

    cloudBackend = {
      kind: 'cloud',
      activeModelLabel: 'Llama 3.1 8B (Cloudflare)',
      initialize: jasmine.createSpy('cloudInitialize').and.resolveTo(undefined),
      generate: jasmine.createSpy('cloudGenerate').and.resolveTo('Olá!'),
      dispose: jasmine.createSpy('cloudDispose').and.resolveTo(undefined),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: WEBGPU_DETECTOR, useValue: webGpuDetector as WebGpuDetector },
        { provide: WebGpuBackend, useValue: webGpuBackend },
        { provide: WasmBackend, useValue: wasmBackend },
        { provide: CloudBackend, useValue: cloudBackend },
      ],
    });

    service = TestBed.inject(LlmService);
  });

  it('should report WebGPU support from the detector', async () => {
    await expectAsync(service.detectWebGpuSupport()).toBeResolvedTo(true);
    expect(webGpuDetector).toHaveBeenCalled();
  });

  it('should default to online mode on mobile', () => {
    service.isMobile = true;
    expect(service.defaultMode).toBe('online');
  });

  it('should default to local mode on desktop', () => {
    service.isMobile = false;
    expect(service.defaultMode).toBe('local');
  });

  it('should choose the WebGPU backend when WebGPU is available', async () => {
    await service.initialize();

    expect(webGpuBackend.initialize).toHaveBeenCalledTimes(1);
    expect(wasmBackend.initialize).not.toHaveBeenCalled();
    expect(cloudBackend.initialize).not.toHaveBeenCalled();
    expect(service.activeBackend).toBe('webgpu');
    expect(service.isReady).toBeTrue();
    expect(service.progressPercent).toBe(100);
  });

  it('should choose the WASM backend when WebGPU is unavailable', async () => {
    webGpuDetector.and.resolveTo(false);

    await service.initialize();

    expect(webGpuBackend.initialize).not.toHaveBeenCalled();
    expect(wasmBackend.initialize).toHaveBeenCalledTimes(1);
    expect(service.activeBackend).toBe('wasm');
    expect(service.activeModel).toBe('onnx-community/SmolLM2-360M-Instruct-ONNX');
    expect(service.isReady).toBeTrue();
  });

  it('should choose the cloud backend when mode is online', async () => {
    service.mode = 'online';

    await service.initialize();

    expect(cloudBackend.initialize).toHaveBeenCalledTimes(1);
    expect(webGpuBackend.initialize).not.toHaveBeenCalled();
    expect(wasmBackend.initialize).not.toHaveBeenCalled();
    expect(service.activeBackend).toBe('cloud');
    expect(service.activeModel).toBe('Llama 3.1 8B (Cloudflare)');
    expect(service.isReady).toBeTrue();
  });

  it('should fall back to WASM when the WebGPU backend throws a WebGPU error', async () => {
    webGpuBackend.initialize.and.rejectWith(new Error('WebGPUNotFoundError: Cannot find WebGPU'));

    await service.initialize();

    expect(webGpuBackend.initialize).toHaveBeenCalledTimes(1);
    expect(webGpuBackend.dispose).toHaveBeenCalledTimes(1);
    expect(wasmBackend.initialize).toHaveBeenCalledTimes(1);
    expect(service.activeBackend).toBe('wasm');
    expect(service.isReady).toBeTrue();
    expect(service.errorMessage).toBeNull();
  });

  it('should fall back to WASM when the WebGPU error arrives as a string', async () => {
    webGpuBackend.initialize.and.rejectWith(
      'WebGPUNotAvailableError: WebGPU is not supported in your current environment'
    );

    await service.initialize();

    expect(wasmBackend.initialize).toHaveBeenCalledTimes(1);
    expect(service.activeBackend).toBe('wasm');
    expect(service.isReady).toBeTrue();
  });

  it('should not fall back when the WebGPU backend fails for another reason', async () => {
    webGpuBackend.initialize.and.rejectWith(new Error('network failure'));

    await expectAsync(service.initialize()).toBeRejected();

    expect(wasmBackend.initialize).not.toHaveBeenCalled();
    expect(service.isReady).toBeFalse();
    expect(service.errorMessage).toContain('network failure');
  });

  it('should map progress and status from the active backend', async () => {
    let onProgress: (progress: BackendProgress) => void = () => undefined;
    webGpuBackend.initialize.and.callFake((cb: (p: BackendProgress) => void) => {
      onProgress = cb;
      return Promise.resolve();
    });

    await service.initialize();

    onProgress({ progressPercent: 42, status: 'Baixando modelo...' });

    expect(service.progressPercent).toBe(42);
    expect(service.status).toBe('Baixando modelo...');
  });

  it('should delegate generate to the active backend and pass onToken', async () => {
    await service.initialize();

    const onToken = jasmine.createSpy('onToken');
    const reply = await service.generate([{ role: 'user', content: 'Oi' }], onToken);

    expect(reply).toBe('Olá!');
    expect(webGpuBackend.generate).toHaveBeenCalledWith([{ role: 'user', content: 'Oi' }], onToken);
    expect(wasmBackend.generate).not.toHaveBeenCalled();
  });

  it('should forward streamed tokens from the backend', async () => {
    webGpuBackend.generate.and.callFake(
      async (_messages: unknown, onToken: (token: string) => void) => {
        onToken('Ol');
        onToken('á!');
        return 'Olá!';
      }
    );

    await service.initialize();

    const tokens: string[] = [];
    const reply = await service.generate([{ role: 'user', content: 'Oi' }], (token) =>
      tokens.push(token)
    );

    expect(reply).toBe('Olá!');
    expect(tokens).toEqual(['Ol', 'á!']);
  });

  it('should reject generate before initialization', async () => {
    await expectAsync(
      service.generate([{ role: 'user', content: 'Oi' }], () => undefined)
    ).toBeRejectedWithError(/não foi carregado/);
    expect(webGpuBackend.generate).not.toHaveBeenCalled();
    expect(wasmBackend.generate).not.toHaveBeenCalled();
  });

  it('should reset state and change mode via setMode', async () => {
    await service.initialize();

    await service.setMode('online');

    expect(webGpuBackend.dispose).toHaveBeenCalledTimes(1);
    expect(wasmBackend.dispose).toHaveBeenCalledTimes(1);
    expect(cloudBackend.dispose).toHaveBeenCalledTimes(1);
    expect(service.mode).toBe('online');
    expect(service.isReady).toBeFalse();
    expect(service.errorMessage).toBeNull();
  });

  it('should keep the same mode unchanged in setMode', async () => {
    await service.initialize();

    await service.setMode('local');

    expect(service.mode).toBe('local');
    expect(service.isReady).toBeTrue();
  });

  it('should dispose all backends and reset state', async () => {
    await service.initialize();
    await service.dispose();

    expect(webGpuBackend.dispose).toHaveBeenCalledTimes(1);
    expect(wasmBackend.dispose).toHaveBeenCalledTimes(1);
    expect(cloudBackend.dispose).toHaveBeenCalledTimes(1);
    expect(service.isReady).toBeFalse();
    expect(service.activeBackend).toBeNull();
    expect(service.activeModel).toBeNull();
    expect(service.progressPercent).toBe(0);
    expect(service.errorMessage).toBeNull();
  });
});
