import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningGalleryComponent } from './learning-gallery.component';

describe('LearningGallery', () => {
  let component: LearningGalleryComponent;
  let fixture: ComponentFixture<LearningGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * The gallery's two flagship cards show screenshots rather than icons, and a
   * screenshot is the only kind of image a build step cannot check for: a
   * mistyped path in `image` compiles, type-checks and deploys perfectly, and
   * the visitor gets a broken image on the portfolio's most valuable surface.
   *
   * So this loads every locally-referenced image for real. The Karma builder
   * serves the app's `assets` (`projects/portfolio/public`, per `angular.json`),
   * which is where these files live — so `images/sinalize-preview.png` resolves
   * here exactly as it does under `<base href="/">` in production, and a renamed
   * or missing file fails the suite instead of the page.
   *
   * Cards still pointing at a remote svgrepo URL are deliberately skipped: this
   * asserts local wiring is correct, not that a third-party host is up.
   */
  it('should load every locally-hosted card image, so a bad asset path fails here', async () => {
    const localImages = component.interests
      .map((item) => item.image)
      .filter((image) => !/^https?:\/\//.test(image));

    expect(localImages.length)
      .withContext('expected the gallery to keep local image cards')
      .toBeGreaterThan(0);

    for (const image of localImages) {
      const loaded = await new Promise<boolean>((resolve) => {
        const probe = new Image();
        probe.onload = () => resolve(probe.naturalWidth > 0);
        probe.onerror = () => resolve(false);
        probe.src = image;
      });

      expect(loaded).withContext(`card image did not load: ${image}`).toBeTrue();
    }
  });
});
