import { LanguageCode, languageCodes } from '@/common/language';
import { AgentPredictLanguage } from '@/lib/agents/interfaces';
import { LLM } from '@/lib/LLM/interface';
import { predictLanguagePrompt } from '@/lib/prompts/predict-language';
import { predictLanguageFromText } from '@/lib/utils/language';

export class AgentPredictLanguageImpl implements AgentPredictLanguage {
  private llm: LLM;

  constructor(llm: LLM) {
    this.llm = llm;
  }

  async predictLanguage(text: string): Promise<LanguageCode> {
    const prompt = predictLanguagePrompt
      .replace('{text}', text)
      .replace('{codes}', languageCodes.join(', '));

    const maxTokens = 5;
    const response = await this.llm.generate(prompt, '', maxTokens);

    for (const code of languageCodes) {
      if (response.trim().includes(code)) {
        return code as LanguageCode;
      }
    }

    return predictLanguageFromText(text);
  }
}
