import { ModuleKind } from './study.types';

/**
 * Display label for each module kind.
 *
 * Hoisted out of `StudiesComponent`, where it was a private field, so the
 * platform's hub and any module header can label a kind the same way. The
 * labels are the ones the existing studies page already rendered.
 */
export const MODULE_KIND_LABELS: Record<ModuleKind, string> = {
  teoria: 'Teoria',
  aplicada: 'Matemática aplicada',
  processo: 'Processo',
};

/** Convenience wrapper so callers do not reach into the map. */
export function moduleKindLabel(kind: ModuleKind): string {
  return MODULE_KIND_LABELS[kind];
}
