import {
  ChatRepository,
  DocumentRepository,
  StudySessionRepository,
} from '@/lib/repositories/interfaces';
import {
  embeddingService,
  EmbeddingService,
} from '@/lib/services/embedding-service';
import {
  economicService,
  EconomicService,
} from '@/lib/services/economic-service';
import { authProvider, AuthProvider } from '@/lib/providers/auth-provider';
import { repositories } from '@/lib/repositories/repositories';
import { MessageDto, MessageType } from '@/lib/dto/message.dto';
import { agents } from '@/lib/agents/agents';
import { AgentAsk, AgentTypicalQuestions } from '@/lib/agents/interfaces';
import { randomElements } from '@/lib/random';
import { retryUntilCondition } from '@/lib/async';

export class ChatService {
  private readonly documentRepository: DocumentRepository;
  private readonly studySessionRepository: StudySessionRepository;
  private readonly chatRepository: ChatRepository;
  private readonly embeddingService: EmbeddingService;
  private readonly economicService: EconomicService;
  private readonly authProvider: AuthProvider;
  private readonly askAgent: AgentAsk;
  private readonly typicalQuestionsAgent: AgentTypicalQuestions;

  public static readonly NUMBER_OF_LAST_MESSAGES = 3;
  public static readonly NUMBER_OF_SECTIONS = 3;
  public static readonly NUMBER_OF_TYPICAL_QUESTIONS = 3;

  constructor(
    documentRepository: DocumentRepository,
    studySessionRepository: StudySessionRepository,
    chatRepository: ChatRepository,
    embeddingService: EmbeddingService,
    economicService: EconomicService,
    authProvider: AuthProvider,
    askAgent: AgentAsk,
    typicalQuestionsAgent: AgentTypicalQuestions,
  ) {
    this.documentRepository = documentRepository;
    this.studySessionRepository = studySessionRepository;
    this.chatRepository = chatRepository;
    this.embeddingService = embeddingService;
    this.economicService = economicService;
    this.authProvider = authProvider;
    this.askAgent = askAgent;
    this.typicalQuestionsAgent = typicalQuestionsAgent;
  }

  async getMessagesOfPart(partId: string): Promise<MessageDto[]> {
    const userId = await this.authProvider.getUserId();

    if (!userId) {
      throw new Error('User not logged in');
    }

    const messages = await this.chatRepository.getMessagesOfPart(
      userId,
      partId,
      ChatService.NUMBER_OF_LAST_MESSAGES,
    );

    return messages.reverse();
  }

  async getMessagesOfSession(sessionId: string): Promise<MessageDto[]> {
    const messages = await this.chatRepository.getMessagesOfSession(sessionId);

    return messages.reverse();
  }

  async askInPart(partId: string, text: string): Promise<MessageDto | null> {
    const userId = await this.authProvider.getUserId();

    const previousMessages = await this.chatRepository.getMessagesOfPart(
      userId,
      partId,
      ChatService.NUMBER_OF_LAST_MESSAGES,
    );

    const userMessage = {
      type: MessageType.USER,
      message: text,
      order: (previousMessages[0]?.order || 0) + 1,
    };

    this.chatRepository
      .addMessageToPart(userId, partId, userMessage)
      .catch(console.error);

    const documentId = await this.documentRepository
      .getPartById(partId)
      .then((part) => part.documentId);

    const newMessage = await this.ask(documentId, previousMessages, text);

    const aiMessage = {
      type: MessageType.AI,
      message: newMessage,
      order: userMessage.order + 1,
    };

    this.chatRepository
      .addMessageToPart(userId, partId, aiMessage)
      .catch(console.error);

    return aiMessage;
  }

  async askInSession(sessionId: string, text: string): Promise<MessageDto> {
    const previousMessages =
      await this.chatRepository.getMessagesOfSession(sessionId);

    const userId = await this.authProvider.getUserId();

    const userMessage = {
      type: MessageType.USER,
      message: text,
      order: (previousMessages[0]?.order || 0) + 1,
    };

    this.chatRepository
      .addMessageToSession(sessionId, userMessage)
      .catch(console.error);

    const documentId = await this.studySessionRepository
      .getSession(sessionId)
      .then((session) => session.documentId);

    const newMessage = await this.ask(documentId, previousMessages, text);

    const aiMessage = {
      type: MessageType.AI,
      message: newMessage,
      order: userMessage.order + 1,
    };

    this.chatRepository
      .addMessageToSession(sessionId, aiMessage)
      .catch(console.error);

    return aiMessage;
  }

  async getTypicalQuestions(partId: string): Promise<string[]> {
    const typicalQuestions =
      await this.chatRepository.getTypicalQuestions(partId);

    if (typicalQuestions.length > 0) {
      return randomElements(
        typicalQuestions,
        ChatService.NUMBER_OF_TYPICAL_QUESTIONS,
      );
    }

    const [partSummary, language] = await Promise.all([
      retryUntilCondition(
        () => this.documentRepository.getPartSummary(partId),
        (summary) => !!summary,
        1000,
      ),
      this.documentRepository
        .getDocumentOfPart(partId)
        .then((doc) => doc.language),
    ]);

    const newTypicalQuestions =
      await this.typicalQuestionsAgent.generateTypicalQuestions(
        partSummary,
        language,
      );

    this.chatRepository
      .setTypicalQuestions(partId, newTypicalQuestions)
      .catch(console.error);

    return randomElements(
      newTypicalQuestions,
      ChatService.NUMBER_OF_TYPICAL_QUESTIONS,
    );
  }

  private async ask(
    documentId: string,
    previousMessages: MessageDto[],
    text: string,
  ): Promise<string> {
    const [sectionsRelated, document] = await Promise.all([
      this.embeddingService.getTopSections(
        text,
        documentId,
        ChatService.NUMBER_OF_SECTIONS,
      ),
      this.documentRepository.getDocument(documentId),
    ]);

    return this.askAgent.ask(
      previousMessages,
      text,
      sectionsRelated,
      document.language,
    );
  }
}

export const chatService = new ChatService(
  repositories.document,
  repositories.studySession,
  repositories.chat,
  embeddingService,
  economicService,
  authProvider,
  agents.ask,
  agents.typicalQuestions,
);
