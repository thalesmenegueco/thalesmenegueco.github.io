import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignLanguagePage } from './sign-language-page';

describe('SignLanguagePage', () => {
  let component: SignLanguagePage;
  let fixture: ComponentFixture<SignLanguagePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignLanguagePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignLanguagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
