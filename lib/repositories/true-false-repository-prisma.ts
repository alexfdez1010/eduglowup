import { PrismaClient } from '@prisma/client';
import { ExerciseRepository } from '@/lib/repositories/interfaces';
import { TrueFalseQuestionDto } from '@/lib/dto/true-false.dto';

export class TrueFalseRepositoryPrisma
  implements ExerciseRepository<TrueFalseQuestionDto>
{
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async storeQuestions(questions: TrueFalseQuestionDto[]): Promise<void> {
    const questionsToStore = questions.map((q) => ({
      id: q.id,
      partId: q.partId,
      question: q.question,
      isTrue: q.isTrue,
    }));

    await this.prisma.trueFalseQuestion.createMany({
      data: questionsToStore,
    });
  }

  async getQuestionsOfPart(partId: string): Promise<TrueFalseQuestionDto[]> {
    const questions = await this.prisma.trueFalseQuestion.findMany({
      where: {
        partId: partId,
      },
    });

    return questions.map((q) => ({
      id: q.id,
      partId: q.partId,
      question: q.question,
      isTrue: q.isTrue,
      answer: 'no-answered',
    }));
  }

  async getQuestion(questionId: string): Promise<TrueFalseQuestionDto> {
    const question = await this.prisma.trueFalseQuestion.findUnique({
      where: {
        id: questionId,
      },
    });

    return {
      id: question.id,
      partId: question.partId,
      question: question.question,
      isTrue: question.isTrue,
      answer: 'no-answered',
    };
  }

  async getQuestions(questionIds: string[]): Promise<TrueFalseQuestionDto[]> {
    const questions = await this.prisma.trueFalseQuestion.findMany({
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
      isTrue: q.isTrue,
      answer: 'no-answered',
    }));
  }

  async feedbackQuestion(
    questionId: string,
    isPositive: boolean,
  ): Promise<void> {
    await this.prisma.trueFalseQuestion.update({
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
    const explanation = await this.prisma.trueFalseExplanation.findUnique({
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
    await this.prisma.trueFalseExplanation.create({
      data: {
        questionId: questionId,
        explanation: explanation,
      },
    });
  }
}
