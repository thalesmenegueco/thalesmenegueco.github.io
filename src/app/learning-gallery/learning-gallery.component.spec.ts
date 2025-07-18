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
});
