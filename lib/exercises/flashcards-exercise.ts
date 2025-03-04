import { AnswerType, Exercise } from '@/lib/exercises/interface';
import { BlockDto, BlockTypeDto } from '@/lib/dto/block.dto';
import {
  DocumentRepository,
  FlashcardRepository,
} from '@/lib/repositories/interfaces';
import { StatisticsUpdateService } from '@/lib/services/statistics-update-service';
import { AgentExplain, AgentFlashcards } from '@/lib/agents/interfaces';
import { ExerciseType, ReportReward } from '@/lib/reward/report';
import { PartDto } from '@/lib/dto/part.dto';
import { FlashcardDto, FlashcardsQuestionsDto } from '@/lib/dto/flashcard.dto';
import { shuffle } from '@/lib/random';
import { getDictionary } from '@/app/[locale]/dictionaries';

export class FlashcardsExercise implements Exercise {
  private readonly flashcardRepository: FlashcardRepository;
  private readonly documentRepository: DocumentRepository;
  private readonly updateService: StatisticsUpdateService;
  private readonly agentFlashcards: AgentFlashcards;
  private readonly agentExplain: AgentExplain;

  public static readonly NUMBER_OF_FLASHCARDS = 10;

  constructor(
    flashcardRepository: FlashcardRepository,
    documentRepository: DocumentRepository,
    updateService: StatisticsUpdateService,
    agentFlashcards: AgentFlashcards,
    agentExplain: AgentExplain,
  ) {
    this.flashcardRepository = flashcardRepository;
    this.documentRepository = documentRepository;
    this.updateService = updateService;
    this.agentFlashcards = agentFlashcards;
    this.agentExplain = agentExplain;
  }

  getBlockType(): BlockTypeDto {
    return BlockTypeDto.FLASHCARDS;
  }

  getName(): string {
    return 'flashcards';
  }

  getRecommendedProgress(): number {
    return 0;
  }

  async create(part: PartDto, language: string): Promise<BlockDto> {
    const flashcards = await this.getFlashcardsOfPart(part.id, language);

    const flashcardsSelected = shuffle(flashcards).slice(
      0,
      FlashcardsExercise.NUMBER_OF_FLASHCARDS,
    );

    const exercise: FlashcardsQuestionsDto = {
      flashcards: flashcardsSelected,
      documentId: part.documentId,
      partOrder: part.order,
    };

    return {
      type: BlockTypeDto.FLASHCARDS,
      order: -1,
      content: exercise,
    };
  }

  async answer(
    userId: string,
    answer: AnswerType,
  ): Promise<[BlockDto | null, ReportReward]> {
    const flashcardQuestions = answer as FlashcardsQuestionsDto;
    const partId = flashcardQuestions.flashcards[0].partId;

    const { totalQuestions, correctQuestions } =
      this.correctQuestions(flashcardQuestions);

    this.updateService
      .updateStatistics(
        userId,
        partId,
        totalQuestions,
        correctQuestions,
        'flashcards',
      )
      .catch(console.error);

    const reportReward = {
      documentId: flashcardQuestions.documentId,
      totalQuestions: totalQuestions,
      correctQuestions: correctQuestions,
      exerciseType: ExerciseType.FLASHCARDS,
    };

    const newBlock: BlockDto = {
      type: BlockTypeDto.FLASHCARDS,
      order: -1,
      content: flashcardQuestions,
    };

    return [newBlock, reportReward];
  }

  async explanation(questionId: string): Promise<string> {
    const explanation =
      await this.flashcardRepository.getExplanation(questionId);

    if (explanation) {
      return explanation;
    }

    const question = await this.flashcardRepository.getQuestion(questionId);

    const document = await this.documentRepository.getDocumentOfPart(
      question.partId,
    );

    const questionText = this.prepareQuestionForExplanation(
      question,
      document.language,
    );

    const newExplanation = await this.agentExplain.explain(
      questionText,
      '',
      document.language,
    );

    this.flashcardRepository
      .createExplanation(question.id, newExplanation)
      .catch((e) => {
        console.error(e);
      });

    return newExplanation;
  }

  async feedback(questionId: string, isPositive: boolean): Promise<void> {
    await this.flashcardRepository.feedbackQuestion(questionId, isPositive);
  }

  async getFlashcardsOfPart(
    partId: string,
    language: string,
  ): Promise<FlashcardDto[]> {
    const flashcards =
      await this.flashcardRepository.getQuestionsOfPart(partId);

    if (flashcards.length >= FlashcardsExercise.NUMBER_OF_FLASHCARDS) {
      return flashcards;
    }

    const sections = await this.documentRepository.getSectionsByPart(partId);

    const text = sections.map((section) => section.text).join(' ');

    const newFlashcards = await this.agentFlashcards.createQuestions(
      text,
      language,
    );

    newFlashcards.forEach((flashcard) => (flashcard.partId = partId));

    this.flashcardRepository
      .storeQuestions(newFlashcards)
      .catch((error) => console.error(error));

    return newFlashcards;
  }

  private correctQuestions(questions: FlashcardsQuestionsDto): {
    totalQuestions: number;
    correctQuestions: number;
  } {
    return {
      totalQuestions: questions.flashcards.length,
      correctQuestions: questions.flashcards.filter(
        (flashcard) => flashcard.answer === 'correct',
      ).length,
    };
  }

  private prepareQuestionForExplanation(
    question: FlashcardDto,
    language: string,
  ): string {
    const dictionary = getDictionary(language)['flashcards'];

    return dictionary['question-explanation']
      .replace('{front}', question.front)
      .replace('{back}', question.back);
  }
}
