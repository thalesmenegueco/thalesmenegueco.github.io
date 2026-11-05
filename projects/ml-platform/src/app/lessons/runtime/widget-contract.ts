/**
 * The **widget contract** — the one shape the player and every lesson widget speak.
 *
 * ## Why a contract instead of per-widget inputs
 *
 * Until lesson 02 there was exactly one widget, so the player could afford to know its
 * vocabulary: it read `numericExample.inputs.c` and `.base` itself and passed `[target]` and
 * `[bases]`. The second widget proves that was a coincidence of having one — `ProjectionWidget`
 * initialises from `inputs.x` and `inputs.y`, and the third will use something else again.
 *
 * A player that knows each widget's input names is a player that has to be edited for every new
 * widget, and each edit is a place where a binding can be wired to the wrong field. So the
 * player now passes the binding **whole** (`runtime().widget`, straight from the generated
 * fixture) plus the `lessonId` for its error messages, and each widget reads its own inputs.
 * That is also the rule the runtime model already stated from the other side: *the widget is the
 * only thing that knows what its own state means* — which applies to its input names too.
 *
 * The output side is unchanged: a widget reports a `WidgetSnapshot` of scalars, and a runtime
 * step asserts one named field of it.
 *
 * ## Why `lessonId` rides along
 *
 * Not widget business, and it is not used for anything but error text: the binding is per
 * lesson, so a widget that is missing an input must be able to name **which manifest** to fix.
 * A message that says only "inputs.c ausente" sends the reader hunting; one that names the
 * lesson does not. Same reason the player used to throw with the lesson id in it.
 */
import type { InputSignal, OutputEmitterRef } from '@angular/core';
import type { RuntimeWidgetBinding, WidgetSnapshot } from './lesson-runtime.types';

/** A vector/point in the plane, in widget units. */
export type Vec2 = [number, number];

/**
 * What the player can assume about a widget it renders, and all it assumes.
 *
 * The two inputs and the one output are the entire seam: rendering happens in the player's
 * template (`@switch` over the widget id, because a dynamic outlet cannot bind an output),
 * and the registry in `../lesson-player/widget-registry.ts` records which ids have a
 * component, so a lesson pointing at an unimplemented widget fails loudly instead of blankly.
 */
export interface MlWidgetComponent {
  /** The lesson this binding came from — used only to name the manifest in error messages. */
  readonly lessonId: InputSignal<string>;
  /** `widget`, `widgetConfig` and `numericExample.inputs` of that lesson's manifest. */
  readonly binding: InputSignal<RuntimeWidgetBinding>;
  /** What the student's current widget state is, as scalars the runtime can assert. */
  readonly snapshotChange: OutputEmitterRef<WidgetSnapshot>;
}

/** Where an input came from, for the error message when it is not there. */
export interface WidgetContext {
  lessonId: string;
  widgetId: string;
}

function isVec2(value: unknown): value is Vec2 {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === 'number' &&
    typeof value[1] === 'number' &&
    Number.isFinite(value[0]) &&
    Number.isFinite(value[1])
  );
}

/**
 * A vector the lesson cannot be drawn without, from `numericExample.inputs`.
 *
 * **It throws, and that is the feature.** The alternative — a plausible default — is how the
 * pilot shipped with `[2, 3]` hand-copied into the player: a widget that silently invents its
 * numbers draws a picture no test proves and no manifest declares. A lesson whose widget has no
 * starting state is a contract bug, and it should name itself the first time it is rendered.
 */
export function requireVector(
  binding: RuntimeWidgetBinding,
  key: string,
  context: WidgetContext,
): Vec2 {
  const value = binding.inputs?.[key];
  if (isVec2(value)) {
    return [value[0], value[1]];
  }
  throw new Error(
    `${context.widgetId} (${context.lessonId}): numericExample.inputs.${key} não é um par de ` +
      'números — a widget não tem o que desenhar. O estado inicial vem do manifesto; veja ' +
      'manifests/README.md, campo numericExample.',
  );
}

/**
 * A list of vectors from an input that may legitimately be absent — e.g. a set of basis
 * directions, where "canonical" is a real default and not a lesson's number.
 *
 * The distinction matters: defaulting a *direction* invents nothing about the lesson, while
 * defaulting a *coordinate the student must reach* would be a second copy of the answer.
 */
export function readVectors(
  binding: RuntimeWidgetBinding,
  key: string,
  fallback: Vec2[],
): Vec2[] {
  const value = binding.inputs?.[key];
  if (!Array.isArray(value)) {
    return fallback;
  }
  const vectors = value.filter(isVec2).map((pair): Vec2 => [pair[0], pair[1]]);
  return vectors.length > 0 ? vectors : fallback;
}

/**
 * A boolean from `widgetConfig` — behaviour (may the student drag?) rather than state.
 *
 * `widgetConfig` and `numericExample.inputs` answer different questions, and this is the
 * documented split: `inputs` is what the widget opens with (and what the gate proves), `config`
 * is how it behaves. When the two declare the same number, `inputs` wins.
 */
export function readFlag(
  binding: RuntimeWidgetBinding,
  key: string,
  fallback: boolean,
): boolean {
  const value = binding.config?.[key];
  return typeof value === 'boolean' ? value : fallback;
}
