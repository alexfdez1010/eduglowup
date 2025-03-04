import { AnswerType, Exercise } from '@/lib/exercises/interface';
import { PartDto } from '@/lib/dto/part.dto';
import { BlockDto, BlockTypeDto } from '@/lib/dto/block.dto';
import { shuffle } from '@/lib/random';
import { ConceptDto, ConceptQuestionsDto } from '@/lib/dto/concept.dto';
import {
  ConceptRepository,
  DocumentRepository,
  ExerciseRepository,
} from '@/lib/repositories/interfaces';
import { AgentConcept, AgentExplain } from '@/lib/agents/interfaces';
import { StatisticsUpdateService } from '@/lib/services/statistics-update-service';
import { ExerciseType, ReportReward } from '@/lib/reward/report';

import { Report } from '@/lib/exercises/report';
import { getDictionary } from '@/app/[locale]/dictionaries';

export class ConceptExercise implements Exercise {
  private readonly conceptRepository: ConceptRepository;
  private readonly documentRepository: DocumentRepository;
  private readonly updateService: StatisticsUpdateService;
  private readonly agentConcept: AgentConcept;
  private readonly agentExplain: AgentExplain;

  public static readonly NUMBER_OF_CONCEPTS = 8;

  constructor(
    conceptRepository: ConceptRepository,
    documentRepository: DocumentRepository,
    updateService: StatisticsUpdateService,
    agentConcept: AgentConcept,
    agentExplain: AgentExplain,
  ) {
    this.conceptRepository = conceptRepository;
    this.documentRepository = documentRepository;
    this.updateService = updateService;
    this.agentConcept = agentConcept;
    this.agentExplain = agentExplain;
  }

  getName(): string {
    return 'concepts';
  }

  getRecommendedProgress(): number {
    return 40;
  }

  getBlockType(): BlockTypeDto {
    return BlockTypeDto.CONCEPT;
  }

  async create(part: PartDto, language: string): Promise<BlockDto> {
    const concepts = await this.getConceptsOfPart(part.id, language);

    const conceptsSelected = shuffle(concepts).slice(
      0,
      ConceptExercise.NUMBER_OF_CONCEPTS,
    );

    const conceptsInStrings = conceptsSelected.map(
      (concept) => concept.concept,
    );

    const exercise = {
      questions: conceptsSelected.map((concept) => ({
        id: concept.id,
        partId: concept.partId,
        definition: concept.definition,
        answer: '',
      })),
      documentId: part.documentId,
      partOrder: part.order,
      concepts: shuffle(conceptsInStrings),
    };

    return {
      type: BlockTypeDto.CONCEPT,
      order: -1,
      content: exercise,
    };
  }

  async answer(
    userId: string,
    answer: AnswerType,
  ): Promise<[BlockDto, ReportReward]> {
    const conceptQuestions = answer as ConceptQuestionsDto;
    const partId = conceptQuestions.questions[0].partId;

    const completeQuestions = await this.conceptRepository.getQuestions(
      conceptQuestions.questions.map((question) => question.id),
    );

    conceptQuestions.questions.forEach((question) => {
      question.concept = completeQuestions.find(
        (questionComplete) => questionComplete.id === question.id,
      )?.concept;
    });

    const report = this.correctQuestions(conceptQuestions);

    this.updateService
      .updateStatistics(
        userId,
        partId,
        report.totalQuestions,
        report.correctQuestions,
        'concept',
      )
      .catch(console.error);

    const reportReward = {
      documentId: conceptQuestions.documentId,
      totalQuestions: report.totalQuestions,
      correctQuestions: report.correctQuestions,
      exerciseType: ExerciseType.CONCEPT,
    };

    conceptQuestions.questions.forEach((question, index) => {
      question.isCorrect = report.questions[index].isCorrect;
    });

    const newBlock: BlockDto = {
      type: BlockTypeDto.CONCEPT,
      order: -1,
      content: conceptQuestions,
    };

    return [newBlock, reportReward];
  }

  async feedback(questionId: string, isPositive: boolean): Promise<void> {
    return this.conceptRepository.feedbackQuestion(questionId, isPositive);
  }

  async explanation(questionId: string): Promise<string> {
    const explanation = await this.conceptRepository.getExplanation(questionId);

    if (explanation) {
      return explanation;
    }

    const question = await this.conceptRepository.getQuestion(questionId);

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

    this.conceptRepository
      .createExplanation(question.id, newExplanation)
      .catch((e) => {
        console.error(e);
      });

    return newExplanation;
  }

  private prepareQuestionForExplanation(
    question: ConceptDto,
    language: string,
  ): string {
    const dictionary = getDictionary(language)['concepts'];

    return dictionary['concept-explanation']
      .replace('{concept}', question.concept)
      .replace('{definition}', question.definition);
  }

  private correctQuestions(questions: ConceptQuestionsDto): Report {
    let correctAnswers = 0;
    const totalQuestions = questions.questions.length;
    const questionsReport = [];

    for (const question of questions.questions) {
      const isCorrect =
        question.answer.normalize() === question.concept.normalize();

      questionsReport.push({
        isCorrect: isCorrect,
        correctAnswer: question.concept,
        userAnswer: question.answer,
      });

      correctAnswers += isCorrect ? 1 : 0;
    }

    return {
      totalQuestions: totalQuestions,
      correctQuestions: correctAnswers,
      questions: questionsReport,
    };
  }

  private async getConceptsOfPart(partId: string, language: string) {
    const concepts = await this.conceptRepository.getQuestionsOfPart(partId);

    if (concepts.length >= ConceptExercise.NUMBER_OF_CONCEPTS) {
      return concepts;
    }

    const sections = await this.documentRepository.getSectionsByPart(partId);

    const text = sections.map((section) => section.text).join(' ');

    const newConcepts = await this.agentConcept.createQuestions(text, language);

    newConcepts.forEach((concept) => (concept.partId = partId));

    this.conceptRepository
      .storeQuestions(newConcepts)
      .catch((error) => console.error(error));

    return newConcepts;
  }
}
