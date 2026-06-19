import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecificacaoPageComponent } from './precificacao-page-component';

describe('PrecificacaoPageComponent', () => {
  let component: PrecificacaoPageComponent;
  let fixture: ComponentFixture<PrecificacaoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrecificacaoPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrecificacaoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
