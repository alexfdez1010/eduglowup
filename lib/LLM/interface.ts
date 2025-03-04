import { BaseMessage } from '@langchain/core/messages';

/**
 * The interface for a Large Language Model
 */
export interface LLM {
  /**
   * Generate a response to a prompt
   * @param systemPrompt The system prompt
   * @param userPrompt The user prompt
   * @param maxTokens The maximum number of tokens to generate
   * @returns The response to the prompt
   */
  generate(
    systemPrompt: string,
    userPrompt: string,
    maxTokens: number,
  ): Promise<string | null>;

  /**
   * Generate a response to a conversation
   * @param previousPrompts The previous prompts in the conversation
   * @param maxTokens The maximum number of tokens to generate
   * @returns The response to the conversation
   */
  chat(
    previousPrompts: BaseMessage[],
    maxTokens: number,
  ): Promise<string | null>;
}
