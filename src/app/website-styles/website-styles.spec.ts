import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteStyles } from './website-styles';

describe('WebsiteStyles', () => {
  let component: WebsiteStyles;
  let fixture: ComponentFixture<WebsiteStyles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsiteStyles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebsiteStyles);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
