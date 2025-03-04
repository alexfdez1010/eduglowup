import { PrismaClient } from '@prisma/client';
import { ExerciseRepository } from '@/lib/repositories/interfaces';
import { ShortQuestionDto } from '@/lib/dto/short-questions.dto';

export class ShortQuestionsRepositoryPrisma
  implements ExerciseRepository<ShortQuestionDto>
{
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async storeQuestions(questions: ShortQuestionDto[]): Promise<void> {
    const questionsToStore = questions.map((q) => ({
      id: q.id,
      partId: q.partId,
      question: q.question,
      rubric: q.rubric,
    }));

    await this.prisma.shortQuestion.createMany({
      data: questionsToStore,
    });
  }

  async getQuestionsOfPart(partId: string): Promise<ShortQuestionDto[]> {
    const questions = await this.prisma.shortQuestion.findMany({
      where: {
        partId: partId,
      },
    });

    return questions.map((q) => ({
      id: q.id,
      partId: q.partId,
      question: q.question,
      answer: '',
      rubric: q.rubric,
    }));
  }

  async getQuestion(questionId: string): Promise<ShortQuestionDto> {
    const question = await this.prisma.shortQuestion.findUnique({
      where: {
        id: questionId,
      },
    });

    return {
      id: question.id,
      partId: question.partId,
      question: question.question,
      answer: '',
      rubric: question.rubric,
    };
  }

  async getQuestions(questionIds: string[]): Promise<ShortQuestionDto[]> {
    const questions = await this.prisma.shortQuestion.findMany({
      where: {
        id: {
          in: questionIds,
        },
      },
    });

    return questions.map((q) => ({
      id: q.id,
      partId: q.partId,
      question: q.question,
      answer: '',
      rubric: q.rubric,
    }));
  }

  async feedbackQuestion(
    questionId: string,
    isPositive: boolean,
  ): Promise<void> {
    await this.prisma.shortQuestion.update({
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
    const explanation = await this.prisma.shortQuestionExplanation.findUnique({
      where: {
        questionId: questionId,
      },
    });

    return explanation?.explanation ?? null;
  }

  async createExplanation(
    questionId: string,
    explanation: string,
  ): Promise<void> {
    await this.prisma.shortQuestionExplanation.create({
      data: {
        questionId: questionId,
        explanation: explanation,
      },
    });
  }
}
