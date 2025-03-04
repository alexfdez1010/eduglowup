import { agents } from '@/lib/agents/agents';
import { describe, expect, it } from 'vitest';
import { colonText } from './common';

const agentTrueFalse = agents.trueFalse;

describe('AgentTrueFalseImpl', () => {
  it('should create a true/false question in English', async () => {
    const text = colonText;

    const questions = await agentTrueFalse.createQuestions(text, 'en');

    console.debug(questions);

    for (let i = 0; i < questions.length; i++) {
      const shouldBe = i % 2 === 0;
      expect(questions[i].isTrue).toBe(shouldBe);
      expect(questions[i].question).toBeTruthy();
      expect(questions[i].answer).toBeTruthy();
    }
  });

  it('should create a true/false question in Spanish', async () => {
    const text = colonText;

    const questionsSpanish = await agentTrueFalse.createQuestions(text, 'es');

    console.debug(questionsSpanish);

    for (let i = 0; i < questionsSpanish.length; i++) {
      const shouldBe = i % 2 === 0;
      expect(questionsSpanish[i].isTrue).toBe(shouldBe);
      expect(questionsSpanish[i].question).toBeTruthy();
      expect(questionsSpanish[i].answer).toBeTruthy();
    }
  });
});
