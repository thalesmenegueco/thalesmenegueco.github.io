import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestLlms } from './test-llms';
import { LlmService } from './services/llm.service';

describe('TestLlms', () => {
  let component: TestLlms;
  let fixture: ComponentFixture<TestLlms>;

  let llmMock: {
    isReady: boolean;
    status: string;
    progressPercent: number;
    errorMessage: string | null;
    detectWebGpuSupport: jasmine.Spy;
    initialize: jasmine.Spy;
    generate: jasmine.Spy;
    dispose: jasmine.Spy;
  };

  beforeEach(async () => {
    llmMock = {
      isReady: true,
      status: 'Modelo carregado',
      progressPercent: 100,
      errorMessage: null,
      detectWebGpuSupport: jasmine.createSpy('detectWebGpuSupport').and.resolveTo(true),
      initialize: jasmine.createSpy('initialize').and.resolveTo(undefined),
      generate: jasmine.createSpy('generate').and.resolveTo('Olá!'),
      dispose: jasmine.createSpy('dispose').and.resolveTo(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [TestLlms],
      providers: [{ provide: LlmService, useValue: llmMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestLlms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should capture WebGPU support on init', async () => {
    await fixture.whenStable();

    expect(component.webGpuSupported).toBeTrue();
    expect(llmMock.detectWebGpuSupport).toHaveBeenCalled();
  });

  it('should disable the download button when WebGPU is unavailable', async () => {
    llmMock.detectWebGpuSupport.and.resolveTo(false);
    llmMock.isReady = false;

    const noGpuFixture = TestBed.createComponent(TestLlms);
    noGpuFixture.detectChanges();
    await noGpuFixture.whenStable();

    expect(noGpuFixture.componentInstance.webGpuSupported).toBeFalse();

    const button = noGpuFixture.nativeElement.querySelector(
      '.download-button'
    ) as HTMLButtonElement;
    expect(button.disabled).toBeTrue();
  });

  it('should send a message and append the assistant reply', async () => {
    component.userInput = 'Olá';

    await component.send();

    expect(component.messages).toEqual([
      { role: 'user', content: 'Olá' },
      { role: 'assistant', content: 'Olá!' },
    ]);
    expect(llmMock.generate).toHaveBeenCalledWith([{ role: 'user', content: 'Olá' }]);
    expect(component.isGenerating).toBeFalse();
    expect(component.userInput).toBe('');
  });

  it('should not send an empty message', async () => {
    component.userInput = '   ';

    await component.send();

    expect(component.messages).toEqual([]);
    expect(llmMock.generate).not.toHaveBeenCalled();
  });

  it('should not send while already generating', async () => {
    component.isGenerating = true;
    component.userInput = 'Olá';

    await component.send();

    expect(component.messages).toEqual([]);
    expect(llmMock.generate).not.toHaveBeenCalled();
  });

  it('should clear the conversation', () => {
    component.messages = [
      { role: 'user', content: 'Olá' },
      { role: 'assistant', content: 'Olá!' },
    ];

    component.clearChat();

    expect(component.messages).toEqual([]);
  });

  it('should dispose the engine on destroy', () => {
    component.ngOnDestroy();

    expect(llmMock.dispose).toHaveBeenCalledTimes(1);
  });
});
