import { AnswerType, Exercise } from '@/lib/exercises/interface';
import { BlockDto, BlockTypeDto } from '@/lib/dto/block.dto';
import { PartDto } from '@/lib/dto/part.dto';
import {
  DocumentRepository,
  ShortQuestionsRepository,
} from '@/lib/repositories/interfaces';
import {
  AgentCorrectorShortQuestions,
  AgentExplain,
  AgentShortQuestions,
} from '@/lib/agents/interfaces';
import {
  ShortQuestionDto,
  ShortQuestionsDto,
} from '@/lib/dto/short-questions.dto';
import { randomElementsWithoutRepetition, shuffle } from '@/lib/random';
import { StatisticsUpdateService } from '@/lib/services/statistics-update-service';
import { EmbeddingService } from '@/lib/services/embedding-service';
import { ExerciseType, ReportReward } from '@/lib/reward/report';
import { Report } from '@/lib/exercises/report';
import { predictLanguageFromText } from '@/lib/utils/language';
import { getDictionary } from '@/app/[locale]/dictionaries';

export class ShortQuestionsExercise implements Exercise {
  private readonly shortQuestionsRepository: ShortQuestionsRepository;
  private readonly documentRepository: DocumentRepository;
  private readonly updateService: StatisticsUpdateService;
  private readonly agentShortQuestions: AgentShortQuestions;
  private readonly agentCorrectorShortQuestions: AgentCorrectorShortQuestions;
  private readonly embeddingService: EmbeddingService;
  private readonly agentExplain: AgentExplain;

  public static readonly NUMBER_OF_QUESTIONS = 3;
  public static readonly MAX_CHARACTERS_INPUT = 20000;

  constructor(
    shortQuestionsRepository: ShortQuestionsRepository,
    documentRepository: DocumentRepository,
    updateService: StatisticsUpdateService,
    agent: AgentShortQuestions,
    agentCorrectorShortQuestions: AgentCorrectorShortQuestions,
    embeddingService: EmbeddingService,
    agentExplain: AgentExplain,
  ) {
    this.shortQuestionsRepository = shortQuestionsRepository;
    this.documentRepository = documentRepository;
    this.updateService = updateService;
    this.agentShortQuestions = agent;
    this.agentCorrectorShortQuestions = agentCorrectorShortQuestions;
    this.embeddingService = embeddingService;
    this.agentExplain = agentExplain;
  }

  getName(): string {
    return 'short-questions';
  }

  getRecommendedProgress(): number {
    return 90;
  }

  getBlockType(): BlockTypeDto {
    return BlockTypeDto.SHORT;
  }

  async create(part: PartDto, language: string): Promise<BlockDto> {
    const questions = await this.getQuestions(part.id, language);

    const shortQuestions = {
      questions: questions,
      documentId: part.documentId,
      partOrder: part.order,
    };

    shortQuestions.questions.forEach((question) => {
      delete question.rubric;
    });

    return {
      type: BlockTypeDto.SHORT,
      order: -1,
      content: shortQuestions,
    };
  }

  async answer(
    userId: string,
    answer: AnswerType,
  ): Promise<[BlockDto, ReportReward]> {
    const shortQuestions = answer as ShortQuestionsDto;

    const completeQuestions = await this.shortQuestionsRepository.getQuestions(
      shortQuestions.questions.map((question) => question.id),
    );

    shortQuestions.questions.forEach((question) => {
      question.rubric = completeQuestions.find(
        (questionComplete) => questionComplete.id === question.id,
      )?.rubric;
    });

    const sections = await Promise.all(
      shortQuestions.questions.map((question) =>
        this.embeddingService
          .getTopSections(question.question, shortQuestions.documentId, 1)
          .then((res) => res[0]),
      ),
    );

    const report = await this.correctQuestions(shortQuestions, sections);

    const partId = shortQuestions.questions[0].partId;

    this.updateService
      .updateStatistics(
        userId,
        partId,
        report.totalQuestions,
        report.correctQuestions,
        'short',
      )
      .catch(console.error);

    const reportReward = {
      documentId: shortQuestions.documentId,
      totalQuestions: report.totalQuestions,
      correctQuestions: report.correctQuestions,
      exerciseType: ExerciseType.SHORT,
    };

    shortQuestions.questions.forEach((question, index) => {
      question.isCorrect = report.questions[index].isCorrect;
    });

    const block = {
      type: BlockTypeDto.SHORT,
      order: -1,
      content: shortQuestions,
    };

    return [block, reportReward];
  }

