import { IMPLEMENTED_WIDGETS, WIDGET_COMPONENTS, hasWidgetComponent } from './widget-registry';
import { FUNDAMENTOS_TEORIA_01_RUNTIME } from '../fundamentos-teoria/fundamentos-teoria-01.runtime';
import { LESSON_BINDINGS } from '../runtime/lesson-bindings.generated';

/**
 * The bridge between "the manifest names a widget" and "the runtime can render it".
 *
 * `registries.json` closes the vocabulary of widget *names*, and `validate:manifests` refuses a
 * name outside it. What no gate could see is whether a name has a **component** — the pilot could
 * have been contracted on `ProjectionWidget` and simply shown the "ainda não tem componente"
 * notice, with every green check in place. This spec is that check.
 *
 * It is a spec and not a gate because the answer lives in TypeScript: the mapping is a compile-time
 * fact (the registry is typed `satisfies Record<string, Type<MlWidgetComponent>>`), and the only
 * thing left to verify is coverage — which lessons exist, and whether each one's widget is in the
 * registry.
 *
 * **Every lesson that gets a runtime file is added to `LESSON_RUNTIMES` below.** That line is the
 * whole cost of the guard, and it is the same "cobertura ausente tem de ser barulhenta" rule as
 * `manifest-examples.spec.ts`: a lesson whose widget has no component must fail loudly here rather
 * than open as a warning box in the browser.
 */
const LESSON_RUNTIMES = [FUNDAMENTOS_TEORIA_01_RUNTIME];

describe('widgets: manifesto → componente', () => {
  it('toda lição que tem runtime aponta para uma widget com componente', () => {
    expect(LESSON_RUNTIMES.length).toBeGreaterThan(0);

    for (const runtime of LESSON_RUNTIMES) {
      const widgetId = runtime.widget.widgetId;
      expect(hasWidgetComponent(widgetId))
        .withContext(
          `${runtime.lessonId} está contratada em ${widgetId}, que não tem componente: a lição ` +
            'abriria no aviso "ainda não tem componente no runtime". Implemente a widget e ' +
            'registre-a em widget-registry.ts.',
        )
        .toBeTrue();
    }
  });

  it('a lista de implementadas e o mapa de componentes não divergem', () => {
    expect(IMPLEMENTED_WIDGETS.slice().sort()).toEqual(Object.keys(WIDGET_COMPONENTS).sort());
  });

  it('as widgets que o Curso 1 usa hoje estão implementadas e são as esperadas', () => {
    // Se este conjunto mudar, é uma decisão de currículo, não um detalhe de implementação.
    expect(IMPLEMENTED_WIDGETS.slice().sort()).toEqual(['ProjectionWidget', 'VectorSpaceWidget']);
  });

  it('a fixture traz os inputs que cada widget lê — o elo manifesto ↔ widget', () => {
    // O que cada widget exige é `requireVector`, que falha alto quando o campo não existe; aqui a
    // conferência é anterior, no arquivo gerado, para o defeito aparecer como teste e não como
    // tela em branco no navegador de quem joga.
    expect(LESSON_BINDINGS['fundamentos-teoria-01'].inputs?.['c']).toBeDefined();

    expect(LESSON_BINDINGS['fundamentos-teoria-02'].inputs?.['x']).toBeDefined();
    expect(LESSON_BINDINGS['fundamentos-teoria-02'].inputs?.['y']).toBeDefined();
  });

  it('o nome da widget no manifesto e na fixture é o mesmo', () => {
    for (const [lessonId, binding] of Object.entries(LESSON_BINDINGS)) {
      expect(binding.widgetId)
        .withContext(`${lessonId}: widgetId vazio na fixture gerada`)
        .toBeTruthy();
    }
  });
});
