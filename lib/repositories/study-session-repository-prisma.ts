import { StudySessionRepository } from '@/lib/repositories/interfaces';
import {
  StudySessionDto,
  StudySessionWithDocumentsNameDto,
} from '@/lib/dto/study-session.dto';
import { BlockType, Prisma, PrismaClient } from '@prisma/client';
import { DocumentDto } from '@/lib/dto/document.dto';
import { BlockDto, BlockTypeDto, ContentType } from '@/lib/dto/block.dto';
import InputJsonValue = Prisma.InputJsonValue;
import { prismaToDto } from '@/lib/repositories/utils';

const blockTypeMapDtoToPrisma: Map<BlockTypeDto, BlockType> = new Map([
  [BlockTypeDto.QUIZ, BlockType.QUIZ],
  [BlockTypeDto.SHORT, BlockType.SHORT],
  [BlockTypeDto.TRUE_FALSE, BlockType.TRUE_FALSE],
  [BlockTypeDto.CONCEPT, BlockType.CONCEPT],
  [BlockTypeDto.FLASHCARDS, BlockType.FLASHCARDS],
]);

const blockTypeMapPrismaToDto: Map<BlockType, BlockTypeDto> = new Map(
  Array.from(blockTypeMapDtoToPrisma.entries()).map(([key, value]) => [
    value,
    key,
  ]),
);

const blockTypeFromDtoToPrisma = (blockType: BlockTypeDto): BlockType => {
  if (blockTypeMapDtoToPrisma.has(blockType)) {
    return blockTypeMapDtoToPrisma.get(blockType);
  } else {
    throw new Error('Invalid block type');
  }
};

const blockTypeFromPrismaToDto = (blockType: BlockType): BlockTypeDto => {
  if (blockTypeMapPrismaToDto.has(blockType)) {
    return blockTypeMapPrismaToDto.get(blockType);
  } else {
    throw new Error('Invalid block type');
  }
};

export class StudySessionRepositoryPrisma implements StudySessionRepository {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async createSession(session: StudySessionDto): Promise<void> {
    await this.client.studySession.create({
      data: {
        id: session.id,
        userId: session.userId,
        language: session.language,
        exercises: session.exercises,
        documentId: session.documentId,
      },
    });
  }

  async deleteSession(id: string): Promise<void> {
    await this.client.studySession.delete({
      where: {
        id: id,
      },
    });
  }

  async getSessionsOfUser(
    userId: string,
  ): Promise<StudySessionWithDocumentsNameDto[]> {
    const sessions = await this.client.studySession.findMany({
      where: {
        userId: userId,
      },
      include: {
        document: true,
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    return sessions.map((session) => {
      return {
        id: session.id,
        userId: session.userId,
        language: session.language,
        startTime: session.startTime,
        activeExercise: session.activeExercise,
        exercises: session.exercises,
        documentId: session.documentId,
        documentName: session.document?.filename || '',
      };
    });
  }

  async getDocumentOfSession(studySessionId: string): Promise<DocumentDto> {
    const studySession = await this.client.studySession.findFirst({
      where: {
        id: studySessionId,
      },
      include: {
        document: true,
      },
    });

    return {
      id: studySession.document.id,
      filename: studySession.document.filename,
      language: studySession.document.language,
      isPublic: studySession.document.isPublic,
      url: studySession.document.url ?? undefined,
      type: prismaToDto(studySession.document.type),
    };
  }

  async addBlock(studySessionId: string, block: BlockDto) {
    const { id } = await this.client.block.create({
      data: {
        type: blockTypeFromDtoToPrisma(block.type),
        order: block.order,
        content: block.content as unknown as InputJsonValue,
        sessionId: studySessionId,
      },
    });

    return id;
  }

  async getBlocks(studySessionId: string): Promise<BlockDto[]> {
    const blocks = await this.client.block.findMany({
      where: {
        sessionId: studySessionId,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return blocks.map((block) => {
      return {
        id: block.id,
        type: blockTypeFromPrismaToDto(block.type),
        order: block.order,
        content: block.content as unknown as ContentType,
      };
    });
  }

  async getSession(studySessionId: string): Promise<StudySessionDto> {
    const studySession = await this.client.studySession.findFirst({
      where: {
        id: studySessionId,
      },
    });

    return {
      id: studySession.id,
      language: studySession.language,
      startTime: studySession.startTime,
      activeExercise: studySession.activeExercise,
      exercises: studySession.exercises,
      userId: studySession.userId,
      documentId: studySession.documentId,
    };
  }

  async lastBlock(studySessionId: string): Promise<BlockDto> {
    const lastBlock = await this.client.block.findFirst({
      where: {
        sessionId: studySessionId,
      },
      orderBy: {
        order: 'desc',
      },
    });

    if (!lastBlock) {
      return null;
    }

    return {
      id: lastBlock.id,
      type: blockTypeFromPrismaToDto(lastBlock.type),
      order: lastBlock.order,
      content: lastBlock.content as unknown as ContentType,
    };
  }

  async lastExercise(studySessionId: string): Promise<BlockDto> {
    const lastExercise = await this.client.block.findFirst({
      where: {
        sessionId: studySessionId,
        type: {
          in: [
            BlockType.QUIZ,
            BlockType.SHORT,
            BlockType.TRUE_FALSE,
            BlockType.CONCEPT,
            BlockType.FLASHCARDS,
          ],
        },
      },
      orderBy: {
        order: 'desc',
      },
    });

    if (!lastExercise) {
      return null;
    }

    return {
      id: lastExercise.id,
      type: blockTypeFromPrismaToDto(lastExercise.type),
      order: lastExercise.order,
      content: lastExercise.content as unknown as ContentType,
    };
  }

  async setActiveExercise(
    studySessionId: string,
    activeExercise: boolean,
  ): Promise<void> {
    await this.client.studySession.update({
      where: {
        id: studySessionId,
      },
      data: {
        activeExercise: activeExercise,
      },
    });
  }

  async updateBlock(block: BlockDto): Promise<void> {
    await this.client.block.update({
      where: {
        id: block.id,
      },
      data: {
        order: block.order,
        content: block.content as unknown as InputJsonValue,
      },
    });
  }

  async getNextExercise(studySessionId: string): Promise<BlockDto | null> {
    const studySession = await this.client.studySession.findFirst({
      where: {
        id: studySessionId,
      },
    });

    if (!studySession?.nextExercise) {
      return null;
    }

    return studySession.nextExercise as unknown as BlockDto;
  }

  async setNextExercise(
    studySessionId: string,
    block: BlockDto | null,
  ): Promise<void> {
    await this.client.studySession.update({
      where: {
        id: studySessionId,
      },
      data: {
        nextExercise: block as unknown as InputJsonValue,
      },
    });
  }
}
