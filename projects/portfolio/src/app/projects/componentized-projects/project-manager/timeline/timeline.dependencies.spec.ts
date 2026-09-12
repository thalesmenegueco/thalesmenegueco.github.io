import {
  buildDependencyGraph,
  collectPredecessors,
} from './timeline.dependencies';
import { TimelineItem } from './timeline.types';

const item = (
  id: string,
  dependencies: Array<{ predecessorId: string; type: string }> = []
): TimelineItem => ({
  id,
  kind: 'task',
  parentId: 'p',
  label: id,
  start: '',
  end: '',
  dependencies: dependencies as TimelineItem['dependencies'],
});

describe('timeline.dependencies', () => {
  it('should accept a valid edge', () => {
    const graph = buildDependencyGraph([
      item('a'),
      item('b', [{ predecessorId: 'a', type: 'finish-to-start' }]),
    ]);
    expect(graph.edges).toEqual([{ predecessorId: 'a', successorId: 'b', type: 'finish-to-start' }]);
    expect(graph.issues).toEqual([]);
  });

  it('should report a missing predecessor', () => {
    const graph = buildDependencyGraph([
      item('b', [{ predecessorId: 'ghost', type: 'finish-to-start' }]),
    ]);
    expect(graph.edges).toEqual([]);
    expect(graph.issues.some(i => i.code === 'missing-predecessor')).toBeTrue();
  });

  it('should report an unsupported dependency type', () => {
    const graph = buildDependencyGraph([
      item('a'),
      item('b', [{ predecessorId: 'a', type: 'start-to-start' }]),
    ]);
    expect(graph.edges).toEqual([]);
    expect(graph.issues.some(i => i.code === 'unsupported-dependency-type')).toBeTrue();
  });

  it('should report a self-dependency', () => {
    const graph = buildDependencyGraph([
      item('a', [{ predecessorId: 'a', type: 'finish-to-start' }]),
    ]);
    expect(graph.edges).toEqual([]);
    expect(graph.issues.some(i => i.code === 'self-dependency')).toBeTrue();
  });

  it('should drop a duplicate edge', () => {
    const graph = buildDependencyGraph([
      item('a'),
      item('b', [
        { predecessorId: 'a', type: 'finish-to-start' },
        { predecessorId: 'a', type: 'finish-to-start' },
      ]),
    ]);
    expect(graph.edges.length).toBe(1);
    expect(graph.issues.some(i => i.code === 'duplicate-dependency')).toBeTrue();
  });

  it('should detect a two-node cycle and drop the closing edge', () => {
    const graph = buildDependencyGraph([
      item('a', [{ predecessorId: 'b', type: 'finish-to-start' }]),
      item('b', [{ predecessorId: 'a', type: 'finish-to-start' }]),
    ]);
    expect(graph.issues.some(i => i.code === 'dependency-cycle')).toBeTrue();
    expect(graph.edges.length).toBeLessThan(2);
  });

  it('should detect a larger cycle', () => {
    const graph = buildDependencyGraph([
      item('a', [{ predecessorId: 'c', type: 'finish-to-start' }]),
      item('b', [{ predecessorId: 'a', type: 'finish-to-start' }]),
      item('c', [{ predecessorId: 'b', type: 'finish-to-start' }]),
    ]);
    expect(graph.issues.some(i => i.code === 'dependency-cycle')).toBeTrue();
    expect(graph.edges.length).toBeLessThan(3);
  });

  it('should support multiple independent chains', () => {
    const graph = buildDependencyGraph([
      item('a'),
      item('b', [{ predecessorId: 'a', type: 'finish-to-start' }]),
      item('x'),
      item('y', [{ predecessorId: 'x', type: 'finish-to-start' }]),
    ]);
    expect(graph.edges.length).toBe(2);
  });

  describe('collectPredecessors', () => {
    it('should distinguish direct predecessors from indirect ancestors', () => {
      const graph = buildDependencyGraph([
        item('a'),
        item('b', [{ predecessorId: 'a', type: 'finish-to-start' }]),
        item('c', [{ predecessorId: 'b', type: 'finish-to-start' }]),
        item('d', [{ predecessorId: 'c', type: 'finish-to-start' }]),
      ]);

      const info = collectPredecessors(graph, 'd');
      expect(info.direct).toEqual(['c']);
      expect([...info.ancestors].sort()).toEqual(['a', 'b']);
    });

    it('should terminate safely even if a cycle exists', () => {
      const graph = buildDependencyGraph([
        item('a', [{ predecessorId: 'b', type: 'finish-to-start' }]),
        item('b', [{ predecessorId: 'a', type: 'finish-to-start' }]),
      ]);
      // No infinite loop: traversal is bounded by a visited set.
      const info = collectPredecessors(graph, 'a');
      expect(Array.isArray(info.direct)).toBeTrue();
      expect(Array.isArray(info.ancestors)).toBeTrue();
    });
  });
});
