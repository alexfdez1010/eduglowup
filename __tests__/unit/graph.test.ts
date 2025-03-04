import { beforeEach, describe, expect, test } from 'vitest';
import { Edge, Graph } from '@/lib/graph';

describe('Graph', () => {
  let graph: Graph<string>;

  beforeEach(() => {
    const nodes = ['A', 'B', 'C', 'D', 'E', 'F'];
    const edges: Edge<string>[] = [
      { from: 'A', to: 'C' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'E' },
      { from: 'E', to: 'F' },
      { from: 'D', to: 'E' },
    ];
    graph = new Graph(nodes, edges);
  });

  test('should initialize graph correctly', () => {
    expect(graph).toBeDefined();
    expect(graph['nodes']).toHaveLength(6);
    expect(graph['adjacencyList']).toHaveLength(6);
  });

  test('should find the correct index for nodes', () => {
    expect(graph['findNodeIndex']('A')).toBe(0);
    expect(graph['findNodeIndex']('C')).toBe(2);
    expect(() => graph['findNodeIndex']('Z')).toThrow('Node not found');
  });

  test('should topologically sort the nodes correctly', () => {
    const sortedNodes = graph.topologicalSort();
    expect(sortedNodes).toEqual(['A', 'B', 'D', 'C', 'E', 'F']);
  });

  test('should determine if the graph can be topologically sorted', () => {
    expect(graph.canBeTopologicalSorted()).toBe(true);

    const cyclicNodes = ['A', 'B', 'C'];
    const cyclicEdges: Edge<string>[] = [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'C' },
      { from: 'C', to: 'A' },
    ];
    const cyclicGraph = new Graph(cyclicNodes, cyclicEdges);
    expect(cyclicGraph.canBeTopologicalSorted()).toBe(false);
  });

  test('should handle empty graph', () => {
    const emptyGraph = new Graph([], []);
    expect(emptyGraph.topologicalSort()).toEqual([]);
    expect(emptyGraph.canBeTopologicalSorted()).toBe(true);
  });

  test('should handle single node graph', () => {
    const singleNodeGraph = new Graph(['A'], []);
    expect(singleNodeGraph.topologicalSort()).toEqual(['A']);
    expect(singleNodeGraph.canBeTopologicalSorted()).toBe(true);
  });
});
