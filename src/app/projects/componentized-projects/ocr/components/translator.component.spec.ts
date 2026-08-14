import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatorComponent } from './translator.component';
import { TranslateRequest } from '../types';

describe('TranslatorComponent', () => {
  let component: TranslatorComponent;
  let fixture: ComponentFixture<TranslatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TranslatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render source and target selects', () => {
    const selects = fixture.nativeElement.querySelectorAll('select');
    expect(selects.length).toBe(2);
  });

  it('should default source to pt and hide the Auto option when detection is unavailable', () => {
    component.canDetect = false;
    fixture.detectChanges();

    expect(component.source).toBe('pt');

    const sourceSelect = fixture.nativeElement.querySelectorAll('select')[0];
    const values = Array.from(sourceSelect.querySelectorAll('option')).map(
      (option) => (option as HTMLOptionElement).value
    );
    expect(values).not.toContain('auto');
  });

  it('should show the Auto option when detection is available', () => {
    component.canDetect = true;
    fixture.detectChanges();

    expect(component.source).toBe('auto');

    const sourceSelect = fixture.nativeElement.querySelectorAll('select')[0];
    const values = Array.from(sourceSelect.querySelectorAll('option')).map(
      (option) => (option as HTMLOptionElement).value
    );
    expect(values).toContain('auto');
  });

  it('should emit the selected source and target', () => {
    let emitted: TranslateRequest | undefined;
    component.translate.subscribe((event) => (emitted = event));

    component.source = 'pt';
    component.target = 'en';
    component.onTranslate();

    expect(emitted).toEqual({ source: 'pt', target: 'en' });
  });

  it('should show a fallback message when translation is not supported', () => {
    component.supported = false;
    fixture.detectChanges();

    const fallback = fixture.nativeElement.querySelector('.translator-fallback');
    expect(fallback).toBeTruthy();
  });
});
