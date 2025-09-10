import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignLanguageTranslation } from './sign-language-translation';

describe('SignLanguageTranslation', () => {
  let component: SignLanguageTranslation;
  let fixture: ComponentFixture<SignLanguageTranslation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignLanguageTranslation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignLanguageTranslation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
