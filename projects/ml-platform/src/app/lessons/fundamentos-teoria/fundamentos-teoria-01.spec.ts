import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FUNDAMENTOS_TEORIA_01 } from './fundamentos-teoria-01';
import { FUNDAMENTOS_TEORIA_01_RUNTIME } from './fundamentos-teoria-01.runtime';
import { LessonPlayerComponent } from '../lesson-player/lesson-player.component';
import { VectorSpaceWidgetComponent } from '../../widgets/vector-space/vector-space.component';
import { LESSON_BINDINGS } from '../runtime/lesson-bindings.generated';
import { parseRichText } from '../rich-text.pipe';

/**
 * Guards the **arc** of the pilot lesson, not its wording.
 *
 * `validate:manifests` proves the manifest is honest about the book: refs resolve, addresses
 * exist, formulas are literal slices. It cannot see the one rule the lesson exists to test —
 * that the formula is named **only in the last step**, after the student has explored. That
 * rule is why the lesson was written this way, and it is the first thing a regeneration
 * would break, so it gets a test.
 *
 * These assertions pin structure and provenance only. Nothing here can judge whether the
 * prose is *didactic* — that stays the human checklist in `content-source/CAMADA3.md`.
 */
describe('fundamentos-teoria-01 — arco da lição gerada', () => {
  const lesson = FUNDAMENTOS_TEORIA_01;

  /** The sections the manifest contracts on. A citation outside this set is a wrong address. */
  const CONTRACTED_REFS = ['mml-2.4', 'mml-2.5'];

  it('é a lição do manifesto fundamentos-teoria-01', () => {
    expect(lesson.lessonId).toBe('fundamentos-teoria-01');
    expect(lesson.title.length).toBeGreaterThan(0);
    expect(lesson.objective.length).toBeGreaterThan(20);
  });

  it('tem 2 a 4 passos — menos não tem arco, mais estoura os 15 minutos', () => {
    expect(lesson.steps.length).toBeGreaterThanOrEqual(2);
    expect(lesson.steps.length).toBeLessThanOrEqual(4);
  });

  it('só o ÚLTIMO passo enuncia a fórmula', () => {
    const withFormulas = lesson.steps.filter((step) => step.katex.length > 0);

    expect(withFormulas.length)
      .withContext('a fórmula antes do fim transforma os passos seguintes em ilustração')
      .toBe(1);
    expect(withFormulas[0]).toBe(lesson.steps[lesson.steps.length - 1]);
  });

  it('o passo final traz as três keyFormulas do manifesto, literalmente', () => {
    const last = lesson.steps[lesson.steps.length - 1];
    const manifestFormulas = [
      String.raw`\boldsymbol{v} = \sum_{i=1}^k \lambda_i \boldsymbol{x}_i`,
      String.raw`\boldsymbol{x} + \boldsymbol{y} = (x_1 + y_1, \dots, x_n + y_n)^\top`,
      String.raw`\lambda \boldsymbol{x} = (\lambda x_1, \dots, \lambda x_n)^\top`,
    ];

    for (const formula of manifestFormulas) {
      expect(last.katex)
        .withContext(`fórmula do manifesto ausente ou reescrita: ${formula}`)
        .toContain(formula);
    }
  });

  it('todo passo está completo e cita só as seções contratadas', () => {
    for (const step of lesson.steps) {
      expect(step.id.length).toBeGreaterThan(0);
      expect(step.title.length).toBeGreaterThan(0);
      expect(step.narrative.length).toBeGreaterThan(0);
      for (const block of step.narrative) {
        expect(block.trim().length).toBeGreaterThan(0);
      }

      expect(step.widgetInteraction.widgetId).toBe('VectorSpaceWidget');
      expect(step.widgetInteraction.prompt.length).toBeGreaterThan(0);
      expect(step.widgetInteraction.expectedInsight.length).toBeGreaterThan(0);
      expect(step.checkpoint.question.length).toBeGreaterThan(0);
      expect(step.checkpoint.answer.length).toBeGreaterThan(0);
      expect(step.sourceRefs.length).toBeGreaterThan(0);

      for (const ref of step.sourceRefs) {
        expect(CONTRACTED_REFS)
          .withContext(`${step.id} cita ${ref}, que o manifesto não contrata`)
          .toContain(ref);
      }
    }
  });

  it('o cenário de abertura é concreto: traz números e não abre pela notação', () => {
    const opening = lesson.steps[0].narrative[0];

    expect(opening).toMatch(/\d/);
    expect(opening)
      .withContext('o cenário não deve enunciar o conceito que o aluno vai descobrir')
      .not.toMatch(/combinação linear|espaço vetorial|subespaço/i);
  });

  it('o exemplo numérico do manifesto aparece na prosa', () => {
    const prose = lesson.steps
      .flatMap((step) => [...step.narrative, step.checkpoint.question, step.checkpoint.answer])
      .join(' ');

    expect(prose).toContain('(2, 3)');
    expect(prose).toContain('(1, 0)');
  });

  it('o passo 2 nomeia o escalar, e não só no passo 3', () => {
    // A first read-through showed the reader only meeting the word at step 3, after having
    // been asked to *do* the operation for a whole step without a name for it.
    const stepTwo = lesson.steps[1];
    const prose = [...stepTwo.narrative, stepTwo.checkpoint.question, stepTwo.checkpoint.answer]
      .join(' ')
      .toLowerCase();

    expect(prose).toContain('escalar');
    expect(prose)
      .withContext('o escalar precisa ser distinguido da combinação, não só nomeado')
      .toContain('cada coordenada');
  });
});

