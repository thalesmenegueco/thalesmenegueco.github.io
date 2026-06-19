import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProject } from './card-project';

describe('CardProject', () => {
  let component: CardProject;
  let fixture: ComponentFixture<CardProject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardProject]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardProject);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
