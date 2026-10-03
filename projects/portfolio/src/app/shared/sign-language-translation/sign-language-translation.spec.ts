import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

import { SignLanguageTranslation } from './sign-language-translation';

describe('SignLanguageTranslation', () => {
  let component: SignLanguageTranslation;
  let fixture: ComponentFixture<SignLanguageTranslation>;

  /**
   * `linkForVideo` is a required `SafeResourceUrl` input, and the template binds
   * it straight into an iframe's `src`. The generated spec created the component
   * without it, which hands `undefined` to a resource-URL binding — and Angular
   * refuses that with `NG0904` instead of quietly rendering an empty frame, so
   * the test failed on every run.
   *
   * The fixture therefore supplies a trusted URL, exactly as both real callers
   * do: `home` and `learning-gallery` each build theirs with
   * `bypassSecurityTrustResourceUrl`, which is the only kind of value this
   * binding accepts.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignLanguageTranslation],
    }).compileComponents();

    const sanitizer = TestBed.inject(DomSanitizer);

    fixture = TestBed.createComponent(SignLanguageTranslation);
    component = fixture.componentInstance;
    component.linkForVideo = sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/example',
    );
    component.videoDescription = 'Vídeo em Libras';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should embed the trusted URL in an iframe, with the description as its title', () => {
    const iframe = fixture.nativeElement.querySelector('iframe') as HTMLIFrameElement;

    expect(iframe).toBeTruthy();
    expect(iframe.getAttribute('src')).toContain('youtube.com/embed/example');
    expect(iframe.getAttribute('title')).toBe('Vídeo em Libras');
  });
});
