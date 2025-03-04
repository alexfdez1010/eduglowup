import { BlockDto, BlockTypeDto } from '@/lib/dto/block.dto';
import { PartDto } from '@/lib/dto/part.dto';
import { QuizDto } from '@/lib/dto/quiz.dto';
import { ShortQuestionsDto } from '@/lib/dto/short-questions.dto';
import { TrueFalseQuestionsDto } from '@/lib/dto/true-false.dto';
import { ConceptQuestionsDto } from '@/lib/dto/concept.dto';
import { ReportReward } from '@/lib/reward/report';
import { FlashcardsQuestionsDto } from '@/lib/dto/flashcard.dto';

export type AnswerType =
  | QuizDto
  | ShortQuestionsDto
  | TrueFalseQuestionsDto
  | ConceptQuestionsDto
  | FlashcardsQuestionsDto;

export interface Exercise {
  /**
   * Get the name of the exercise
   * @returns The name of the exercise
   */
  getName(): string;

  /**
   * Get the block type of the exercise
   * @returns The block type of the exercise
   */
  getBlockType(): BlockTypeDto;

  /**
   * Get the recommended KSI value for the exercise
   * it must be between 0 and 1.
   *
   * @returns The recommended KSI value for the exercise
   */
  getRecommendedProgress(): number;

  /**
   * Create a new block for the exercise
   *
   * @param part The part selected for the exercise
   * @param language The language of the session
   * @returns The created block
   */
  create(part: PartDto, language: string): Promise<BlockDto>;

  /**
   * Answer the exercise for a given user and returns the report
   * for the language provided
   *
   * @param userId The id of the user
   * @param answer The answer to the exercise
   * @returns The block with the exercise corrected and the report for the rewards
   */
  answer(
    userId: string,
    answer: AnswerType,
  ): Promise<[BlockDto | null, ReportReward]>;

  /**
   * Store the feedback for a particular question
   *
   * @param questionId The id of the question
   * @param isPositive Whether the feedback is positive or negative
   */
  feedback(questionId: string, isPositive: boolean): Promise<void>;

  /**
   * Return an explanation in natural language of why
   * the correct answer is the right answer and the other
   * answers are wrong.
   *
   * @param questionId The id of the question
   * @returns The explanation in natural language
   */
  explanation(questionId: string): Promise<string>;
}
