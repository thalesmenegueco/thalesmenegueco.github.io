import { ComponentFixture, TestBed } from '@angular/core/testing';
import { cosineAngle, projection } from '@ml/engine';
import { ProjectionWidgetComponent } from './projection.component';
import { LESSON_BINDINGS } from '../../lessons/runtime/lesson-bindings.generated';
import type { RuntimeWidgetBinding, WidgetSnapshot } from '../../lessons/runtime/lesson-runtime.types';

/**
 * Guards `ProjectionWidget` — the widget `fundamentos-teoria-02` is contracted on.
 *
 * Three things are worth a test here, and they are different in kind:
 *
 *  1. **the arithmetic**, cross-checked against `@ml/engine`'s `projection`/`cosineAngle`, so the
 *     widget, the manifest's `expectedValues` and the engine cannot disagree quietly. The widget
 *     is where a student learns what `λ` means; a widget that draws a different λ than the test
 *     proves is worse than no widget;
 *  2. **the state the lesson checks**, i.e. that the student can actually *reach* `cos ω = 0` — the
 *     manifest's `completionCriterion` says "prever quando cos θ = 0", and the snap is the
 *     mechanism that makes it reachable by dragging rather than by luck;
 *  3. **the snapshot contract**, because the runtime's checks assert named fields of it and a
 *     renamed key would fail closed with a message that says nothing about the real cause.
 *
 * The drawing assertions are the pilot's lesson, ported: `fundamentos-teoria-01` shipped with a
 * fixed window that made the vector leave the frame while the prose claimed it never could. Here
 * the analogous risk is a projection longer than `b`, so "nothing painted leaves the frame" is a
 * test rather than a hope.
 */
