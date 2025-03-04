import { AnswerType, Exercise } from '@/lib/exercises/interface';
import { BlockDto, BlockTypeDto } from '@/lib/dto/block.dto';
import { PartDto } from '@/lib/dto/part.dto';
import {
  DocumentRepository,
  TrueFalseRepository,
} from '@/lib/repositories/interfaces';
import { AgentExplain, AgentTrueFalse } from '@/lib/agents/interfaces';
import {
  TrueFalseQuestionDto,
  TrueFalseQuestionsDto,
} from '@/lib/dto/true-false.dto';
import { SectionDto } from '@/lib/dto/section.dto';
import { randomElementsWithoutRepetition, shuffle } from '@/lib/random';
import { StatisticsUpdateService } from '@/lib/services/statistics-update-service';
import { EmbeddingService } from '@/lib/services/embedding-service';
import { ExerciseType, ReportReward } from '@/lib/reward/report';
import { Report } from '@/lib/exercises/report';
import { getDictionary } from '@/app/[locale]/dictionaries';

export class TrueFalseExercise implements Exercise {
  private readonly trueFalseRepository: TrueFalseRepository;
  private readonly documentRepository: DocumentRepository;
  private readonly updateService: StatisticsUpdateService;
  private readonly agent: AgentTrueFalse;
  private readonly embeddingService: EmbeddingService;
  private readonly agentExplain: AgentExplain;

  public static readonly LENGTH_QUESTIONS = 10;
  public static readonly MAX_CHARACTERS_INPUT = 20000;

  constructor(
    trueFalseRepository: TrueFalseRepository,
    documentRepository: DocumentRepository,
    updateService: StatisticsUpdateService,
    agent: AgentTrueFalse,
    embeddingService: EmbeddingService,
    agentExplain: AgentExplain,
  ) {
    this.trueFalseRepository = trueFalseRepository;
    this.documentRepository = documentRepository;
    this.updateService = updateService;
    this.agent = agent;
    this.embeddingService = embeddingService;
    this.agentExplain = agentExplain;
  }

  getName(): string {
    return 'true-false';
  }

  getRecommendedProgress(): number {
    return 20;
  }

  getBlockType(): BlockTypeDto {
    return BlockTypeDto.TRUE_FALSE;
  }

  async create(part: PartDto, language: string): Promise<BlockDto> {
    const questions = await this.getQuestions(part.id, language);

    const trueFalseQuestions = {
      questions: questions,
      documentId: part.documentId,
      partOrder: part.order,
    };

    trueFalseQuestions.questions.forEach((question) => {
      delete question.isTrue;
    });

    trueFalseQuestions.questions = trueFalseQuestions.questions.filter(
      (question) => question.id,
    );

    return {
      type: BlockTypeDto.TRUE_FALSE,
      order: -1,
      content: trueFalseQuestions,
    };
  }

  async answer(
    userId: string,
    answer: AnswerType,
  ): Promise<[BlockDto, ReportReward]> {
    const trueFalseQuestions = answer as TrueFalseQuestionsDto;

    const completeQuestions = await this.trueFalseRepository.getQuestions(
      trueFalseQuestions.questions.map((question) => question.id),
    );

    trueFalseQuestions.questions.forEach((question) => {
      question.isTrue = completeQuestions.find(
        (questionComplete) => questionComplete.id === question.id,
      )?.isTrue;
    });

    const report = this.correctQuestions(trueFalseQuestions);

    const partId = trueFalseQuestions.questions[0].partId;

    this.updateService
      .updateStatistics(
        userId,
        partId,
        report.totalQuestions,
        report.correctQuestions,
        'true-false',
      )
      .catch(console.error);

    const reportReward = {
      documentId: trueFalseQuestions.documentId,
      totalQuestions: report.totalQuestions,
      correctQuestions: report.correctQuestions,
      exerciseType: ExerciseType.TRUE_FALSE,
    };

    trueFalseQuestions.questions.forEach((question, index) => {
      question.isCorrect = report.questions[index].isCorrect;
    });

    const block = {
      type: BlockTypeDto.TRUE_FALSE,
      order: -1,
      content: trueFalseQuestions,
    };

    return [block, reportReward];
  }

  async feedback(questionId: string, isPositive: boolean): Promise<void> {
    return this.trueFalseRepository.feedbackQuestion(questionId, isPositive);
  }

  async explanation(questionId: string): Promise<string> {
    const explanation =
      await this.trueFalseRepository.getExplanation(questionId);

    if (explanation) {
      return explanation;
    }

    const question = await this.trueFalseRepository.getQuestion(questionId);

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

    this.trueFalseRepository
      .createExplanation(question.id, newExplanation)
      .catch((e) => {
        console.error(e);
      });

    return newExplanation;
  }

  private prepareQuestionForExplanation(
    question: TrueFalseQuestionDto,
    language: string,
  ): string {
    const dictionary = getDictionary(language)['true-false'];

    return dictionary['question-explanation']
      .replace('{question}', question.question)
      .replace('{answer}', question.isTrue ? 'true' : 'false');
  }

  private async getQuestions(
    partId: string,
    language: string,
  ): Promise<TrueFalseQuestionDto[]> {
    const questions = await this.trueFalseRepository.getQuestionsOfPart(partId);

    if (questions.length >= TrueFalseExercise.LENGTH_QUESTIONS) {
      return randomElementsWithoutRepetition(
        questions,
        TrueFalseExercise.LENGTH_QUESTIONS,
      );
    }

    const newQuestions = await this.generateQuestions(partId, language);

    return randomElementsWithoutRepetition(
      newQuestions,
      TrueFalseExercise.LENGTH_QUESTIONS,
    );
  }

  private async generateQuestions(
    partId: string,
    language: string,
  ): Promise<TrueFalseQuestionDto[]> {
    const sections = await this.documentRepository.getSectionsByPart(partId);

    const text = sections
      .map((section) => section.text)
      .join('\n')
      .slice(0, TrueFalseExercise.MAX_CHARACTERS_INPUT);

    const questions = await this.agent.createQuestions(text, language);

    questions.forEach((question) => (question.partId = partId));

    this.trueFalseRepository.storeQuestions(questions).catch((e) => {
      console.error(e);
    });

    return questions;
  }

  correctQuestions(trueFalseQuestions: TrueFalseQuestionsDto): Report {
    let correctAnswers = 0;
    const totalQuestions = trueFalseQuestions.questions.length;
    const questionsReport = [];

    for (const question of trueFalseQuestions.questions) {
      const isCorrect = (question.answer === 'true') === question.isTrue;
      questionsReport.push({
        isCorrect: isCorrect,
        correctAnswer: question.isTrue.toString(),
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
}
