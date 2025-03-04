import { DocumentRepository } from '@/lib/repositories/interfaces';
import { PrismaClient } from '@prisma/client';
import { SectionDto } from '@/lib/dto/section.dto';
import {
  DocumentCompleteDto,
  DocumentDto,
  DocumentWithOwnerDto,
} from '@/lib/dto/document.dto';
import { PartDto } from '@/lib/dto/part.dto';
import { Graph } from '@/lib/graph';
import { dtoToPrisma, prismaToDto } from './utils';

export class DocumentRepositoryPrisma implements DocumentRepository {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async updatePartName(partId: string, name: string): Promise<void> {
    await this.client.part.update({
      where: {
        id: partId,
      },
      data: {
        name: name,
      },
    });
  }

  async getContentsOfCourse(courseId: string): Promise<DocumentDto[]> {
    const contents = await this.client.document.findMany({
      where: {
        courses: {
          some: {
            id: courseId,
          },
        },
      },
    });

    return contents.map((content) => {
      return {
        id: content.id,
        filename: content.filename,
        language: content.language,
        isPublic: content.isPublic,
        url: content.url ?? undefined,
        type: prismaToDto(content.type),
      };
    });
  }

  async getContentsOfUser(userId: string): Promise<DocumentDto[]> {
    const contents = await this.client.document.findMany({
      where: {
        ownerId: userId,
      },
    });

    return contents.map((content) => {
      return {
        id: content.id,
        filename: content.filename,
        language: content.language,
        isPublic: content.isPublic,
        url: content.url ?? undefined,
        type: prismaToDto(content.type),
      };
    });
  }

  async addContentToCourse(contentId: string, courseId: string): Promise<void> {
    await this.client.course.update({
      where: {
        id: courseId,
      },
      data: {
        contents: {
          connect: {
            id: contentId,
          },
        },
      },
    });
  }

  async getDocument(documentId: string): Promise<DocumentDto> {
    const document = await this.client.document.findFirst({
      where: {
        id: documentId,
      },
    });

    return {
      id: document.id,
      filename: document.filename,
      language: document.language,
      isPublic: document.isPublic,
      url: document.url ?? undefined,
      type: prismaToDto(document.type),
    };
  }

  async getDocuments(documentIds: string[]): Promise<DocumentDto[]> {
    if (documentIds.length === 1) {
      const document = await this.client.document.findFirst({
        where: {
          id: documentIds[0],
        },
      });

      return [
        {
          id: document.id,
          filename: document.filename,
          language: document.language,
          isPublic: document.isPublic,
          url: document.url ?? undefined,
          type: prismaToDto(document.type),
        },
      ];
    }

    const documents = await this.client.document.findMany({
      where: {
        id: {
          in: documentIds,
        },
      },
    });

    return documents.map((document) => {
      return {
        id: document.id,
        filename: document.filename,
        language: document.language,
        isPublic: document.isPublic,
        url: document.url ?? undefined,
        type: prismaToDto(document.type),
      };
    });
  }

  async getSections(sectionIds: string[]): Promise<SectionDto[]> {
    const sections = await this.client.section.findMany({
      where: {
        id: {
          in: sectionIds,
        },
      },
    });

    return sections.map((section) => {
      return {
        id: section.id,
        text: section.text,
        partId: section.partId,
        documentId: section.documentId,
      };
    });
  }

  async createSections(sections: SectionDto[]): Promise<void> {
    const sectionsToCreate = sections.map((section) => {
      return {
        id: section.id,
        text: section.text,
        partId: section.partId,
        documentId: section.documentId,
      };
    });

    await this.client.section.createMany({
      data: sectionsToCreate,
    });
  }

  async deleteDocument(documentId: string): Promise<void> {
    await this.client.document.delete({
      where: {
        id: documentId,
      },
    });
  }

  async deleteParts(partIds: string[]): Promise<void> {
    await this.client.part.deleteMany({
      where: {
        id: {
          in: partIds,
        },
      },
    });
  }

  async createDocument(document: DocumentWithOwnerDto): Promise<void> {
    await this.client.document
      .create({
        data: {
          id: document.id,
          filename: document.filename,
          language: document.language,
          ownerId: document.ownerId,
          isPublic: document.isPublic,
          type: dtoToPrisma(document.type),
          url: document.url,
        },
        select: {
          id: true,
        },
      })
      .catch((e) => {
        console.error(e);
      });
  }