describe('ProjectionWidget', () => {
  const LESSON_ID = 'fundamentos-teoria-02';
  const binding = LESSON_BINDINGS[LESSON_ID];

  async function renderWidget(
    setup?: (widget: ProjectionWidgetComponent) => void,
  ): Promise<{ fixture: ComponentFixture<ProjectionWidgetComponent>; widget: ProjectionWidgetComponent }> {
    await TestBed.configureTestingModule({ imports: [ProjectionWidgetComponent] }).compileComponents();

    const fixture = TestBed.createComponent(ProjectionWidgetComponent);
    fixture.componentRef.setInput('lessonId', LESSON_ID);
    fixture.componentRef.setInput('binding', binding);
    fixture.detectChanges();
    setup?.(fixture.componentInstance);
    fixture.detectChanges();

    return { fixture, widget: fixture.componentInstance };
  }

  /** Every coordinate the SVG paints, as numbers. */
  function paintedCoordinates(fixture: ComponentFixture<ProjectionWidgetComponent>): number[] {
    const svg = (fixture.nativeElement as HTMLElement).querySelector('svg.plane') as SVGElement;
    const numbers: number[] = [];
    for (const shape of Array.from(svg.querySelectorAll('line, polygon, circle'))) {
      for (const attr of ['x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r']) {
        const raw = shape.getAttribute(attr);
        if (raw !== null) {
          numbers.push(Number(raw));
        }
      }
      const points = shape.getAttribute('points');
      if (points) {
        for (const pair of points.split(' ')) {
          for (const value of pair.split(',')) {
            numbers.push(Number(value));
          }
        }
      }
    }
    return numbers.filter((value) => Number.isFinite(value));
  }

  describe('o estado inicial vem do manifesto', () => {
    it('abre com x = (3, 4) e b = (1, 1), os números de numericExample.inputs', async () => {
      const { widget } = await renderWidget();

      expect(widget.x()).toEqual([3, 4]);
      // `inputs.y` no manifesto; **b** é o rótulo que o aluno lê (§3.8 e o completionCriterion).
      expect(widget.b()).toEqual([1, 1]);
      expect(widget.allowDrag()).toBeTrue();
    });

    it('os quatro números batem com o motor, e não só entre si', async () => {
      const { widget } = await renderWidget();

      const engineProjection = projection([3, 4], [1, 1]);
      const engineCosine = cosineAngle([3, 4], [1, 1]);

      expect(widget.projection()[0]).toBeCloseTo(engineProjection[0], 6);
      expect(widget.projection()[1]).toBeCloseTo(engineProjection[1], 6);
      expect(widget.cos()).toBeCloseTo(engineCosine, 10);

      // E os números que o manifesto declara como `expectedValues`: 3.5, 3.5, 0.9899.
      expect(widget.dotProduct()).toBe(7);
      expect(widget.lambda()).toBe(3.5);
      expect(widget.projection()).toEqual([3.5, 3.5]);
      expect(widget.projectionLength()).toBeCloseTo(4.9497, 4);
    });

    it('o produto escalar e o cosseno são assinados: b oposto inverte os dois', async () => {
      const { widget } = await renderWidget((w) => w.dragTo('b', [-1, -1]));

      expect(widget.dotProduct()).toBe(-7);
      expect(widget.cos()).toBeCloseTo(-0.9899, 4);
      expect(widget.lambda()).toBe(-3.5);
      // O comprimento é cego ao sinal — é isso que separa λ de ‖λb‖ no passo 2.
      expect(widget.projectionLength()).toBeCloseTo(4.9497, 4);
    });
  });

  describe('o aluno consegue CHEGAR à perpendicular', () => {
    it('perto de 90° a widget encaixa b, e a projeção é exatamente nula', async () => {
      // A perpendicular de (3,4) é (−0,8, 0,6); o arrasto para em (−0,7, 0,5), a 1,3° dela.
      const { widget } = await renderWidget((w) => w.dragTo('b', [-0.7, 0.5]));

      expect(widget.orthogonal()).toBeTrue();
      // Zero a menos de ruído de ponto flutuante: o encaixe é exato na direção, não na mantissa.
      expect(widget.dotProduct()).toBeCloseTo(0, 10);
      expect(widget.lambda()).toBeCloseTo(0, 10);
      expect(widget.projectionLength()).toBeCloseTo(0, 10);
      // `-0` é possível aqui (λ = 0 vezes uma coordenada negativa), então a comparação é numérica.
      expect(widget.projection()[0]).toBeCloseTo(0, 10);
      expect(widget.projection()[1]).toBeCloseTo(0, 10);
    });

    it('longe da perpendicular não encaixa — o encaixe não é um ímã', async () => {
      // 158° contra os 143° da perpendicular: longe demais para o encaixe valer.
      const { widget } = await renderWidget((w) => w.dragTo('b', [-1, 0.4]));

      expect(widget.orthogonal()).toBeFalse();
      expect(widget.dotProduct()).toBeCloseTo(-1.4, 10);
    });

    it('com a projeção nula o erro passa a ser o próprio x — e continua desenhado', async () => {
      const { widget } = await renderWidget((w) => w.dragTo('b', [-0.7, 0.5]));

      expect(widget.error()[0]).toBeCloseTo(widget.x()[0], 6);
      expect(widget.error()[1]).toBeCloseTo(widget.x()[1], 6);
    });

    it('o erro é perpendicular a b em qualquer posição — é o que a lição afirma', async () => {
      const { widget } = await renderWidget();

      for (const point of [
        [1, 1],
        [-2, 0.5],
        [0.4, 2.4],
        [-1, -3],
      ] as [number, number][]) {
        widget.dragTo('b', point);
        const [ex, ey] = widget.error();
        const [bx, by] = widget.b();
        expect(Math.abs(ex * bx + ey * by))
          .withContext(`b = ${widget.b()}: o erro deixou de ser perpendicular`)
          .toBeLessThan(1e-6);
      }
    });

    it('arrastar x move x e deixa b onde estava', async () => {
      const { widget } = await renderWidget((w) => w.dragTo('x', [1, 2]));

      expect(widget.x()).toEqual([1, 2]);
      expect(widget.b()).toEqual([1, 1]);
    });
  });

  describe('o snapshot é o que o runtime afirma', () => {
    it('reporta os cinco campos nomeados, com os tipos certos', async () => {
      const { widget } = await renderWidget();

      const reported: WidgetSnapshot[] = [];
      widget.snapshotChange.subscribe((snapshot) => reported.push(snapshot));
      widget.dragTo('b', [1, 1]);

      expect(reported.length).toBe(1);
      const snapshot = reported[0];

      expect(Object.keys(snapshot).sort()).toEqual([
        'cos',
        'dot',
        'lambda',
        'orthogonal',
        'projectionLength',
      ]);
      expect(typeof snapshot['orthogonal']).toBe('boolean');
      for (const key of ['cos', 'dot', 'lambda', 'projectionLength']) {
        expect(typeof snapshot[key]).withContext(`${key} precisa ser número`).toBe('number');
      }
    });

    it('o estado ortogonal chega como boolean true — é a checagem do completionCriterion', async () => {
      const { widget } = await renderWidget();

      const reported: WidgetSnapshot[] = [];
      widget.snapshotChange.subscribe((snapshot) => reported.push(snapshot));
      widget.dragTo('b', [-0.7, 0.5]);

      expect(reported[reported.length - 1]['orthogonal']).toBeTrue();
    });
  });

  describe('falha alto quando o manifesto está incompleto', () => {
    it('sem numericExample.inputs.x a widget não inventa um vetor, e o erro nomeia a lição', async () => {
      await TestBed.configureTestingModule({ imports: [ProjectionWidgetComponent] }).compileComponents();

      const fixture = TestBed.createComponent(ProjectionWidgetComponent);
      fixture.componentRef.setInput('lessonId', LESSON_ID);
      fixture.componentRef.setInput('binding', {
        widgetId: 'ProjectionWidget',
        config: {},
        inputs: {},
      } satisfies RuntimeWidgetBinding);

      let message = '';
      try {
        fixture.detectChanges();
      } catch (error) {
        message = String(error);
      }

      expect(message).toContain('inputs.x');
      expect(message).toContain(LESSON_ID);
      expect(message).toContain('ProjectionWidget');
    });
  });

  describe('o desenho não contradiz o texto', () => {
    it('nada sai do quadro, nem com a projeção muito maior que b', async () => {
      const { fixture, widget } = await renderWidget((w) => w.dragTo('x', [8, 6]));
      expect(widget.lambda()).toBeGreaterThan(1);

      const numbers = paintedCoordinates(fixture);
      expect(numbers.length).toBeGreaterThan(0);
      expect(Math.min(...numbers)).toBeGreaterThanOrEqual(-2);
      expect(Math.max(...numbers)).toBeLessThanOrEqual(362);
    });

    it('o ângulo reto do pé da projeção é sempre desenhado — inclusive com projeção nula', async () => {
      const { widget } = await renderWidget();
      expect(widget.rightAnglePoints().length).toBeGreaterThan(0);

      // Com a projeção nula o pé cai na origem, e o ângulo reto entre b e o erro continua válido:
      // é justamente o desenho que sustenta "o erro é o próprio x, e ele é perpendicular a b".
      widget.dragTo('b', [-0.7, 0.5]);
      expect(widget.rightAnglePoints().length).toBeGreaterThan(0);
    });
  });
});
