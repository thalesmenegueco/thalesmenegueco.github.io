import { DependencyEdge } from './timeline.dependencies';
import { BarGeometry, buildConnectorPaths } from './timeline.path';

const geo = (left: number, right: number, centerY: number, rowIndex: number): BarGeometry => ({
  left,
  right,
  centerY,
  rowIndex,
});

const edge = (predecessorId: string, successorId: string): DependencyEdge => ({
  predecessorId,
  successorId,
  type: 'finish-to-start',
});

describe('timeline.path', () => {
  it('should be deterministic for the same input', () => {
    const edges = [edge('a', 'b')];
    const geometry = new Map<string, BarGeometry>([
      ['a', geo(10, 30, 20, 0)],
      ['b', geo(50, 70, 60, 1)],
    ]);
    expect(buildConnectorPaths(edges, geometry, 22)).toEqual(
      buildConnectorPaths(edges, geometry, 22)
    );
  });

  it('should start at the predecessor right edge and end at the successor left edge', () => {
    const geometry = new Map<string, BarGeometry>([
      ['a', geo(10, 30, 20, 0)],
      ['b', geo(50, 70, 60, 1)],
    ]);
    const [path] = buildConnectorPaths([edge('a', 'b')], geometry, 22);
    expect(path.d.startsWith('M 30 20')).toBeTrue();
    expect(path.d.endsWith('50 60')).toBeTrue();
  });

  it('should route forward when the predecessor is left of the successor', () => {
    const geometry = new Map<string, BarGeometry>([
      ['a', geo(10, 30, 20, 0)],
      ['b', geo(50, 70, 60, 1)],
    ]);
    const [path] = buildConnectorPaths([edge('a', 'b')], geometry, 22);
    expect(path.d).toContain('30 20');
    expect(path.d).toContain('50 60');
  });

  it('should route a backward dependency with a detour', () => {
    const geometry = new Map<string, BarGeometry>([
      ['a', geo(60, 80, 20, 0)],
      ['b', geo(10, 30, 60, 1)],
    ]);
    const [path] = buildConnectorPaths([edge('a', 'b')], geometry, 22);
    // Ends at the successor's left edge even though it is left of the predecessor.
    expect(path.d.endsWith('10 60')).toBeTrue();
  });

  it('should handle overlapping bars', () => {
    const geometry = new Map<string, BarGeometry>([
      ['a', geo(10, 50, 20, 0)],
      ['b', geo(30, 70, 60, 1)],
    ]);
    const [path] = buildConnectorPaths([edge('a', 'b')], geometry, 22);
    // successor.left (30) < predecessor.right (50) -> detour, still ends at successor.
    expect(path.d.endsWith('30 60')).toBeTrue();
  });

  it('should route a same-row dependency with a vertical bump when there is room', () => {
    const geometry = new Map<string, BarGeometry>([
      ['a', geo(10, 30, 20, 0)],
      ['b', geo(60, 80, 20, 0)],
    ]);
    const [path] = buildConnectorPaths([edge('a', 'b')], geometry, 22);
    expect(path.d).toContain('M 30 20');
    expect(path.d).toContain('60 20');
  });

  it('should assign different lanes to multiple edges sharing a predecessor', () => {
    const geometry = new Map<string, BarGeometry>([
      ['a', geo(10, 30, 20, 0)],
      ['b', geo(50, 70, 60, 1)],
      ['c', geo(50, 70, 100, 2)],
    ]);
    const paths = buildConnectorPaths([edge('a', 'b'), edge('a', 'c')], geometry, 22);
    expect(paths.length).toBe(2);
    expect(paths[0].d).not.toBe(paths[1].d);
  });

  it('should skip edges whose endpoints lack geometry', () => {
    const geometry = new Map<string, BarGeometry>([['a', geo(10, 30, 20, 0)]]);
    const paths = buildConnectorPaths([edge('a', 'ghost')], geometry, 22);
    expect(paths).toEqual([]);
  });
});