  async getPartsByDocument(documentId: string): Promise<PartDto[]> {
    const parts = await this.client.part.findMany({
      where: {
        documentId: documentId,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return parts.map((part) => {
      return {
        id: part.id,
        order: part.order,
        name: part.name,
        documentId: part.documentId,
      };
    });
  }

  async getPartByDocument(documentId: string, order: number): Promise<PartDto> {
    const part = await this.client.part.findFirst({
      where: {
        documentId: documentId,
        order: order,
      },
    });

    if (!part) {
      return null;
    }

    return {
      id: part.id,
      order: part.order,
      name: part.name,
      documentId: part.documentId,
    };
  }

  async getNumberOfParts(documentId: string): Promise<number> {
    return this.client.part.count({
      where: {
        documentId: documentId,
      },
    });
  }

  async getSectionsByPart(partId: string): Promise<SectionDto[]> {
    const sections = await this.client.section.findMany({
      where: {
        partId: partId,
      },
    });

    return sections.map((section) => {
      return {
        id: section.id,
        text: section.text,
        partId: section.partId,
      };
    });
  }

  async createGraphOfParts(
    documentId: string,
    graph: Graph<PartDto>,
  ): Promise<void> {
    const edges = graph.getEdges();

    await this.client.edgesPart.createMany({
      data: edges.map((edge) => ({
        documentId: documentId,
        partIdFrom: edge.from.id,
        partIdTo: edge.to.id,
      })),
    });
  }

  async getGraphOfParts(documentId: string): Promise<Graph<PartDto> | null> {
    const [edges, nodes] = await Promise.all([
      this.client.edgesPart.findMany({
        where: {
          documentId: documentId,
        },
      }),
      this.getPartsByDocument(documentId),
    ]);

    if (edges.length === 0) {
      return null;
    }

    return new Graph(
      nodes,
      edges.map((edge) => ({
        from: nodes.find((node) => node.id === edge.partIdFrom),
        to: nodes.find((node) => node.id === edge.partIdTo),
      })),
    );
  }

  async getSectionsByDocument(documentId: string): Promise<SectionDto[]> {
    const sections = await this.client.section.findMany({
      where: {
        documentId: documentId,
      },
    });

    return sections.map((section) => {
      return {
        id: section.id,
        text: section.text,
        partId: section.partId,
      };
    });
  }

  async getPartSummary(partId: string): Promise<string | null> {
    const summary = await this.client.part.findFirst({
      where: {
        id: partId,
      },
      select: {
        summary: true,
      },
    });

    if (!summary) {
      return null;
    }

    return summary.summary;
  }

  async setPartSummary(partId: string, summary: string): Promise<void> {
    await this.client.part.update({
      where: {
        id: partId,
      },
      data: {
        summary: summary,
      },
    });
  }

  async createParts(documentId: string, parts: PartDto[]): Promise<void> {
    const partsToCreate = parts.map((part) => {
      return {
        id: part.id,
        order: part.order,
        name: part.name,
        documentId: documentId,
      };
    });

    await this.client.part.createMany({
      data: partsToCreate,
    });
  }

  async getPartById(partId: string): Promise<PartDto | null> {
    const part = await this.client.part.findFirst({
      where: {
        id: partId,
      },
    });

    if (!part) {
      return null;
    }

    return {
      id: part.id,
      name: part.name,
      order: part.order,
      documentId: part.documentId,
    };
  }

  async getDocumentsOwnedByUser(
    userId: string,
  ): Promise<DocumentCompleteDto[]> {
    const documents = await this.client.document.findMany({
      where: {
        ownerId: userId,
      },
    });

    return documents.map((document) => {
      return {
        id: document.id,
        filename: document.filename,
        language: document.language,
        isOwner: true,
        isPublic: document.isPublic,
        url: document.url ?? undefined,
        type: prismaToDto(document.type),
      };
    });
  }

  async hasAccessToContent(
    userId: string,
    contentId: string,
  ): Promise<boolean> {
    const content = await this.client.document.findFirst({
      where: {
        id: contentId,
        ownerId: userId,
      },
    });

    if (content) {
      return true;
    }

    const courses = await this.client.course.findMany({
      where: {
        contents: {
          some: {
            id: contentId,
          },
        },
      },
    });

    const hasAccessToCourses = await this.client.course.findMany({
      where: {
        usersWithAccess: {
          some: {
            id: userId,
          },
        },
      },
    });

    const result = courses.some((course) =>
      hasAccessToCourses.some((course2) => course2.id === course.id),
    );

    return result;
  }

  async isOwnerOfContent(userId: string, contentId: string): Promise<boolean> {
    const content = await this.client.document.findFirst({
      where: {
        id: contentId,
        ownerId: userId,
      },
    });

    return !!content;
  }

  async getDocumentOfSection(sectionId: string): Promise<DocumentDto | null> {
    const document = await this.client.document.findFirst({
      where: {
        sections: {
          some: {
            id: sectionId,
          },
        },
      },
    });

    if (!document) {
      return null;
    }

    return {
      id: document.id,
      filename: document.filename,
      language: document.language,
      isPublic: document.isPublic,
      url: document.url ?? undefined,
      type: prismaToDto(document.type),
    };
  }

  async getDocumentOfPart(
    partId: string,
  ): Promise<DocumentWithOwnerDto | null> {
    const document = await this.client.document.findFirst({
      where: {
        parts: {
          some: {
            id: partId,
          },
        },
      },
    });

    if (!document) {
      return null;
    }

    return {
      id: document.id,
      filename: document.filename,
      language: document.language,
      isPublic: document.isPublic,
      url: document.url ?? undefined,
      type: prismaToDto(document.type),
      ownerId: document.ownerId,
    };
  }

  async getSectionById(sectionId: string): Promise<SectionDto | null> {
    const section = await this.client.section.findFirst({
      where: {
        id: sectionId,
      },
    });

    if (!section) {
      return null;
    }

    return {
      id: section.id,
      text: section.text,
      partId: section.partId,
      documentId: section.documentId,
    };
  }

  async updateNameDocument(documentId: string, name: string): Promise<void> {
    await this.client.document.update({
      where: {
        id: documentId,
      },
      data: {
        filename: name,
      },
    });
  }
}
