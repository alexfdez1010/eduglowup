import { AnswerType, Exercise } from '@/lib/exercises/interface';
import {
  DocumentRepository,
  QuizRepository,
} from '@/lib/repositories/interfaces';
import { AgentExplain, AgentQuiz } from '@/lib/agents/interfaces';
import { BlockDto, BlockTypeDto } from '@/lib/dto/block.dto';
import { PartDto } from '@/lib/dto/part.dto';
import { QuizDto, QuizQuestionDto } from '@/lib/dto/quiz.dto';
import { randomElementsWithoutRepetition, shuffle } from '@/lib/random';
import { StatisticsUpdateService } from '@/lib/services/statistics-update-service';
import { EmbeddingService } from '@/lib/services/embedding-service';
import { ExerciseType, ReportReward } from '@/lib/reward/report';
import { Report } from '@/lib/exercises/report';
import { getDictionary } from '@/app/[locale]/dictionaries';

export class QuizExercise implements Exercise {
  private readonly quizRepository: QuizRepository;
  private readonly documentRepository: DocumentRepository;
  private readonly updateService: StatisticsUpdateService;
  private readonly agentQuiz: AgentQuiz;
  private readonly embeddingService: EmbeddingService;
  private readonly agentExplain: AgentExplain;

  public static readonly NUMBER_OF_QUESTIONS = 10;
  public static readonly MAX_CHARACTERS_INPUT = 20000;

  constructor(
    quizRepository: QuizRepository,
    documentRepository: DocumentRepository,
    updateService: StatisticsUpdateService,
    agentQuiz: AgentQuiz,
    embeddingService: EmbeddingService,
    agentExplain: AgentExplain,
  ) {
    this.quizRepository = quizRepository;
    this.documentRepository = documentRepository;
    this.updateService = updateService;
    this.agentQuiz = agentQuiz;
    this.embeddingService = embeddingService;
    this.agentExplain = agentExplain;
  }

  getName(): string {
    return 'quiz';
  }

  getRecommendedProgress(): number {
    return 60;
  }

  async create(part: PartDto, language: string): Promise<BlockDto> {
    const questions = await this.getQuestions(part.id, language);

    questions.forEach((question) => {
      question = this.shuffleAnswers(question);
    });

    const exercise: QuizDto = {
      questions: questions,
      documentId: part.documentId,
      partOrder: part.order,
    };

    return {
      type: BlockTypeDto.QUIZ,
      order: -1,
      content: exercise,
    };
  }

  async answer(
    userId: string,
    answer: AnswerType,
  ): Promise<[BlockDto, ReportReward]> {
    const quizAnswered = answer as QuizDto;

    const completeQuestions = await this.quizRepository.getQuestions(
      quizAnswered.questions.map((question) => question.id),
    );

    quizAnswered.questions.forEach((question) => {
      const equivalentQuestion = completeQuestions.find(
        (questionComplete) => questionComplete.id === question.id,
      );

      const correctAnswerOnQuestion =
        equivalentQuestion.answers[equivalentQuestion.correctAnswer];

      question.correctAnswer = question.answers.indexOf(
        correctAnswerOnQuestion,
      );
    });

    const partId = quizAnswered.questions[0].partId;

    const report = this.correctQuestions(quizAnswered);

    this.updateService
      .updateStatistics(
        userId,
        partId,
        report.totalQuestions,
        report.correctQuestions,
        'quiz',
      )
      .catch((e) => {
        console.error(e);
      });

    const reportReward = {
      documentId: quizAnswered.documentId,
      totalQuestions: report.totalQuestions,
      correctQuestions: report.correctQuestions,
      exerciseType: ExerciseType.QUIZ,
    };

    quizAnswered.questions.forEach((question, index) => {
      question.isCorrect = report.questions[index].isCorrect;
    });

    const block = {
      type: BlockTypeDto.QUIZ,
      order: -1,
      content: quizAnswered,
    };

    quizAnswered.questions = quizAnswered.questions.filter(
      (question) => question.id,
    );

    return [block, reportReward];
  }

