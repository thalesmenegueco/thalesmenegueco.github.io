import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCardShadow } from './dialog-card-shadow';

describe('DialogCardShadow', () => {
  let component: DialogCardShadow;
  let fixture: ComponentFixture<DialogCardShadow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCardShadow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCardShadow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