  async feedback(questionId: string, isPositive: boolean): Promise<void> {
    return this.shortQuestionsRepository.feedbackQuestion(
      questionId,
      isPositive,
    );
  }

  async explanation(questionId: string): Promise<string> {
    const explanation =
      await this.shortQuestionsRepository.getExplanation(questionId);

    if (explanation) {
      return explanation;
    }

    const question =
      await this.shortQuestionsRepository.getQuestion(questionId);

    const document = await this.documentRepository.getDocumentOfPart(
      question.partId,
    );

    const questionText = this.prepareQuestionForExplanation(
      question,
      document.language,
    );

    const sections = await this.embeddingService.getTopSections(
      question.question,
      document.id,
      3,
    );

    const newExplanation = await this.agentExplain.explain(
      questionText,
      sections.join('\n'),
      document.language,
    );

    this.shortQuestionsRepository
      .createExplanation(question.id, newExplanation)
      .catch((e) => {
        console.error(e);
      });

    return newExplanation;
  }

  private prepareQuestionForExplanation(
    question: ShortQuestionDto,
    language: string,
  ): string {
    const dictionary = getDictionary(language)['short-questions'];

    return dictionary['question-explanation']
      .replace('{question}', question.question)
      .replace('{rubric}', question.rubric);
  }

  private async getQuestions(
    partId: string,
    language: string,
  ): Promise<ShortQuestionDto[]> {
    const questions =
      await this.shortQuestionsRepository.getQuestionsOfPart(partId);

    if (questions.length >= ShortQuestionsExercise.NUMBER_OF_QUESTIONS) {
      return randomElementsWithoutRepetition(
        questions,
        ShortQuestionsExercise.NUMBER_OF_QUESTIONS,
      );
    }

    const newQuestions = await this.generateQuestions(partId, language);

    return randomElementsWithoutRepetition(
      newQuestions,
      ShortQuestionsExercise.NUMBER_OF_QUESTIONS,
    );
  }

  private async generateQuestions(
    partId: string,
    language: string,
  ): Promise<ShortQuestionDto[]> {
    const text = await this.documentRepository
      .getSectionsByPart(partId)
      .then((sections) => sections.map((section) => section.text).join(' '));

    const questions = await this.agentShortQuestions.createQuestions(
      text,
      language,
    );

    questions.forEach((question) => (question.partId = partId));

    this.shortQuestionsRepository.storeQuestions(questions).catch((e) => {
      console.error(e);
    });

    return questions;
  }

  async correctQuestions(
    shortQuestions: ShortQuestionsDto,
    sections: string[],
  ): Promise<Report> {
    const language = predictLanguageFromText(
      shortQuestions.questions.map((question) => question.question).join(' '),
    );

    const correctionsAndMarks = await Promise.all(
      shortQuestions.questions.map((question, index) =>
        this.agentCorrectorShortQuestions.correct(
          question,
          sections[index],
          language,
        ),
      ),
    );

    const marks = correctionsAndMarks.map(
      (correctionAndMark) => correctionAndMark[1],
    );

    const explanations = correctionsAndMarks.map(
      (correctionAndMark) => correctionAndMark[0],
    );

    const questionReport = shortQuestions.questions.map((question, index) => {
      const mark = marks[index];
      const explanation = explanations[index];

      return {
        isCorrect: mark >= 3,
        correctAnswer: explanation,
        userAnswer: question.answer,
      };
    });

    return {
      totalQuestions: shortQuestions.questions.length,
      correctQuestions: questionReport.filter((question) => question.isCorrect)
        .length,
      questions: questionReport,
    };
  }
}
