import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ScrollSpy } from './scroll-spy.service';

/**
 * A controllable stand-in for IntersectionObserver.
 *
 * The spy's whole job is reacting to observer callbacks, so the test needs to
 * decide when an entry "intersects" — something the real observer will not do
 * on demand inside a detached Karma fixture.
 */
class FakeIntersectionObserver implements IntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];

  static last(): FakeIntersectionObserver {
    return FakeIntersectionObserver.instances[FakeIntersectionObserver.instances.length - 1];
  }

  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds: ReadonlyArray<number> = [];
  readonly observed: Element[] = [];
  disconnected = false;

  constructor(private readonly callback: IntersectionObserverCallback) {
    FakeIntersectionObserver.instances.push(this);
  }

  observe(target: Element): void {
    this.observed.push(target);
  }

  unobserve(): void {}

  disconnect(): void {
    this.disconnected = true;
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  trigger(entries: ReadonlyArray<Pick<IntersectionObserverEntry, 'isIntersecting' | 'target'>>): void {
    this.callback(entries as unknown as IntersectionObserverEntry[], this);
  }
}

describe('ScrollSpy', () => {
  const nativeObserver = window.IntersectionObserver;
  let spy: ScrollSpy;
  let sections: HTMLElement[];

  beforeEach(() => {
    FakeIntersectionObserver.instances = [];
    (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
      FakeIntersectionObserver;

    TestBed.configureTestingModule({});
    spy = TestBed.inject(ScrollSpy);

    const doc = TestBed.inject(DOCUMENT);
    sections = ['sobre', 'projetos'].map((id) => {
      const section = doc.createElement('section');
      section.id = id;
      doc.body.appendChild(section);
      return section;
    });
  });

  afterEach(() => {
    spy.stop();
    sections.forEach((section) => section.remove());
    (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
      nativeObserver;
  });

  it('observes every section that exists, and skips the ones that do not', () => {
    spy.start(['sobre', 'projetos', 'inexistente']);

    expect(FakeIntersectionObserver.last().observed).toEqual(sections);
  });

  it('marks the section crossing the middle band as active', () => {
    spy.start(['sobre', 'projetos']);
    const observer = FakeIntersectionObserver.last();

    observer.trigger([{ isIntersecting: true, target: sections[1] }]);
    expect(spy.activeId()).toBe('projetos');

    observer.trigger([{ isIntersecting: true, target: sections[0] }]);
    expect(spy.activeId()).toBe('sobre');
  });

  it('keeps the page-order section when two are intersecting at once', () => {
    spy.start(['sobre', 'projetos']);

    FakeIntersectionObserver.last().trigger([
      { isIntersecting: true, target: sections[1] },
      { isIntersecting: true, target: sections[0] },
    ]);

    expect(spy.activeId()).toBe('sobre');
  });

  it('clears the active section when nothing crosses the band', () => {
    spy.start(['sobre', 'projetos']);
    const observer = FakeIntersectionObserver.last();

    observer.trigger([{ isIntersecting: true, target: sections[0] }]);
    observer.trigger([{ isIntersecting: false, target: sections[0] }]);

    expect(spy.activeId()).toBeNull();
  });

  it('disconnects and resets on stop', () => {
    spy.start(['sobre']);
    const observer = FakeIntersectionObserver.last();

    spy.stop();

    expect(observer.disconnected).toBeTrue();
    expect(spy.activeId()).toBeNull();
  });
});
