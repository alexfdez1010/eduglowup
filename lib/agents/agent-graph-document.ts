import { AgentGraphDocument } from '@/lib/agents/interfaces';
import { PartDto } from '@/lib/dto/part.dto';
import { Edge, Graph } from '@/lib/graph';
import { LLM } from '@/lib/LLM/interface';

export class AgentGraphDocumentImpl implements AgentGraphDocument {
  private llm: LLM;

  constructor(llm: LLM) {
    this.llm = llm;
  }

  async createGraphOfParts(parts: PartDto[]): Promise<Graph<PartDto>> {
    return this.defaultGraph(parts);
  }

  private parseTextToGraph(text: string, parts: PartDto[]): Graph<PartDto> {
    const edgesText = text.split('\n');

    if (edgesText.length === 0) {
      return null;
    }

    try {
      const edgesNumber: Edge<number>[] = edgesText.map((edge) => {
        const [from, to] = edge.split('->');
        return {
          from: parseInt(from.trim()),
          to: parseInt(to.trim()),
        };
      });

      if (edgesNumber.length === 0) {
        return null;
      }

      if (!edgesNumber.every((edge) => edge.from !== edge.to)) {
        return null;
      }

      const edges = edgesNumber.map((edge) => {
        return {
          from: parts[edge.from],
          to: parts[edge.to],
        };
      });

      const graph = new Graph(parts, edges);

      if (!graph.canBeTopologicalSorted()) {
        return null;
      }

      return graph;
    } catch (error) {
      return this.defaultGraph(parts);
    }
  }

  /**
   * The default graph consists in a list of all the parts
   * in the same order as they appear in the document.
   * @param parts The parts of the document
   * @returns The default graph
   */
  private defaultGraph(parts: PartDto[]): Graph<PartDto> {
    const edges: Edge<PartDto>[] = parts.slice(0, -1).map((part, index) => {
      return {
        from: part,
        to: parts[index + 1],
      };
    });

    return new Graph(parts, edges);
  }
}
