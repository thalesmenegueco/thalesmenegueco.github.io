import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleMath } from './simple-math';

describe('SimpleMath', () => {
  let component: SimpleMath;
  let fixture: ComponentFixture<SimpleMath>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleMath],
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleMath);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should switch tabs', () => {
    expect(component.activeTabId).toBe('right-triangle');
    component.switchTab('other');
    expect(component.activeTabId).toBe('other');
  });

  it('should toggle mode and clear result/error', () => {
    component.result = 5;
    component.errorMessage = 'some error';
    component.setMode('leg');
    expect(component.mode).toBe('leg');
    expect(component.result).toBeNull();
    expect(component.errorMessage).toBeNull();
  });

  it('should calculate hypotenuse correctly', () => {
    component.mode = 'hypotenuse';
    component.legA = 3;
    component.legB = 4;
    component.calculate();
    expect(component.result).toBe(5);
    expect(component.errorMessage).toBeNull();
  });

  it('should calculate leg correctly', () => {
    component.mode = 'leg';
    component.leg = 3;
    component.hypotenuse = 5;
    component.calculate();
    expect(component.result).toBe(4);
    expect(component.errorMessage).toBeNull();
  });

  it('should show error for empty inputs', () => {
    component.mode = 'hypotenuse';
    component.legA = null;
    component.legB = null;
    component.calculate();
    expect(component.result).toBeNull();
    expect(component.errorMessage).toBe('Preencha todos os campos.');
  });

  it('should show error for negative values', () => {
    component.mode = 'hypotenuse';
    component.legA = -3;
    component.legB = 4;
    component.calculate();
    expect(component.result).toBeNull();
    expect(component.errorMessage).toBe('Os valores devem ser maiores que zero.');
  });

  it('should show error when leg >= hypotenuse', () => {
    component.mode = 'leg';
    component.leg = 5;
    component.hypotenuse = 4;
    component.calculate();
    expect(component.result).toBeNull();
    expect(component.errorMessage).toBe('O cateto deve ser menor que a hipotenusa.');
  });

  it('should clear result and error on input change', () => {
    component.result = 10;
    component.errorMessage = 'some error';
    component.onInputChange();
    expect(component.result).toBeNull();
    expect(component.errorMessage).toBeNull();
  });
});
