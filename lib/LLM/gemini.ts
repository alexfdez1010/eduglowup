
import { LLM } from '@/lib/LLM/interface';
import {
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from '@langchain/core/messages';

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

export class Gemini implements LLM {
  private readonly model: ChatGoogleGenerativeAI;

  constructor() {
    this.model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: 'gemini-2.0-flash',
      maxRetries: 0,
    });
  }

  async generate(
    systemPrompt: string,
    userPrompt: string,
    _maxTokens: number,
  ): Promise<string | null> {

    const systemMessage = new SystemMessage(systemPrompt);
    const userMessage = new HumanMessage(userPrompt);

    try {
      const response = await this.model.invoke([systemMessage, userMessage]);
      return response.content as string;
    } catch (error) {
      console.error('Error generating response:', error);
      return null;
    }
  }

  async chat(
    previousPrompts: BaseMessage[],
    _maxTokens: number,
  ): Promise<string | null> {

    try {
      const response = await this.model.invoke(previousPrompts);
      return response.content as string;
    } catch (error) {
      console.error('Error in chat:', error);
      return null;
    }
  }
}