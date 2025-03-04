import { EmbeddingRepository } from '@/lib/repositories/interfaces';
import { EmbeddingModel } from '@/lib/embeddings/interface';
import { SectionDto } from '@/lib/dto/section.dto';
import { embeddingModel } from '@/lib/embeddings/model';
import { repositories } from '@/lib/repositories/repositories';

export class EmbeddingService {
  private readonly embeddingRepository: EmbeddingRepository;
  private readonly embeddingModel: EmbeddingModel;

  constructor(
    embeddingRepository: EmbeddingRepository,
    embeddingModel: EmbeddingModel,
  ) {
    this.embeddingRepository = embeddingRepository;
    this.embeddingModel = embeddingModel;
  }

  /**
   * For each section check if embeddings exist,
   * if not creates it and stores it
   * @param sections The sections to process
   */
  async createEmbeddings(sections: SectionDto[]) {
    // Remove any repeated section
    sections = sections.filter(
      (section, index) =>
        sections.findIndex((s) => s.id === section.id) === index,
    );

    await Promise.all(
      sections.map((section) => this.createEmbedding(section.id, section.text)),
    );
  }

  private async createEmbedding(sectionId: string, text: string) {
    const embedding =
      await this.embeddingRepository.getEmbeddingOfSection(sectionId);

    if (embedding) {
      return;
    }

    const newEmbedding = await this.embeddingModel.getEmbedding(text);

    await this.embeddingRepository.saveEmbeddingOfSection(
      sectionId,
      newEmbedding,
    );
  }

  /**
   * Get the text of the top n sections based
   * on the similarity of the embeddings for
   * a particular set of document
   *
   * @param text The text to compare
   * @param documentId The id of the document to compare
   * @param n The number of sections to return
   */
  async getTopSections(
    text: string,
    documentId: string,
    n: number,
  ): Promise<string[]> {
    const embedding = await this.embeddingModel.getEmbedding(text);

    const sections = await this.embeddingRepository.getTopSections(
      documentId,
      embedding,
      n,
    );

    return sections.map((section) => section.text);
  }
}

export const embeddingService = new EmbeddingService(
  repositories.embedding,
  embeddingModel,
);
