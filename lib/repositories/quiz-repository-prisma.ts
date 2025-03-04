import { PrismaClient } from '@prisma/client';
import { ExerciseRepository } from '@/lib/repositories/interfaces';
import { QuizQuestionDto } from '@/lib/dto/quiz.dto';

export class QuizRepositoryPrisma
  implements ExerciseRepository<QuizQuestionDto>
{
  private readonly client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async storeQuestions(questions: QuizQuestionDto[]): Promise<void> {
    const questionsToStore = questions.map((question) => ({
      id: question.id,
      text: question.question,
      partId: question.partId,
      choices: question.answers.map((answer, index) => ({
        text: answer,
        isCorrect: index === question.correctAnswer,
      })),
    }));

    await Promise.all(
      questionsToStore.map((question) =>
        this.client.quizQuestion.create({
          data: {
            id: question.id,
            text: question.text,
            partId: question.partId,
            choices: {
              create: question.choices,
            },
          },
        }),
      ),
    );
  }

  async getQuestionsOfPart(partId: string): Promise<QuizQuestionDto[]> {
    const questions = await this.client.quizQuestion.findMany({
      where: {
        partId: partId,
      },
      include: {
        choices: true,
      },
    });

    return questions.map((question) => {
      return {
        id: question.id,
        question: question.text,
        answer: -1,
        answers: question.choices.map((choice) => choice.text),
        correctAnswer: question.choices.findIndex((choice) => choice.isCorrect),
        partId: question.partId,
      };
    });
  }

  async getQuestion(questionId: string): Promise<QuizQuestionDto> {
    const question = await this.client.quizQuestion.findFirst({
      where: {
        id: questionId,
      },
      include: {
        choices: true,
      },
    });

    return {
      id: question.id,
      question: question.text,
      answers: question.choices.map((choice) => choice.text),
      correctAnswer: question.choices.findIndex((choice) => choice.isCorrect),
      partId: question.partId,
    };
  }

  async getQuestions(questionIds: string[]): Promise<QuizQuestionDto[]> {
    const questions = await this.client.quizQuestion.findMany({
      where: {
        id: {
          in: questionIds,
        },
      },
      include: {
        choices: true,
      },
    });

    return questions.map((question) => {
      return {
        id: question.id,
        question: question.text,
        answers: question.choices.map((choice) => choice.text),
        correctAnswer: question.choices.findIndex((choice) => choice.isCorrect),
        partId: question.partId,
      };
    });
  }

  async feedbackQuestion(
    questionId: string,
    isPositive: boolean,
  ): Promise<void> {
    await this.client.quizQuestion.update({
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
    const explanation = await this.client.quizExplanation.findUnique({
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
    await this.client.quizExplanation.create({
      data: {
        questionId: questionId,
        explanation: explanation,
      },
    });
  }
}
