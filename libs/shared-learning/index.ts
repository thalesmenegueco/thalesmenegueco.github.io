/**
 * `@shared/learning` — the study catalogue contract.
 *
 * Subject/module types plus the module-kind labels. Extracted from the studies
 * feature so the ML platform can drive its hub from data — four courses x two
 * modules — and share one vocabulary for module kinds.
 *
 * ## Scope note
 *
 * This lib is deliberately types-and-labels only. `explore-data`'s lesson
 * engine (`lessons/lesson.types.ts` and its validators) is **not** promoted
 * here, per the plan's conditional: it should only be shared if the ML courses
 * will actually reuse that engine. If they get their own engine, the shared
 * lesson contract should be designed fresh rather than merging two engines
 * speculatively.
 */
export type {
  ModuleKind,
  ModuleStatus,
  StudyModule,
  StudySubject,
} from './study.types';
export { MODULE_KIND_LABELS, moduleKindLabel } from './module-labels';
