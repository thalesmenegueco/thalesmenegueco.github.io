import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningGallery } from './learning-gallery.component';

describe('LearningGallery', () => {
  let component: LearningGallery;
  let fixture: ComponentFixture<LearningGallery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningGallery]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningGallery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
