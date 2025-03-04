import { LLM } from '@/lib/LLM/interface';
import { ChatDeepInfra } from '@langchain/community/chat_models/deepinfra';
import {
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from '@langchain/core/messages';

abstract class Llama3 implements LLM {
  abstract getModelNameDeepInfra(): string;

  private fallbackModel: ChatDeepInfra;

  public static readonly MAX_SECONDS_TO_WAIT_FOR_A_RESPONSE = 15;

  constructor() {
    this.fallbackModel = new ChatDeepInfra({
      apiKey: process.env.DEEP_INFRA_API_KEY,
      maxConcurrency: 150,
      maxRetries: 5,
      model: this.getModelNameDeepInfra(),
    });
  }

  async chat(
    previousPrompts: BaseMessage[],
    maxTokens: number,
  ): Promise<string | null> {
    const controller = new AbortController();

    this.fallbackModel.maxTokens = maxTokens;

    setTimeout(
      () => controller.abort(),
      Llama3.MAX_SECONDS_TO_WAIT_FOR_A_RESPONSE * 1000,
    );

    try {
      const response = await this.fallbackModel.invoke(previousPrompts);
      return response.content as string;
    } catch (e) {
      console.error('Error in chat:', e);
      return null;
    }
  }

  async generate(
    systemPrompt: string,
    userPrompt: string,
    maxTokens: number,
  ): Promise<string | null> {
    const systemMessage = new SystemMessage(systemPrompt);
    const userMessage = new HumanMessage(userPrompt);

    const controller = new AbortController();

    this.fallbackModel.maxTokens = maxTokens;

    setTimeout(
      () => controller.abort(),
      Llama3.MAX_SECONDS_TO_WAIT_FOR_A_RESPONSE * 1000,
    );

    try {
      const response = await this.fallbackModel.invoke([systemMessage, userMessage]);
      return response.content as string;
    } catch (e) {
      console.error('Error in generate:', e);
      return null;
    }
  }
}

export class Llama31Small extends Llama3 {
  getModelNameDeepInfra(): string {
    return 'meta-llama/Meta-Llama-3.1-8B-Instruct';
  }
}

export class Llama33Medium extends Llama3 {
  getModelNameDeepInfra(): string {
    return 'meta-llama/Llama-3.3-70B-Instruct-Turbo';
  }
}

export class Llama32Small extends Llama3 {
  getModelNameDeepInfra(): string {
    return 'meta-llama/Llama-3.2-11B-Vision-Instruct';
  }
}

export class Llama32Tiny extends Llama3 {
  getModelNameDeepInfra(): string {
    return 'meta-llama/Llama-3.2-3B-Instruct';
  }
}
