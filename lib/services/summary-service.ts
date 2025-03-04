import { DocumentRepository } from '@/lib/repositories/interfaces';
import { AgentSummary } from '@/lib/agents/interfaces';
import { repositories } from '@/lib/repositories/repositories';
import { agents } from '@/lib/agents/agents';
import {
  embeddingService,
  EmbeddingService,
} from '@/lib/services/embedding-service';
import { SummaryDto } from '@/lib/dto/summary.dto';

export class SummaryService {
  private readonly documentRepository: DocumentRepository;
  private readonly agentSummary: AgentSummary;
  private readonly embeddingService: EmbeddingService;

  constructor(
    documentRepository: DocumentRepository,
    agentSummary: AgentSummary,
    embeddingService: EmbeddingService,
  ) {
    this.documentRepository = documentRepository;
    this.agentSummary = agentSummary;
    this.embeddingService = embeddingService;
  }

  async getSummary(
    contentId: string,
    order: number,
  ): Promise<SummaryDto | null> {
    const part = await this.documentRepository.getPartByDocument(
      contentId,
      order,
    );

    if (!part) {
      return null;
    }

    let [summaryText, sections] = await Promise.all([
      this.documentRepository.getPartSummary(part.id),
      this.documentRepository.getSectionsByPart(part.id),
    ]);

    this.embeddingService.createEmbeddings(sections).catch((e) => {
      console.error(e);
    });

    if (!summaryText) {
      const title = part.name;
      const text = sections.map((section) => section.text).join('\n');

      const content = await this.documentRepository.getDocument(contentId);
      const language = content.language;

      summaryText = await this.agentSummary.generateSummary(
        title,
        text,
        language,
      );

      this.documentRepository
        .setPartSummary(part.id, summaryText)
        .catch((e) => {
          console.error(e);
        });
    }

    const summary = this.getSummaryFromText(
      summaryText,
      part.id,
      part.documentId,
      part.order,
    );

    return summary;
  }

  /**
   * Divide the text into extended summaries. To make the division uses second level markdown headers (##).
   * The division is done by the order of the headers.
   *
   * @param text The text to divide
   * @param partId The id of the part
   * @returns The extended summaries
   */
  getSummaryFromText(
    text: string,
    partId: string,
    contentId: string,
    order: number,
  ): SummaryDto {
    const lines = text.split('\n');

    const startIndex = lines.findIndex((line) => line.startsWith('## '));
    const title = lines[0].replace(/^#\s/, '').trim();

    const markdownWithoutTitle = lines.slice(startIndex).join('\n');

    return {
      title: title,
      partId: partId,
      markdown: markdownWithoutTitle,
      contentId: contentId,
      order: order,
    };
  }

  async updateSummary(
    contentId: string,
    order: number,
    markdown: string,
  ): Promise<boolean> {
    const lines = markdown.split('\n');

    if (lines.length === 0 || !lines[0].startsWith('# ')) {
      return false;
    }

    const title = lines[0].replace(/^#\s/, '').trim();

    if (!title) {
      return false;
    }

    const part = await this.documentRepository.getPartByDocument(
      contentId,
      order,
    );

    if (!part) {
      return false;
    }

    await Promise.all([
      this.documentRepository.updatePartName(part.id, title),
      this.documentRepository.setPartSummary(part.id, markdown),
    ]);

    return true;
  }
}

export const summaryService = new SummaryService(
  repositories.document,
  agents.summary,
  embeddingService,
);