/**
 * The widget bug a read-through caught: with a fixed ±5 unit frame, pushing `λ` sent `λv`
 * off the canvas while step 2's text claimed these operations never leave the plane — the
 * widget demonstrated the opposite of the lesson. The invariant that fixes it is testable,
 * so it is tested: nothing the widget draws may fall outside its own viewBox.
 */
describe('VectorSpaceWidget — nada é desenhado fora do quadro', () => {
  async function renderWidget(
    setup: (widget: VectorSpaceWidgetComponent) => void,
  ): Promise<{ svg: SVGElement; widget: VectorSpaceWidgetComponent }> {
    await TestBed.configureTestingModule({
      imports: [VectorSpaceWidgetComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(VectorSpaceWidgetComponent);
    fixture.componentRef.setInput('target', [2, 3]);
    fixture.detectChanges();
    setup(fixture.componentInstance);
    fixture.detectChanges();

    return {
      svg: (fixture.nativeElement as HTMLElement).querySelector('svg.plane') as SVGElement,
      widget: fixture.componentInstance,
    };
  }

  /** Every coordinate the SVG paints, as numbers. */
  function paintedCoordinates(svg: SVGElement): number[] {
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
        numbers.push(...points.split(/[\s,]+/).filter(Boolean).map(Number));
      }
    }
    return numbers;
  }

  it('com os controles no máximo, todo desenho continua dentro do viewBox', async () => {
    const { svg } = await renderWidget((widget) => {
      widget.values.c1.set(3);
      widget.values.c2.set(3);
      widget.values.w1.set(3);
      widget.values.w2.set(3);
      widget.values.lambda.set(3);
    });

    const numbers = paintedCoordinates(svg);
    expect(numbers.length).toBeGreaterThan(0);
    expect(Math.min(...numbers)).toBeGreaterThanOrEqual(-2);
    expect(Math.max(...numbers)).toBeLessThanOrEqual(362);
  });

  it('também não sai do quadro com a base inclinada, que estica v além dos coeficientes', async () => {
    const { svg, widget } = await renderWidget((w) => {
      w.setPreset(1);
      w.values.c1.set(3);
      w.values.c2.set(3);
      w.values.lambda.set(3);
    });

    expect(widget.v()).toEqual([6, 3]);
    const numbers = paintedCoordinates(svg);
    expect(Math.min(...numbers)).toBeGreaterThanOrEqual(-2);
    expect(Math.max(...numbers)).toBeLessThanOrEqual(362);
  });

  it('usa o quadro cheio por padrão e afasta a janela só quando algo precisa', async () => {
    const defaults = await renderWidget((widget) => {
      widget.values.c1.set(2);
      widget.values.c2.set(3);
      widget.values.lambda.set(1);
      // Zeroed so `v + w` does not itself ask for room: this case is about `v` fitting.
      widget.values.w1.set(0);
      widget.values.w2.set(0);
    });
    // v = (2, 3) and λv = (2, 3) fit the ±5 unit frame, so nothing should be zoomed out.
    expect(defaults.widget.pxPerUnit()).toBe(34);

    await TestBed.resetTestingModule();

    const stretched = await renderWidget((widget) => {
      widget.values.c1.set(3);
      widget.values.c2.set(3);
      widget.values.lambda.set(3);
    });
    // λv = (9, 9) does not fit, so the window moves out instead of the vector leaving it.
    expect(stretched.widget.pxPerUnit()).toBeLessThan(34);
    expect(stretched.widget.windowUnits()).toBeGreaterThan(5);
  });
});

describe('runtime de fundamentos-teoria-01 — o contrato vira checagem', () => {
  const runtime = FUNDAMENTOS_TEORIA_01_RUNTIME;
  const binding = LESSON_BINDINGS['fundamentos-teoria-01'];
  const manifestFormulas = [
    String.raw`\boldsymbol{v} = \sum_{i=1}^k \lambda_i \boldsymbol{x}_i`,
    String.raw`\boldsymbol{x} + \boldsymbol{y} = (x_1 + y_1, \dots, x_n + y_n)^\top`,
    String.raw`\lambda \boldsymbol{x} = (\lambda x_1, \dots, \lambda x_n)^\top`,
  ];

  it('cobre todos os passos do conteúdo, e só eles', () => {
    const contentIds = FUNDAMENTOS_TEORIA_01.steps.map((step) => step.id);
    const runtimeIds = runtime.steps.map((step) => step.contentStepId);

    expect(runtimeIds.slice().sort()).toEqual(contentIds.slice().sort());
  });

  it('a widget é a do manifesto, e o conteúdo não inventa outra', () => {
    expect(binding.widgetId).toBe('VectorSpaceWidget');

    for (const step of FUNDAMENTOS_TEORIA_01.steps) {
      expect(step.widgetInteraction.widgetId).toBe(binding.widgetId);
    }
  });

  it('a configuração inicial da widget vem do manifesto, não de uma constante', () => {
    // `fundamentos-teoria-01`'s `numericExample`: c = [2, 3] sobre a base canônica, v = (2, 3).
    // The player derives the widget's target from here; the old hardcoded `[2, 3]` was a copy.
    expect(binding.inputs?.['c']).toEqual([2, 3]);
    expect(binding.inputs?.['base']).toEqual([
      [1, 0],
      [0, 1],
    ]);
    expect(binding.config?.['availableOps']).toEqual(['sum', 'scale', 'linearCombination']);
  });

  it('o passo da fórmula oferece alternativas, e a certa é uma keyFormula do manifesto', () => {
    const formulaSteps = runtime.steps.filter((step) => step.validation.type === 'formula');

    expect(formulaSteps.length).withContext('o arco termina nomeando a fórmula').toBe(1);

    const [formulaStep] = formulaSteps;
    const options = formulaStep.options ?? [];
    const correctAnswer = (formulaStep.validation as { correctAnswer: string }).correctAnswer;

    expect(options.length).withContext('uma só alternativa não é escolha').toBeGreaterThanOrEqual(2);
    expect(options.filter((option) => option.id === correctAnswer).length).toBe(1);

    const correct = options.find((option) => option.id === correctAnswer);
    expect(correct).withContext('a alternativa correta precisa existir').toBeDefined();
    expect(manifestFormulas)
      .withContext('a alternativa correta precisa ser a fórmula contratada, literal')
      .toContain(correct!.latex);

    for (const option of options) {
      expect(option.feedback.length)
        .withContext(`alternativa ${option.id} sem feedback: errar não ensina nada`)
        .toBeGreaterThan(20);
    }
  });

  it('nenhuma checagem olha um campo que a widget não reporta', () => {
    // The keys `VectorSpaceWidget` emits. A typo here would fail closed — the step would be
    // impossible to pass — so the agreement is asserted instead of discovered in the browser.
    const reportedFields = ['reached', 'c1', 'c2', 'lambda', 'distance'];

    for (const step of runtime.steps) {
      if (step.validation.type === 'formula') {
        continue;
      }
      expect(reportedFields)
        .withContext(`${step.contentStepId} checa um campo inexistente`)
        .toContain(step.validation.field);
    }
  });

  it('o passo 2 pede λ negativo, que é o que o próprio prompt manda o aluno fazer', () => {
    const stepTwo = runtime.steps[1];
    const validation = stepTwo.validation as { type: string; field: string; range: [number, number] };
    const prompt = FUNDAMENTOS_TEORIA_01.steps[1].widgetInteraction.prompt.toLowerCase();

    expect(validation.field).toBe('lambda');
    expect(validation.range[1]).toBeLessThan(0);
    expect(prompt).withContext('a checagem não pode pedir o que o prompt não pediu').toContain('negativo');
  });
});

describe('LessonPlayerComponent — o avanço é conferido', () => {
  /** A fake range-input event, so a spec can drive the widget without touching the DOM. */
  function sliderEvent(value: number): Event {
    return { target: { value: String(value) } } as unknown as Event;
  }

  async function renderPlayer(): Promise<ComponentFixture<LessonPlayerComponent>> {
    await TestBed.configureTestingModule({ imports: [LessonPlayerComponent] }).compileComponents();

    const fixture = TestBed.createComponent(LessonPlayerComponent);
    fixture.componentRef.setInput('lesson', FUNDAMENTOS_TEORIA_01);
    fixture.componentRef.setInput('runtime', FUNDAMENTOS_TEORIA_01_RUNTIME);
    fixture.detectChanges();
    return fixture;
  }

  function widgetOf(fixture: ComponentFixture<LessonPlayerComponent>): VectorSpaceWidgetComponent {
    return fixture.debugElement.query(By.directive(VectorSpaceWidgetComponent)).componentInstance;
  }

  function click(fixture: ComponentFixture<LessonPlayerComponent>, selector: string): void {
    const button = (fixture.nativeElement as HTMLElement).querySelector(selector) as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
  }

  function heading(fixture: ComponentFixture<LessonPlayerComponent>): string {
    return (fixture.nativeElement as HTMLElement).querySelector('h2')?.textContent ?? '';
  }

  it('não avança enquanto a checagem do passo não foi cumprida, e diz por quê', async () => {
    const fixture = await renderPlayer();
    const element = fixture.nativeElement as HTMLElement;

    expect(heading(fixture)).toContain(FUNDAMENTOS_TEORIA_01.steps[0].title);

    click(fixture, '.player-nav .primary');

    // Shape (c) let this click through: the student reached step 2 having touched nothing.
    expect(heading(fixture)).toContain(FUNDAMENTOS_TEORIA_01.steps[0].title);
    expect(element.querySelector('.feedback')?.textContent).toContain('alvo');
  });

  it('avança quando cada checagem é cumprida, e só então deixa concluir a lição', async () => {
    const fixture = await renderPlayer();
    const element = fixture.nativeElement as HTMLElement;
    const total = FUNDAMENTOS_TEORIA_01.steps.length;

    expect(element.querySelector('.eyebrow')?.textContent).toContain(`1 de ${total}`);

    // Passo 1 — o alvo do manifesto é (2, 3), vindo do binding e não de uma constante.
    const widget = widgetOf(fixture);
    widget.onSlider('c1', sliderEvent(2));
    widget.onSlider('c2', sliderEvent(3));
    fixture.detectChanges();

    click(fixture, '.player-nav .primary');
    expect(heading(fixture)).toContain(FUNDAMENTOS_TEORIA_01.steps[1].title);

    // Passo 2 — o prompt manda levar λ para um valor negativo; a checagem pede isso.
    click(fixture, '.player-nav .primary');
    expect(heading(fixture))
      .withContext('λ ainda positivo: o passo 2 não pode passar')
      .toContain(FUNDAMENTOS_TEORIA_01.steps[1].title);

    widgetOf(fixture).onSlider('lambda', sliderEvent(-2));
    fixture.detectChanges();
    click(fixture, '.player-nav .primary');
    expect(heading(fixture)).toContain(FUNDAMENTOS_TEORIA_01.steps[2].title);

    // Passo 3 — a alternativa certa é a que o runtime declara, seja qual for a posição dela.
    const formulaStep = FUNDAMENTOS_TEORIA_01_RUNTIME.steps[2];
    const correctIndex = (formulaStep.options ?? []).findIndex(
      (option) => option.id === (formulaStep.validation as { correctAnswer: string }).correctAnswer,
    );
    const choices = Array.from(element.querySelectorAll('.choice')) as HTMLButtonElement[];
    expect(choices.length).toBeGreaterThanOrEqual(2);
    expect(correctIndex).toBeGreaterThanOrEqual(0);

    choices[correctIndex].click();
    fixture.detectChanges();
    click(fixture, '.player-nav .primary');

    expect(element.querySelector('.player-nav .primary')?.textContent).toContain('concluída');
  });

  it('recusa concluir a lição quando algum passo foi pulado pelos pontos', async () => {
    const fixture = await renderPlayer();
    const element = fixture.nativeElement as HTMLElement;

    // The dots are free navigation — an author's affordance. Completion is not.
    click(fixture, '.dots .dot:last-child');
    click(fixture, '.choice');
    click(fixture, '.player-nav .primary');

    expect(element.querySelector('.feedback')?.textContent)
      .withContext('os passos 1 e 2 não foram cumpridos')
      .toContain('Faltam');
  });

  it('esconde o insight do aluno e o mostra no modo avaliação', async () => {
    const fixture = await renderPlayer();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.review-box')).toBeNull();

    (element.querySelector('.review input') as HTMLInputElement).click();
    fixture.detectChanges();

    expect(element.querySelector('.review-box')?.textContent).toContain(
      FUNDAMENTOS_TEORIA_01.steps[0].widgetInteraction.expectedInsight,
    );
  });

  it('renderiza a ênfase do narrative em vez de mostrar os asteriscos', async () => {
    // The reader saw literal `**combinação linear**`: the player interpolated the text raw.
    // The generated prose carries emphasis because `content-source/` is markdown full of it.
    const fixture = await renderPlayer();
    const element = fixture.nativeElement as HTMLElement;
    const narrative = element.querySelector('.narrative') as HTMLElement;

    // Step 1 carries `*são*`, so the italic path renders on the opening step.
    expect(narrative.querySelector('em')?.textContent).toBe('são');

    // Navigate by the dots: this spec is about the renderer, not about the gate.
    click(fixture, '.dots .dot:last-child');

    expect(narrative.querySelector('strong')?.textContent).toBe('combinação linear');
    expect(narrative.textContent).not.toContain('**');
    expect(narrative.textContent).not.toContain('*');
  });
});

describe('parseRichText', () => {
  it('separa texto simples, negrito e itálico', () => {
    expect(parseRichText('sem ênfase')).toEqual([{ text: 'sem ênfase', emphasis: 'none' }]);
    expect(parseRichText('uma **combinação linear** aqui')).toEqual([
      { text: 'uma ', emphasis: 'none' },
      { text: 'combinação linear', emphasis: 'bold' },
      { text: ' aqui', emphasis: 'none' },
    ]);
    expect(parseRichText('os números *são* a posição')).toEqual([
      { text: 'os números ', emphasis: 'none' },
      { text: 'são', emphasis: 'italic' },
      { text: ' a posição', emphasis: 'none' },
    ]);
  });

  it('lida com negrito de um caractere, com acento e adjacente', () => {
    expect(parseRichText('**λᵢ**')).toEqual([{ text: 'λᵢ', emphasis: 'bold' }]);
    expect(parseRichText('**um** número')).toEqual([
      { text: 'um', emphasis: 'bold' },
      { text: ' número', emphasis: 'none' },
    ]);
  });

  it('não transforma multiplicação em itálico', () => {
    // CommonMark's flanking rule: an opening delimiter may not be followed by a space.
    expect(parseRichText('2 * x * 3')).toEqual([{ text: '2 * x * 3', emphasis: 'none' }]);
    expect(parseRichText('2*3')).toEqual([{ text: '2*3', emphasis: 'none' }]);
  });

  it('não quebra com string vazia nem com asterisco solto', () => {
    expect(parseRichText('')).toEqual([]);
    expect(parseRichText('*')).toEqual([{ text: '*', emphasis: 'none' }]);
  });
});
