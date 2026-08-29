/**
 * Data model for the "Exatas em Movimento" study hub.
 *
 * A `StudySubject` groups the learning moments of a discipline: a theory
 * module (discovery-based), an applied module (real-world problem solving),
 * and a process module (one problem walked through the full mathematical
 * chain). New mini-courses only need to add a subject to the catalog — the
 * container renders them automatically.
 */

export type ModuleKind = 'teoria' | 'aplicada' | 'processo';

export type ModuleStatus = 'available' | 'coming-soon';

export interface StudyModule {
  id: string;
  kind: ModuleKind;
  status: ModuleStatus;
  title: string;
  description: string;
  /** Absolute route the module links to; `null` when not yet available. */
  route: string | null;
  /** Asset path (relative to the site `<base href="/">`). */
  icon: string;
  meta: string[];
}

export interface StudySubject {
  id: string;
  name: string;
  tagline: string;
  modules: StudyModule[];
}
