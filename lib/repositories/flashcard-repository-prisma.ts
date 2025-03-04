import { PrismaClient } from '@prisma/client';
import { ExerciseRepository } from '@/lib/repositories/interfaces';
import { FlashcardDto } from '@/lib/dto/flashcard.dto';

export class FlashcardRepositoryPrisma
  implements ExerciseRepository<FlashcardDto>
{
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async storeQuestions(flashcards: FlashcardDto[]): Promise<void> {
    const flashcardsToStore = flashcards.map((fl) => ({
      id: fl.id,
      partId: fl.partId,
      front: fl.front,
      back: fl.back,
    }));

    await this.prisma.flashcard.createMany({
      data: flashcardsToStore,
    });
  }

  async getQuestionsOfPart(partId: string): Promise<FlashcardDto[]> {
    const flashcards = await this.prisma.flashcard.findMany({
      where: {
        partId: partId,
      },
    });

    return flashcards.map((fl) => ({
      id: fl.id,
      partId: fl.partId,
      front: fl.front,
      back: fl.back,
      answer: 'no-answered',
    }));
  }

  async getQuestion(questionId: string): Promise<FlashcardDto | null> {
    const flashcard = await this.prisma.flashcard.findUnique({
      where: {
        id: questionId,
      },
    });

    if (!flashcard) {
      return null;
    }

    return {
      id: flashcard.id,
      partId: flashcard.partId,
      front: flashcard.front,
      back: flashcard.back,
      answer: 'no-answered',
    };
  }

  async getQuestions(questionIds: string[]): Promise<FlashcardDto[]> {
    const flashcards = await this.prisma.flashcard.findMany({
      where: {
        id: {
          in: questionIds,
        },
      },
    });

    return flashcards.map((fl) => ({
      id: fl.id,
      partId: fl.partId,
      front: fl.front,
      back: fl.back,
      answer: 'no-answered',
    }));
  }

  async feedbackQuestion(
    questionId: string,
    isPositive: boolean,
  ): Promise<void> {
    const feedbackField = isPositive ? 'positiveFeedback' : 'negativeFeedback';

    await this.prisma.flashcard.update({
      where: {
        id: questionId,
      },
      data: {
        [feedbackField]: {
          increment: 1,
        },
      },
    });
  }

  async createExplanation(
    flashcardId: string,
    explanation: string,
  ): Promise<void> {
    await this.prisma.flashcardExplanation.create({
      data: {
        flashcardId: flashcardId,
        explanation: explanation,
      },
    });
  }

  async getExplanation(flashcardId: string): Promise<string | null> {
    const explanation = await this.prisma.flashcardExplanation.findUnique({
      where: {
        flashcardId: flashcardId,
      },
    });

    if (!explanation) {
      return null;
    }

    return explanation.explanation;
  }
}
