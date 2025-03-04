import { LLM } from "@/lib/LLM/interface";
import { BaseMessage } from "@langchain/core/messages";

export class DoubleLLM implements LLM {
  private firstLLM: LLM;
  private secondLLM: LLM;

  constructor(firstLLM: LLM, secondLLM: LLM) {
    this.firstLLM = firstLLM;
    this.secondLLM = secondLLM;
  }

  async generate(systemPrompt: string, userPrompt: string, maxTokens: number): Promise<string | null> {
    const firstResponse = await this.firstLLM.generate(systemPrompt, userPrompt, maxTokens);

    if(firstResponse) {
      return firstResponse;
    }

    console.log('Using second LLM');

    return await this.secondLLM.generate(systemPrompt, userPrompt, maxTokens);
  }

  async chat(previousPrompts: BaseMessage[], maxTokens: number): Promise<string | null> {
    const firstResponse = await this.firstLLM.chat(previousPrompts, maxTokens);

    if(firstResponse) {
      return firstResponse;
    }

    console.log('Using second LLM');

    return await this.secondLLM.chat(previousPrompts, maxTokens);
  }
}