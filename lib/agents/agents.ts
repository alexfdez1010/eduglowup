import {
  AgentClassifySections,
  AgentCorrectorShortQuestions,
  AgentQuestion,
  AgentGraphDocument,
  AgentSplitParts,
  AgentSummary,
  AgentAsk,
  AgentExplain,
  AgentGenerateNotes,
  AgentTypicalQuestions,
  AgentPredictLanguage,
} from '@/lib/agents/interfaces';

import { QuizQuestionDto } from '@/lib/dto/quiz.dto';
import { ShortQuestionDto } from '@/lib/dto/short-questions.dto';
import { TrueFalseQuestionDto } from '@/lib/dto/true-false.dto';
import { ConceptDto } from '@/lib/dto/concept.dto';
import { FlashcardDto } from '@/lib/dto/flashcard.dto';
import { llmComplex, llmFast, llmTiny } from '@/lib/LLM/models';
import { AgentSummaryImpl } from '@/lib/agents/agent-summary';
import { AgentAskImpl } from '@/lib/agents/agent-ask';
import { AgentClassifySectionsImpl } from '@/lib/agents/agent-classify-sections';
import { AgentConceptImpl } from '@/lib/agents/agent-concept';
import { AgentCorrectorShortQuestionsImpl } from '@/lib/agents/agent-corrector-short-questions';
import { AgentExplainImpl } from '@/lib/agents/agent-explain';
import { AgentFlashcardsImpl } from '@/lib/agents/agent-flashcards';
import { AgentGenerateNotesImpl } from '@/lib/agents/agent-generate-notes';
import { AgentGraphDocumentImpl } from '@/lib/agents/agent-graph-document';
import { AgentQuizImpl } from '@/lib/agents/agent-quiz';
import { AgentShortQuestionsImpl } from '@/lib/agents/agent-short-questions';
import { AgentSplitPartsImpl } from '@/lib/agents/agent-split-parts';
import { AgentTrueFalseImpl } from '@/lib/agents/agent-true-false';
import { AgentTypicalQuestionsImpl } from '@/lib/agents/agent-typical-questions';
import { AgentPredictLanguageImpl } from '@/lib/agents/agent-predict-language';

export class Agents {
  public quiz: AgentQuestion<QuizQuestionDto>;
  public shortQuestions: AgentQuestion<ShortQuestionDto>;
  public trueFalse: AgentQuestion<TrueFalseQuestionDto>;
  public concept: AgentQuestion<ConceptDto>;
  public flashcards: AgentQuestion<FlashcardDto>;
  public correctorShortQuestions: AgentCorrectorShortQuestions;
  public splitParts: AgentSplitParts;
  public classifySections: AgentClassifySections;
  public graphDocument: AgentGraphDocument;
  public summary: AgentSummary;
  public ask: AgentAsk;
  public explain: AgentExplain;
  public generateNotes: AgentGenerateNotes;
  public typicalQuestions: AgentTypicalQuestions;
  public predictLanguage: AgentPredictLanguage;

  constructor(
    quiz: AgentQuestion<QuizQuestionDto>,
    shortQuestions: AgentQuestion<ShortQuestionDto>,
    trueFalse: AgentQuestion<TrueFalseQuestionDto>,
    concept: AgentQuestion<ConceptDto>,
    flashcards: AgentQuestion<FlashcardDto>,
    correctorShortQuestions: AgentCorrectorShortQuestions,
    splitParts: AgentSplitParts,
    classifySections: AgentClassifySections,
    graphDocument: AgentGraphDocument,
    summary: AgentSummary,
    ask: AgentAsk,
    explain: AgentExplain,
    generateNotes: AgentGenerateNotes,
    typicalQuestions: AgentTypicalQuestions,
    predictLanguage: AgentPredictLanguage,
  ) {
    this.quiz = quiz;
    this.shortQuestions = shortQuestions;
    this.trueFalse = trueFalse;
    this.concept = concept;
    this.flashcards = flashcards;
    this.correctorShortQuestions = correctorShortQuestions;
    this.splitParts = splitParts;
    this.classifySections = classifySections;
    this.graphDocument = graphDocument;
    this.summary = summary;
    this.ask = ask;
    this.explain = explain;
    this.generateNotes = generateNotes;
    this.typicalQuestions = typicalQuestions;
    this.predictLanguage = predictLanguage;
  }
}

export const agents = new Agents(
  new AgentQuizImpl(llmComplex),
  new AgentShortQuestionsImpl(llmComplex),
  new AgentTrueFalseImpl(llmComplex),
  new AgentConceptImpl(llmComplex),
  new AgentFlashcardsImpl(llmComplex),
  new AgentCorrectorShortQuestionsImpl(llmFast),
  new AgentSplitPartsImpl(llmComplex),
  new AgentClassifySectionsImpl(llmTiny),
  new AgentGraphDocumentImpl(llmFast),
  new AgentSummaryImpl(llmComplex),
  new AgentAskImpl(llmFast),
  new AgentExplainImpl(llmFast),
  new AgentGenerateNotesImpl(llmComplex),
  new AgentTypicalQuestionsImpl(llmFast),
  new AgentPredictLanguageImpl(llmFast),
);
