import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import type { LessonContent } from '@ml/engine';
import { LessonPlayerComponent } from './lesson-player.component';
import { ProjectionWidgetComponent } from '../../widgets/projection/projection.component';
import { LESSON_BINDINGS } from '../runtime/lesson-bindings.generated';
import type { LessonRuntime } from '../runtime/lesson-runtime.types';

/**
 * The **seam** between the player and a widget — the thing the second lesson forced into
 * existence, and the thing no type-check can prove.
 *
 * Until lesson 02 the player knew one widget's vocabulary: it read `inputs.c` and `.base` and
 * passed them as `[target]`/`[bases]`. That is now the widget's own business (`requireVector`),
 * and the player only hands over the binding. Two failures become possible the moment that
 * changes, and both are invisible to `tsc`:
 *
 *   - the binding is not forwarded, so the widget opens with no numbers and throws;
 *   - the `@switch` has no case, so the student sees the "sem componente" notice while every gate
 *     stays green.
 *
 * So this spec drives the **real player** with a synthetic one-step lesson contracted on
 * `ProjectionWidget`, and asserts the arc end to end: the widget renders, the advance is refused
 * until the widget reports the state the step asserts, and finishing emits.
 *
 * The lesson here is deliberately fake — it is not `fundamentos-teoria-02`, whose content does not
 * exist yet. Only the wiring is under test, which is why it can be written before the prose.
 */
describe('player ↔ widget: a fiação que a segunda lição exigiu', () => {
  const LESSON_ID = 'teste-fiacao-projecao';

  const lesson: LessonContent = {
    lessonId: LESSON_ID,
    title: 'Lição sintética de fiação',
    objective: 'Provar que o player entrega o binding do manifesto à widget e obedece o snapshot.',
    steps: [
      {
        id: 'passo-1',
        title: 'Levar b até a perpendicular',
        narrative: ['Arraste a ponta de **b** até a perpendicular de x.'],
        katex: [],
        widgetInteraction: {
          widgetId: 'ProjectionWidget',
          prompt: 'Arraste **b** até que a projeção desapareça.',
          expectedInsight: 'A projeção é nula quando as direções são perpendiculares.',
        },
        checkpoint: { question: 'O que acontece com a projeção?', answer: 'Ela se anula.' },
        sourceRefs: [],
      },
    ],
  };

  const runtime: LessonRuntime = {
    lessonId: LESSON_ID,
    // O binding real do manifesto de teoria-02: é ele que o player precisa repassar intacto.
    widget: LESSON_BINDINGS['fundamentos-teoria-02'],
    steps: [
      {
        contentStepId: 'passo-1',
        validation: { type: 'equals', field: 'orthogonal', value: true },
        hint: 'Arraste b até ficar perpendicular a x.',
      },
    ],
  };

  async function render(): Promise<ComponentFixture<LessonPlayerComponent>> {
    await TestBed.configureTestingModule({ imports: [LessonPlayerComponent] }).compileComponents();

    const fixture = TestBed.createComponent(LessonPlayerComponent);
    fixture.componentRef.setInput('lesson', lesson);
    fixture.componentRef.setInput('runtime', runtime);
    fixture.detectChanges();
    return fixture;
  }

  function projectionWidget(fixture: ComponentFixture<LessonPlayerComponent>): ProjectionWidgetComponent {
    const found = fixture.debugElement.query(By.directive(ProjectionWidgetComponent));
    expect(found)
      .withContext('o player não renderizou a ProjectionWidget — falta @case ou binding')
      .not.toBeNull();
    return found.componentInstance as ProjectionWidgetComponent;
  }

  function finishButton(fixture: ComponentFixture<LessonPlayerComponent>): HTMLButtonElement {
    return (fixture.nativeElement as HTMLElement).querySelector(
      '.player-nav button.primary',
    ) as HTMLButtonElement;
  }

  it('renderiza a widget do manifesto, e não o aviso de widget ausente', async () => {
    const fixture = await render();

    expect((fixture.nativeElement as HTMLElement).querySelector('app-projection')).not.toBeNull();
    expect((fixture.nativeElement as HTMLElement).querySelector('.widget-missing')).toBeNull();
  });

  it('entrega o binding inteiro e o lessonId da lição que está sendo jogada', async () => {
    const fixture = await render();
    const widget = projectionWidget(fixture);

    expect(widget.lessonId()).toBe(LESSON_ID);
    expect(widget.binding().widgetId).toBe('ProjectionWidget');
    // Os números iniciais vêm do manifesto de teoria-02, não de uma constante no player.
    expect(widget.x()).toEqual([3, 4]);
    expect(widget.b()).toEqual([1, 1]);
  });

  it('recusa a conclusão enquanto o aluno não chegou ao estado que o passo checa', async () => {
    const fixture = await render();

    const emitted: string[] = [];
    fixture.componentInstance.finished.subscribe((lessonId) => emitted.push(lessonId));

    finishButton(fixture).click();
    fixture.detectChanges();

    // A recusa do passo **atual** vence a do conjunto: é o `hint` do autor que aparece, porque ele
    // diz o que fazer ("arraste b até...") e "faltam 1 passo" não diria nada de útil no último passo.
    const feedback = (fixture.nativeElement as HTMLElement).querySelector('.feedback');
    expect(feedback?.textContent).toContain('perpendicular');
    expect(emitted).withContext('recusar não pode emitir finished').toEqual([]);
  });

  it('libera a conclusão quando a widget reporta orthogonal = true', async () => {
    const fixture = await render();

    const emitted: string[] = [];
    fixture.componentInstance.finished.subscribe((lessonId) => emitted.push(lessonId));

    // O arrasto que o aluno faria na tela, pelo mesmo caminho que o ponteiro usa.
    projectionWidget(fixture).dragTo('b', [-0.7, 0.5]);
    fixture.detectChanges();

    finishButton(fixture).click();
    fixture.detectChanges();

    expect(emitted).toEqual([LESSON_ID]);
  });
});
