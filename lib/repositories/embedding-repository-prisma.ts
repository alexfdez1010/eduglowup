import { Prisma, PrismaClient } from '@prisma/client';
import { EmbeddingRepository } from '@/lib/repositories/interfaces';
import { SectionDto } from '@/lib/dto/section.dto';

export class EmbeddedRepositoryPrisma implements EmbeddingRepository {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async getEmbeddingOfSection(sectionId: string): Promise<number[]> {
    return (
      await this.client
        .$queryRaw`SELECT embedding::text FROM "Section" WHERE id=${sectionId}::uuid`
    )[0]['embedding'];
  }

  async saveEmbeddingOfSection(
    sectionId: string,
    embedding: number[],
  ): Promise<void> {
    await this.client.$queryRaw`
      UPDATE "Section"
      SET embedding = ${embedding}::vector
      WHERE id = ${sectionId}::uuid
    `;
  }

  async getTopSections(
    documentId: string,
    embedding: number[],
    n: number,
  ): Promise<SectionDto[]> {
    const sections: { text: string; distance: number }[] = await this.client
      .$queryRaw`
        SELECT text, embedding <=> ${embedding}::vector as distance
        FROM "Section"
        WHERE "documentId" = ${documentId}::uuid
        AND embedding IS NOT NULL
        ORDER BY distance
        LIMIT ${n}
      `;

    return sections.map((section: { text: string }) => {
      return {
        text: section.text,
      };
    });
  }
}
