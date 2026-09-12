/**
 * Pure dependency graph. No Angular, DOM, or framework imports.
 *
 * Dependencies are finish-to-start: `predecessorId -> successorId`. This module
 * validates edges, drops invalid edges (with issues), detects cycles (dropping
 * the edges that close a cycle), and supports safe ancestor traversal via a
 * reverse adjacency map.
 */

import { TimelineItem, TimelineIssue } from './timeline.types';

export interface DependencyEdge {
  readonly predecessorId: string;
  readonly successorId: string;
  readonly type: 'finish-to-start';
}

export interface DependencyGraph {
  /** Valid, acyclic edges only. */
  readonly edges: readonly DependencyEdge[];
  /** successorId -> predecessorIds (reverse adjacency). */
  readonly reverse: ReadonlyMap<string, readonly string[]>;
  readonly issues: readonly TimelineIssue[];
}

const edgeKey = (predId: string, succId: string): string => `${predId}\u0000${succId}`;

export function buildDependencyGraph(items: readonly TimelineItem[]): DependencyGraph {
  const idSet = new Set(items.map((item) => item.id));
  const seen = new Set<string>();
  const edges: DependencyEdge[] = [];
  const issues: TimelineIssue[] = [];

  for (const item of items) {
    for (const dependency of item.dependencies) {
      const predecessorId = dependency.predecessorId;

      if (dependency.type !== 'finish-to-start') {
        issues.push({
          code: 'unsupported-dependency-type',
          itemId: item.id,
          relatedItemId: predecessorId,
          message: `Dependência com tipo não suportado foi ignorada.`,
          severity: 'warning',
        });
        continue;
      }
      if (predecessorId === item.id) {
        issues.push({
          code: 'self-dependency',
          itemId: item.id,
          message: `A tarefa "${item.label}" depende dela mesma.`,
          severity: 'error',
        });
        continue;
      }
      if (!idSet.has(predecessorId)) {
        issues.push({
          code: 'missing-predecessor',
          itemId: item.id,
          relatedItemId: predecessorId,
          message: `A tarefa "${item.label}" depende de um item inexistente.`,
          severity: 'error',
        });
        continue;
      }
      const key = edgeKey(predecessorId, item.id);
      if (seen.has(key)) {
        issues.push({
          code: 'duplicate-dependency',
          itemId: item.id,
          relatedItemId: predecessorId,
          message: `Dependência duplicada foi ignorada.`,
          severity: 'warning',
        });
        continue;
      }
      seen.add(key);
      edges.push({ predecessorId, successorId: item.id, type: 'finish-to-start' });
    }
  }

  const cycleKeys = detectCycleEdges(edges);
  const validEdges = cycleKeys.size === 0 ? edges : edges.filter((e) => !cycleKeys.has(edgeKey(e.predecessorId, e.successorId)));
  if (cycleKeys.size > 0) {
    issues.push({
      code: 'dependency-cycle',
      message: 'Foi detectado um ciclo de dependências; as arestas do ciclo foram ignoradas.',
      severity: 'error',
    });
  }

  const reverse = new Map<string, string[]>();
  for (const edge of validEdges) {
    const list = reverse.get(edge.successorId) ?? [];
    list.push(edge.predecessorId);
    reverse.set(edge.successorId, list);
  }

  return { edges: validEdges, reverse, issues };
}

/**
 * DFS over the forward adjacency (predecessor -> successor). Returns the keys
 * of every edge that participates in a cycle (back edges plus the forward path
 * that closes them).
 */
function detectCycleEdges(edges: readonly DependencyEdge[]): Set<string> {
  const forward = new Map<string, string[]>();
  for (const edge of edges) {
    const list = forward.get(edge.predecessorId) ?? [];
    list.push(edge.successorId);
    forward.set(edge.predecessorId, list);
  }

  const state = new Map<string, 0 | 1 | 2>(); // 0 unvisited, 1 in-progress, 2 done
  const path: string[] = [];
  const cycleKeys = new Set<string>();

  const visit = (node: string): void => {
    state.set(node, 1);
    path.push(node);
    for (const next of forward.get(node) ?? []) {
      const nextState = state.get(next) ?? 0;
      if (nextState === 1) {
        const start = path.indexOf(next);
        for (let i = start; i < path.length - 1; i++) {
          cycleKeys.add(edgeKey(path[i], path[i + 1]));
        }
        cycleKeys.add(edgeKey(node, next));
      } else if (nextState === 0) {
        visit(next);
      }
    }
    path.pop();
    state.set(node, 2);
  };

  for (const edge of edges) {
    if ((state.get(edge.predecessorId) ?? 0) === 0) {
      visit(edge.predecessorId);
    }
  }
  return cycleKeys;
}

export interface PredecessorInfo {
  /** Immediate predecessors (distance 1). */
  readonly direct: readonly string[];
  /** Transitive predecessors at distance >= 2 (indirect ancestors). */
  readonly ancestors: readonly string[];
}

/** Safe predecessor traversal using the reverse adjacency map. */
export function collectPredecessors(graph: DependencyGraph, itemId: string): PredecessorInfo {
  const direct = graph.reverse.get(itemId) ?? [];
  const visited = new Set<string>(direct);
  const queue = [...direct];
  const all = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift() as string;
    all.add(current);
    for (const predecessor of graph.reverse.get(current) ?? []) {
      if (!visited.has(predecessor)) {
        visited.add(predecessor);
        queue.push(predecessor);
      }
    }
  }

  const ancestors = [...all].filter((id) => !direct.includes(id));
  return { direct, ancestors };
}
