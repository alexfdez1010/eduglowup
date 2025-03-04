import { ChatRepository } from '@/lib/repositories/interfaces';
import { MessageType, MessageDto } from '@/lib/dto/message.dto';
import { PrismaClient, MessageType as MessageTypePrisma } from '@prisma/client';

const messageTypeMapDtoToPrisma: Map<MessageType, MessageTypePrisma> = new Map([
  [MessageType.USER, MessageTypePrisma.USER],
  [MessageType.AI, MessageTypePrisma.AI],
]);

const messageTypeMapPrismaToDto: Map<string, MessageType> = new Map(
  Array.from(messageTypeMapDtoToPrisma.entries()).map(([key, value]) => [
    value,
    key,
  ]),
);

const messageTypeFromDtoToPrisma = (
  messageType: MessageType,
): MessageTypePrisma => {
  if (messageTypeMapDtoToPrisma.has(messageType)) {
    return messageTypeMapDtoToPrisma.get(messageType);
  } else {
    throw new Error('Invalid message type');
  }
};

const messageTypeFromPrismaToDto = (
  messageType: MessageTypePrisma,
): MessageType => {
  if (messageTypeMapPrismaToDto.has(messageType)) {
    return messageTypeMapPrismaToDto.get(messageType);
  } else {
    throw new Error('Invalid message type');
  }
};

export class ChatRepositoryPrisma implements ChatRepository {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async getMessagesOfPart(
    userId: string,
    partId: string,
    limit?: number,
  ): Promise<MessageDto[]> {
    const messages = await this.client.messagePart.findMany({
      where: {
        partId: partId,
        userId: userId,
      },
      orderBy: {
        order: 'desc',
      },
      take: limit || 100,
    });

    return messages.map((message) => ({
      type: messageTypeFromPrismaToDto(message.type),
      order: message.order,
      message: message.text,
    }));
  }

  async getMessagesOfSession(
    sessionId: string,
    limit?: number,
  ): Promise<MessageDto[]> {
    const messages = await this.client.messageSession.findMany({
      where: {
        sessionId: sessionId,
      },
      orderBy: {
        order: 'desc',
      },
      take: limit || 100,
    });

    return messages.map((message) => ({
      type: messageTypeFromPrismaToDto(message.type),
      order: message.order,
      message: message.text,
    }));
  }

  async addMessageToPart(
    userId: string,
    partId: string,
    message: MessageDto,
  ): Promise<void> {
    await this.client.messagePart.create({
      data: {
        partId: partId,
        userId: userId,
        order: message.order,
        text: message.message,
        type: messageTypeFromDtoToPrisma(message.type),
      },
    });
  }

  async addMessageToSession(
    sessionId: string,
    message: MessageDto,
  ): Promise<void> {
    await this.client.messageSession.create({
      data: {
        sessionId: sessionId,
        order: message.order,
        text: message.message,
        type: messageTypeFromDtoToPrisma(message.type),
      },
    });
  }

  async getTypicalQuestions(partId: string): Promise<string[]> {
    const questions = await this.client.part.findUnique({
      where: {
        id: partId,
      },
      select: {
        typicalQuestions: true,
      },
    });

    return questions?.typicalQuestions?.split(',') || [];
  }

  async setTypicalQuestions(
    partId: string,
    questions: string[],
  ): Promise<void> {
    await this.client.part.update({
      where: {
        id: partId,
      },
      data: {
        typicalQuestions: questions.join(','),
      },
    });
  }
}
