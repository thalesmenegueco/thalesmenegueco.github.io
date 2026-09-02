/**
 * Pure connector-path generation. No Angular, DOM, or framework imports.
 *
 * Produces deterministic orthogonal SVG paths (finish-to-start): from the right
 * edge of the predecessor bar to the left edge of the successor bar, with an
 * arrowhead added by the renderer (pointing toward the successor).
 */

import { DependencyEdge } from './timeline.dependencies';

export interface BarGeometry {
  /** Chart-space left edge (x). */
  readonly left: number;
  /** Chart-space right edge (x). */
  readonly right: number;
  /** Chart-space vertical center (y, includes the header offset). */
  readonly centerY: number;
  readonly rowIndex: number;
}

export interface ConnectorPath {
  readonly predecessorId: string;
  readonly successorId: string;
  readonly d: string;
}

const H_GAP = 8;
const LANE_GAP = 6;

const round = (n: number): number => Math.round(n * 100) / 100;

export function buildConnectorPaths(
  edges: readonly DependencyEdge[],
  geometry: ReadonlyMap<string, BarGeometry>,
  barHeight: number
): ConnectorPath[] {
  // Deterministic ordering, then a deterministic lane counter per predecessor.
  const sorted = [...edges].sort((a, b) => {
    const rowA = geometry.get(a.predecessorId)?.rowIndex ?? 0;
    const rowB = geometry.get(b.predecessorId)?.rowIndex ?? 0;
    if (rowA !== rowB) {
      return rowA - rowB;
    }
    const succA = geometry.get(a.successorId)?.rowIndex ?? 0;
    const succB = geometry.get(b.successorId)?.rowIndex ?? 0;
    return succA - succB;
  });

  const laneByPredecessor = new Map<string, number>();
  const paths: ConnectorPath[] = [];

  for (const edge of sorted) {
    const pred = geometry.get(edge.predecessorId);
    const succ = geometry.get(edge.successorId);
    if (!pred || !succ) {
      continue;
    }
    const lane = laneByPredecessor.get(edge.predecessorId) ?? 0;
    laneByPredecessor.set(edge.predecessorId, lane + 1);
    paths.push({
      predecessorId: edge.predecessorId,
      successorId: edge.successorId,
      d: route(pred, succ, lane, barHeight),
    });
  }

  return paths;
}

function route(pred: BarGeometry, succ: BarGeometry, lane: number, barHeight: number): string {
  const x0 = pred.right;
  const y0 = pred.centerY;
  const x1 = succ.left;
  const y1 = succ.centerY;

  // Forward: predecessor is to the left of the successor.
  if (x1 >= x0) {
    if (y0 === y1) {
      if (x1 - x0 < 2 * H_GAP + 4) {
        return `M ${round(x0)} ${round(y0)} L ${round(x1)} ${round(y1)}`;
      }
      const yBump = y0 - (barHeight / 2 + LANE_GAP * (lane + 1));
      const left = x0 + H_GAP;
      const right = x1 - H_GAP;
      return [
        `M ${round(x0)} ${round(y0)}`,
        `L ${round(left)} ${round(y0)}`,
        `L ${round(left)} ${round(yBump)}`,
        `L ${round(right)} ${round(yBump)}`,
        `L ${round(right)} ${round(y1)}`,
        `L ${round(x1)} ${round(y1)}`,
      ].join(' ');
    }

    const busX = Math.min(x0 + H_GAP + lane * LANE_GAP, x1);
    return [
      `M ${round(x0)} ${round(y0)}`,
      `L ${round(busX)} ${round(y0)}`,
      `L ${round(busX)} ${round(y1)}`,
      `L ${round(x1)} ${round(y1)}`,
    ].join(' ');
  }

  // Backward / overlapping: detour above the predecessor row and come back.
  const busX = x0 + H_GAP + lane * LANE_GAP;
  const yLane = y0 - (barHeight / 2 + LANE_GAP * (lane + 1));
  return [
    `M ${round(x0)} ${round(y0)}`,
    `L ${round(x0 + H_GAP)} ${round(y0)}`,
    `L ${round(x0 + H_GAP)} ${round(yLane)}`,
    `L ${round(busX)} ${round(yLane)}`,
    `L ${round(busX)} ${round(y1)}`,
    `L ${round(x1)} ${round(y1)}`,
  ].join(' ');
}
