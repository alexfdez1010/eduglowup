export interface Edge<T> {
  from: T;
  to: T;
}

export class Graph<T> {
  private readonly nodes: T[];
  private readonly adjacencyList: number[][];

  constructor(nodes: T[], edges: Edge<T>[]) {
    this.nodes = nodes;
    this.adjacencyList = Array.from({ length: nodes.length }, () => []);

    for (let i = 0; i < edges.length; i++) {
      const from = this.findNodeIndex(edges[i].from);
      const to = this.findNodeIndex(edges[i].to);
      this.adjacencyList[from].push(to);
    }
  }

  private findNodeIndex(node: T): number {
    const index = this.nodes.indexOf(node);
    if (index === -1) {
      throw new Error('Node not found');
    }
    return index;
  }

  /**
   * Perform Kahn's Algorithm to find the topological sort
   *
   * @param conditionFn A function that returns true if we should pass from a node to the next
   * @returns The nodes ordered by a topological sort
   */
  public topologicalSort(conditionFn?: (src: T, dst: T) => boolean): T[] {
    const numNodes = this.nodes.length;
    const inDegree = new Array(numNodes).fill(0);

    const nodesOrdered = [];

    for (let i = 0; i < numNodes; i++) {
      for (const neighbor of this.adjacencyList[i]) {
        inDegree[neighbor]++;
      }
    }

    const queue = [];
    for (let i = 0; i < numNodes; i++) {
      if (inDegree[i] === 0) {
        queue.push(i);
      }
    }

    while (queue.length > 0) {
      const current = queue.shift();
      nodesOrdered.push(this.nodes[current]);

      for (const neighbor of this.adjacencyList[current]) {
        if (
          conditionFn &&
          !conditionFn(this.nodes[current], this.nodes[neighbor])
        ) {
          continue;
        }

        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) {
          queue.push(neighbor);
        }
      }
    }

    return nodesOrdered;
  }

  /**
   * Whether we can topologically sort the graph
   *
   * That means that the Kahn's algorithm returns the same number of nodes
   * as the number of nodes in the graph.
   *
   * @returns Whether we can topologically sort the graph
   */
  public canBeTopologicalSorted(): boolean {
    const numNodes = this.adjacencyList.length;

    return this.topologicalSort().length === numNodes;
  }

  /**
   * Get the nodes of the graph
   *
   * @returns The nodes of the graph
   *
   */
  public getNodes(): T[] {
    return this.nodes;
  }

  /**
   * Get the nodes of the graph
   *
   * @returns The nodes of the graph
   */
  public getEdges(): Edge<T>[] {
    let edges: Edge<T>[] = [];

    for (let i = 0; i < this.adjacencyList.length; i++) {
      for (const neighbor of this.adjacencyList[i]) {
        edges.push({
          from: this.nodes[i],
          to: this.nodes[neighbor],
        });
      }
    }

    return edges;
  }
}
