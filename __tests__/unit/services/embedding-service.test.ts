import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EmbeddingService } from '@/lib/services/embedding-service';
import { EmbeddingRepository } from '@/lib/repositories/interfaces';
import { EmbeddingModel } from '@/lib/embeddings/interface';
import { SectionDto } from '@/lib/dto/section.dto';
import { fakeUuid } from '../fake';

describe('EmbeddingService', () => {
  let embeddingService: EmbeddingService;
  let embeddingRepositoryMock: EmbeddingRepository;
  let embeddingModelMock: EmbeddingModel;

  beforeEach(() => {
    embeddingRepositoryMock = {
      getEmbeddingOfSection: vi.fn(),
      saveEmbeddingOfSection: vi.fn(),
      getTopSections: vi.fn(),
    } as unknown as EmbeddingRepository;

    embeddingModelMock = {
      getEmbedding: vi.fn(),
    } as unknown as EmbeddingModel;

    embeddingService = new EmbeddingService(
      embeddingRepositoryMock,
      embeddingModelMock,
    );
  });

  describe('createEmbeddings', () => {
    it('should create embeddings for new sections', async () => {
      const sections: SectionDto[] = [
        { id: fakeUuid(), text: 'Section 1' },
        { id: fakeUuid(), text: 'Section 2' },
      ];

      vi.spyOn(
        embeddingRepositoryMock,
        'getEmbeddingOfSection',
      ).mockResolvedValue(null);
      vi.spyOn(embeddingModelMock, 'getEmbedding').mockResolvedValue([
        0.1, 0.2, 0.3,
      ]);

      await embeddingService.createEmbeddings(sections);

      expect(
        embeddingRepositoryMock.getEmbeddingOfSection,
      ).toHaveBeenCalledTimes(2);
      expect(embeddingModelMock.getEmbedding).toHaveBeenCalledTimes(2);
      expect(
        embeddingRepositoryMock.saveEmbeddingOfSection,
      ).toHaveBeenCalledTimes(2);
    });

    it('should not create embeddings for existing sections', async () => {
      const sections: SectionDto[] = [{ id: fakeUuid(), text: 'Section 1' }];

      vi.spyOn(
        embeddingRepositoryMock,
        'getEmbeddingOfSection',
      ).mockResolvedValue([0.1, 0.2, 0.3]);

      await embeddingService.createEmbeddings(sections);

      expect(
        embeddingRepositoryMock.getEmbeddingOfSection,
      ).toHaveBeenCalledTimes(1);
      expect(embeddingModelMock.getEmbedding).not.toHaveBeenCalled();
      expect(
        embeddingRepositoryMock.saveEmbeddingOfSection,
      ).not.toHaveBeenCalled();
    });
  });

  describe('getTopSections', () => {
    it('should return top sections based on similarity', async () => {
      const text = 'Query text';
      const documentId = fakeUuid();
      const n = 3;

      const mockEmbedding = [0.1, 0.2, 0.3];
      const mockTopSections = [
        { text: 'Top section 1' },
        { text: 'Top section 2' },
        { text: 'Top section 3' },
      ];

      vi.spyOn(embeddingModelMock, 'getEmbedding').mockResolvedValue(
        mockEmbedding,
      );
      vi.spyOn(embeddingRepositoryMock, 'getTopSections').mockResolvedValue(
        mockTopSections,
      );

      const result = await embeddingService.getTopSections(text, documentId, n);

      expect(embeddingModelMock.getEmbedding).toHaveBeenCalledWith(text);
      expect(embeddingRepositoryMock.getTopSections).toHaveBeenCalledWith(
        documentId,
        mockEmbedding,
        n,
      );
      expect(result).toEqual([
        'Top section 1',
        'Top section 2',
        'Top section 3',
      ]);
    });
  });
});
