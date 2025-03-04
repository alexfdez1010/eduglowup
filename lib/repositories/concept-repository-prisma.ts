import { PrismaClient } from '@prisma/client';
import { ExerciseRepository } from '@/lib/repositories/interfaces';
import { ConceptDto } from '@/lib/dto/concept.dto';

export class ConceptRepositoryPrisma implements ExerciseRepository<ConceptDto> {
  private readonly client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async storeQuestions(concepts: ConceptDto[]): Promise<void> {
    await this.client.concept.createMany({
      data: concepts.map((concept) => ({
        id: concept.id,
        partId: concept.partId,
        name: concept.concept,
        definition: concept.definition,
      })),
    });
  }

  async getQuestionsOfPart(partId: string): Promise<ConceptDto[]> {
    const concepts = await this.client.concept.findMany({
      where: {
        partId: partId,
      },
    });

    return concepts.map((c) => ({
      id: c.id,
      partId: c.partId,
      definition: c.definition,
      concept: c.name,
    }));
  }

  async getQuestion(questionId: string): Promise<ConceptDto> {
    const concept = await this.client.concept.findUnique({
      where: {
        id: questionId,
      },
    });

    if (!concept) {
      throw new Error(`Concept with id ${questionId} not found`);
    }

    return {
      id: concept.id,
      partId: concept.partId,
      definition: concept.definition,
      concept: concept.name,
    };
  }

  async getQuestions(questionIds: string[]): Promise<ConceptDto[]> {
    const concepts = await this.client.concept.findMany({
      where: {
        id: {
          in: questionIds,
        },
      },
    });

    return concepts.map((c) => ({
      id: c.id,
      partId: c.partId,
      definition: c.definition,
      concept: c.name,
    }));
  }

  async feedbackQuestion(
    questionId: string,
    isPositive: boolean,
  ): Promise<void> {
    await this.client.concept.update({
      where: {
        id: questionId,
      },
      data: {
        positiveFeedback: {
          increment: isPositive ? 1 : 0,
        },
        negativeFeedback: {
          increment: isPositive ? 0 : 1,
        },
      },
    });
  }

  async getExplanation(questionId: string): Promise<string | null> {
    const explanation = await this.client.conceptExplanation.findFirst({
      where: {
        questionId: questionId,
      },
    });

    if (!explanation) {
      return null;
    }

    return explanation.explanation;
  }

  async createExplanation(
    questionId: string,
    explanation: string,
  ): Promise<void> {
    await this.client.conceptExplanation.create({
      data: {
        questionId: questionId,
        explanation: explanation,
      },
    });
  }
}
