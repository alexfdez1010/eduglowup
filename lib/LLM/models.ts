import {
  Llama33Medium,
  Llama31Small,
  Llama32Small,
  Llama32Tiny,
} from '@/lib/LLM/llama3';
import { LLM } from '@/lib/LLM/interface';
import { Gemini } from '@/lib/LLM/gemini';
import { DoubleLLM } from '@/lib/LLM/double-llm';

// Here can be changed the models used by the application
// Fast model is used for quick responses and complex model is used for more complex responses
const tinyModel = 'llama-3.2-tiny';
const fastModel = 'llama-3.2-small';
const complexModel = 'gemini-with-llama3';

const llmCreator = (model: string): LLM => {
  switch (model) {
    case 'gemini-with-llama3':
      return new DoubleLLM(new Gemini(), new Llama33Medium());
    case 'gemini-flash':
      return new Gemini();
    case 'llama-3.1-small':
      return new Llama31Small();
    case 'llama-3.3-medium':
      return new Llama33Medium();
    case 'llama-3.2-tiny':
      return new Llama32Tiny();
    case 'llama-3.2-small':
      return new Llama32Small();
    default:
      throw new Error(`Model ${model} is not available`);
  }
};

export const llmTiny = llmCreator(tinyModel);
export const llmFast = llmCreator(fastModel);
export const llmComplex = llmCreator(complexModel);
