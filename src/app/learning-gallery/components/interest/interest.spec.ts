import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Interest } from './interest';

describe('Interest', () => {
  let component: Interest;
  let fixture: ComponentFixture<Interest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Interest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Interest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
