import { PartDto } from '@/lib/dto/part.dto';
import { Graph } from '@/lib/graph';
import { MessageDto } from '@/lib/dto/message.dto';
import { ShortQuestionDto } from '@/lib/dto/short-questions.dto';
import { SectionDto } from '@/lib/dto/section.dto';
import { ConceptDto } from '@/lib/dto/concept.dto';
import { FlashcardDto } from '@/lib/dto/flashcard.dto';
import { TrueFalseQuestionDto } from '@/lib/dto/true-false.dto';
import { QuizQuestionDto } from '@/lib/dto/quiz.dto';
import { LanguageCode, languageCodes } from '@/common/language';

export type PartOutput = {
  name: string;
  description: string;
  isUseful: boolean;
};

export interface AgentQuestion<T> {
  /**
   * Generate questions for the text given in the language
   * provided.
   * @param text The text to generate the question from
   * @param language The language of the section
   * @returns The generated question
   */
  createQuestions(text: string, language: string): Promise<T[]>;
}

export interface AgentQuiz extends AgentQuestion<QuizQuestionDto> {}
export interface AgentTrueFalse extends AgentQuestion<TrueFalseQuestionDto> {}
export interface AgentConcept extends AgentQuestion<ConceptDto> {}
export interface AgentShortQuestions extends AgentQuestion<ShortQuestionDto> {}
export interface AgentFlashcards extends AgentQuestion<FlashcardDto> {}

export interface AgentCorrectorShortQuestions {
  /**
   * Correct the short question given according to the section
   *
   * @param question The short question to correct
   * @param sectionText The text of the section
   * @param language The language used to generate the correction
   *
   * @returns A tuple with the correction and the mark obtained
   */
  correct(
    question: ShortQuestionDto,
    sectionText: string,
    language: string,
  ): Promise<[string, number]>;
}

export interface AgentSplitParts {
  /**
   * Split the document into parts
   *
   * @param text The text of the document
   * @param language The language of the document
   * @param numberOfSections The number of sections to create
   *
   * @returns The name of the parts of the document
   */
  splitDocumentIntoParts(
    text: string,
    language: string,
    numberOfSections: number,
  ): Promise<PartOutput[]>;
}

export interface AgentGraphDocument {
  /**
   * Create a graph of the document
   *
   * @param parts The parts of the document
   * @returns The graph of the document
   */
  createGraphOfParts(parts: PartDto[]): Promise<Graph<PartDto>>;
}

export interface AgentClassifySections {
  /**
   * Classify the sections of the document
   *
   * @param parts The parts of the document
   * @param descriptions The descriptions of the parts
   * @param sectionTexts The texts of the sections
   * @returns The classification of the sections
   */
  classifySections(
    parts: PartDto[],
    descriptions: string[],
    sectionTexts: string[],
  ): Promise<SectionDto[]>;
}

export interface AgentSummary {
  /**
   * Generate a summary of a text
   *
   * @param title The title of the text
   * @param text The text to generate the summary for
   * @param language The language to use for the summary
   * @returns The summary
   */
  generateSummary(
    title: string,
    text: string,
    language: string,
  ): Promise<string>;
}

export interface AgentExtendSummary {
  /**
   * Extend the summary with the given text
   * @param summary The summary to extend
   * @param sectionsRelated The sections most related to the summary
   * @param language The language of the summary
   *
   * @returns The extended summary
   */
  extendSummary(
    summary: string,
    sectionsRelated: string[],
    language: string,
  ): Promise<string>;
}

export interface AgentAsk {
  /**
   * Answer a question asked by the user
   *
   * @param previousMessages The previous messages of the user
   * @param text The text of the question
   * @param sectionsRelated The sections related to the question
   * @param language The language in which to answer the question
   * @returns The new messages
   */
  ask(
    previousMessages: MessageDto[],
    text: string,
    sectionsRelated: string[],
    language: string,
  ): Promise<string>;
}

export interface AgentExplain {
  /**
   * Explain the question
   *
   * @param questionText The text of the question
   * @param section The section in which the question was asked
   * @param language The language in which to explain the question
   * @returns The explanation of the question
   */
  explain(
    questionText: string,
    section: string,
    language: string,
  ): Promise<string>;
}

export interface AgentGenerateNotes {
  /**
   * Get the parts of the topic
   * @param topic The topic to get the parts of
   * @param description The description of the topic
   * @param language The language of the topic
   * @returns The name of the parts and their descriptions of the topic
   */
  getParts(
    topic: string,
    description: string,
    language: string,
  ): Promise<{ name: string; description: string }[]>;

  /**
   * Generate a summary of a part of the topic
   * @param topic The topic of the part
   * @param description The description of the topic
   * @param part The part to generate the summary of
   * @param language The language of the part
   * @returns The summary of the part
   */
  generateSummary(
    topic: string,
    description: string,
    part: string,
    language: string,
  ): Promise<string>;

  /**
   * Create a graph of the parts
   * @param parts The parts of the topic
   * @returns The graph of the parts
   */
  createGraph(parts: PartDto[]): Graph<PartDto>;
}

export interface AgentTypicalQuestions {
  /**
   * Generates typical questions for a part
   * @param partSummary The summary of the part
   * @param language in which to generate the summary
   * @returns The list of typical questions
   */
  generateTypicalQuestions(
    partSummary: string,
    language: string,
  ): Promise<string[]>;
}

export interface AgentPredictLanguage {
  /**
   * Predict the language of the text
   * @param text The text to predict the language of
   * @returns The language of the text
   */
  predictLanguage(text: string): Promise<LanguageCode>;
}