  async feedback(questionId: string, isPositive: boolean): Promise<void> {
    return this.quizRepository.feedbackQuestion(questionId, isPositive);
  }

  async explanation(questionId: string): Promise<string> {
    const explanation = await this.quizRepository.getExplanation(questionId);

    if (explanation !== null) {
      return explanation;
    }

    const question = await this.quizRepository.getQuestion(questionId);

    const content = await this.documentRepository.getDocumentOfPart(
      question.partId,
    );

    const sections = await this.embeddingService.getTopSections(
      question.question,
      content.id,
      3,
    );

    const questionText = this.prepareQuestionForExplanation(
      question,
      content.language,
    );

    const newExplanation = await this.agentExplain.explain(
      questionText,
      sections.join('\n'),
      content.language,
    );

    this.quizRepository
      .createExplanation(questionId, newExplanation)
      .catch((e) => {
        console.error(e);
      });

    return newExplanation;
  }

  private prepareQuestionForExplanation(
    question: QuizQuestionDto,
    language: string,
  ): string {
    const dictionary = getDictionary(language)['quiz'];

    return dictionary['question-explanation']
      .replace('{question}', question.question)
      .replace('{correctAnswer}', question.answers[question.correctAnswer])
      .replace(
        '{incorrectAnswers}',
        question.answers
          .filter((_, index) => index !== question.correctAnswer)
          .join('\n'),
      );
  }

  async getQuestions(
    partId: string,
    language: string,
  ): Promise<QuizQuestionDto[]> {
    const questions = await this.quizRepository.getQuestionsOfPart(partId);

    if (questions.length >= QuizExercise.NUMBER_OF_QUESTIONS) {
      return randomElementsWithoutRepetition(
        questions,
        QuizExercise.NUMBER_OF_QUESTIONS,
      );
    }

    const newQuestions = await this.generateQuestions(partId, language);

    return randomElementsWithoutRepetition(
      newQuestions,
      QuizExercise.NUMBER_OF_QUESTIONS,
    );
  }

  /**
   * We are going to create a question based
   * on the section with a LLM model
   * @param section The section to create the question from
   * @param language The language to use to generate the questions
   * @returns A new instance of QuestionDto
   */
  async generateQuestions(
    partId: string,
    language: string,
  ): Promise<QuizQuestionDto[]> {
    const sections = await this.documentRepository.getSectionsByPart(partId);

    const text = sections
      .map((section) => section.text)
      .join('\n')
      .slice(0, QuizExercise.MAX_CHARACTERS_INPUT);

    const questions = await this.agentQuiz.createQuestions(text, language);

    questions.forEach((question) => (question.partId = partId));

    this.quizRepository.storeQuestions(questions).catch((e) => {
      console.error(e);
    });

    return questions;
  }

  /**
   * This function will shuffle the answers of a question
   * keeping the index of the correct answer in the correctAnswer field
   * @param question The question.ts to shuffle
   * @returns A new instance of QuestionGenerated with the answers shuffled
   */
  shuffleAnswers(question: QuizQuestionDto): QuizQuestionDto {
    // We remove the correct answer
    delete question.correctAnswer;

    // We can now shuffle the answers
    question.answers = shuffle(question.answers);

    return question;
  }

  correctQuestions(quizAnswered: QuizDto): Report {
    let correctAnswers = 0;
    const totalQuestions = quizAnswered.questions.length;
    const questionsReport = [];

    for (const question of quizAnswered.questions) {
      const isCorrect = question.correctAnswer === question.answer;
      questionsReport.push({
        isCorrect: isCorrect,
        correctAnswer: question.correctAnswer.toString(),
        userAnswer: question.answer.toString(),
      });

      correctAnswers += isCorrect ? 1 : 0;
    }

    return {
      totalQuestions: totalQuestions,
      correctQuestions: correctAnswers,
      questions: questionsReport,
    };
  }

  getBlockType(): BlockTypeDto {
    return BlockTypeDto.QUIZ;
  }
}
