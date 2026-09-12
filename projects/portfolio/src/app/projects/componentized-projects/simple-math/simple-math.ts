import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface CalculatorTab {
  id: string;
  label: string;
  icon: string;
}

type TriangleMode = 'hypotenuse' | 'leg';

@Component({
  selector: 'app-simple-math',
  imports: [FormsModule],
  templateUrl: './simple-math.html',
  styleUrl: './simple-math.scss',
})
export class SimpleMath {
  tabs: CalculatorTab[] = [
    { id: 'right-triangle', label: 'Triângulo Retângulo', icon: '📐' },
  ];

  activeTabId = 'right-triangle';
  mode: TriangleMode = 'hypotenuse';
  legA: number | null = null;
  legB: number | null = null;
  leg: number | null = null;
  hypotenuse: number | null = null;
  result: number | null = null;
  errorMessage: string | null = null;

  switchTab(id: string): void {
    this.activeTabId = id;
  }

  setMode(mode: TriangleMode): void {
    this.mode = mode;
    this.result = null;
    this.errorMessage = null;
  }

  onInputChange(): void {
    this.result = null;
    this.errorMessage = null;
  }

  calculate(): void {
    this.result = null;
    this.errorMessage = null;

    if (this.mode === 'hypotenuse') {
      if (this.legA === null || this.legB === null) {
        this.errorMessage = 'Preencha todos os campos.';
        return;
      }

      const a = Number(this.legA);
      const b = Number(this.legB);

      if (isNaN(a) || isNaN(b)) {
        this.errorMessage = 'Preencha todos os campos.';
        return;
      }
      if (a <= 0 || b <= 0) {
        this.errorMessage = 'Os valores devem ser maiores que zero.';
        return;
      }

      const res = Math.sqrt(a * a + b * b);
      if (!isFinite(res)) {
        this.errorMessage = 'Valor muito grande.';
        return;
      }
      this.result = Math.round(res * 10000) / 10000;
    } else {
      if (this.leg === null || this.hypotenuse === null) {
        this.errorMessage = 'Preencha todos os campos.';
        return;
      }

      const c = Number(this.leg);
      const h = Number(this.hypotenuse);

      if (isNaN(c) || isNaN(h)) {
        this.errorMessage = 'Preencha todos os campos.';
        return;
      }
      if (c <= 0 || h <= 0) {
        this.errorMessage = 'Os valores devem ser maiores que zero.';
        return;
      }
      if (c >= h) {
        this.errorMessage = 'O cateto deve ser menor que a hipotenusa.';
        return;
      }

      const res = Math.sqrt(h * h - c * c);
      if (!isFinite(res)) {
        this.errorMessage = 'Valor muito grande.';
        return;
      }
      this.result = Math.round(res * 10000) / 10000;
    }
  }
}
