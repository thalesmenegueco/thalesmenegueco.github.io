/**
 * **Which widget id has a component** — the name→component bridge the docs describe as "the
 * manifest names the widget, and the runtime maps it later".
 *
 * ## The compromise in this file, stated out loud
 *
 * The map below and the player's `@switch` are two lists of the same ids, and they have to
 * agree. That duplication is deliberate, not an oversight: `NgComponentOutlet` cannot bind an
 * output, so a `(snapshotChange)` handler has to be wired in a **static** template, and a static
 * template cannot be generated from a TypeScript map. The alternatives were worse:
 *
 *   - a dynamic outlet plus a manual `ComponentRef` subscription — more moving parts, and an
 *     unsubscribe to get wrong on every step change, for zero student-visible gain;
 *   - one component that grows a mode switch inside it — how a widget becomes un-reviewable.
 *
 * So the player keeps the static `@switch`, and this map exists for the two things a template
 * cannot do: let a **spec** prove that every widget a lesson is contracted on has an
 * implementation, and let the `@default` branch tell "no component yet" (a roadmap state) from
 * "registered here but the template forgot the case" (a code bug, and a loud one).
 *
 * Adding a widget is therefore: the component, one entry here, one `@case` in
 * `../lesson-player/lesson-player.component.html`. The coverage spec in
 * `../lesson-player/widget-coverage.spec.ts` fails if a lesson names a widget missing from here.
 */
import type { Type } from '@angular/core';
import type { MlWidgetComponent } from '../runtime/widget-contract';
import { ProjectionWidgetComponent } from '../../widgets/projection/projection.component';
import { VectorSpaceWidgetComponent } from '../../widgets/vector-space/vector-space.component';

/**
 * Every widget id that has a component, keyed by its `registries.json` name.
 *
 * `satisfies Record<string, Type<MlWidgetComponent>>` is the compile-time half of the contract:
 * a component that does not take `binding`/`lessonId` and emit `snapshotChange` cannot be listed
 * here, so the seam is checked by the compiler rather than by memory.
 */
export const WIDGET_COMPONENTS = {
  VectorSpaceWidget: VectorSpaceWidgetComponent,
  ProjectionWidget: ProjectionWidgetComponent,
} as const satisfies Record<string, Type<MlWidgetComponent>>;

/** The ids with a component — what a lesson's `widget` must be for the lesson to be playable. */
export const IMPLEMENTED_WIDGETS: readonly string[] = Object.keys(WIDGET_COMPONENTS);

export function hasWidgetComponent(widgetId: string): boolean {
  return Object.prototype.hasOwnProperty.call(WIDGET_COMPONENTS, widgetId);
}
