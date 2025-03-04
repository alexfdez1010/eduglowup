import { AgentQuizImpl } from '@/lib/agents/agent-quiz';
import { SectionDto } from '@/lib/dto/section.dto';

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SectionMother } from '../object-mothers';
import { fakeLanguage, fakeStringWithSpaces } from '../fake';

const mockLLM = {
  chat: vi.fn(),
  generate: vi.fn(),
};

describe('AgentQuizImpl', () => {
  let agentQuiz: AgentQuizImpl;

  const validResponse = `1. What is the capital of France?
- London
+ Paris
- Berlin
- Madrid

2. What is the capital of Spain?
+ Madrid
- Barcelona
- Valencia
- Sevilla

3. What is the capital of Germany?
+ Berlin
- Munich
- Hamburg
- Cologne

4. What is the capital of Italy?
+ Rome
- Naples
- Milan
- Venice

5. What is the capital of Poland?
+ Warsaw
- Krakow
- Poznan
- Wroclaw

6. What is the capital of Russia?
+ Moscow
- St. Petersburg
- Kazan
- Yekaterinburg

7. What is the capital of Ukraine?
+ Kyiv
- Lviv
- Kharkiv
- Odessa

8. What is the capital of Turkey?
+ Ankara
- Istanbul
- Izmir
- Bursa

9. What is the capital of France?
- London
+ Paris
- Berlin
- Madrid

10. What is the capital of Spain?
+ Madrid
- Barcelona
- Valencia
- Sevilla`;

  beforeEach(() => {
    agentQuiz = new AgentQuizImpl(mockLLM);
    vi.clearAllMocks();
  });

  describe('createQuestion', () => {
    const mockLanguage = fakeLanguage();

    it('should create valid questions', async () => {
      mockLLM.generate.mockResolvedValueOnce(validResponse);

      const result = await agentQuiz.createQuestions(
        fakeStringWithSpaces(),
        mockLanguage,
      );

      const expectedResult = [
        {
          id: result[0].id,
          question: 'What is the capital of France?',
          answers: ['London', 'Paris', 'Berlin', 'Madrid'],
          correctAnswer: 1,
          answer: -1,
          partId: '',
        },
        {
          id: result[1].id,
          question: 'What is the capital of Spain?',
          answers: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla'],
          correctAnswer: 0,
          answer: -1,
          partId: '',
        },
        {
          id: result[2].id,
          question: 'What is the capital of Germany?',
          answers: ['Berlin', 'Munich', 'Hamburg', 'Cologne'],
          correctAnswer: 0,
          answer: -1,
          partId: '',
        },
        {
          id: result[3].id,
          question: 'What is the capital of Italy?',
          answers: ['Rome', 'Naples', 'Milan', 'Venice'],
          correctAnswer: 0,
          answer: -1,
          partId: '',
        },
        {
          id: result[4].id,
          question: 'What is the capital of Poland?',
          answers: ['Warsaw', 'Krakow', 'Poznan', 'Wroclaw'],
          correctAnswer: 0,
          answer: -1,
          partId: '',
        },
        {
          id: result[5].id,
          question: 'What is the capital of Russia?',
          answers: ['Moscow', 'St. Petersburg', 'Kazan', 'Yekaterinburg'],
          correctAnswer: 0,
          answer: -1,
          partId: '',
        },
        {
          id: result[6].id,
          question: 'What is the capital of Ukraine?',
          answers: ['Kyiv', 'Lviv', 'Kharkiv', 'Odessa'],
          correctAnswer: 0,
          answer: -1,
          partId: '',
        },
        {
          id: result[7].id,
          question: 'What is the capital of Turkey?',
          answers: ['Ankara', 'Istanbul', 'Izmir', 'Bursa'],
          correctAnswer: 0,
          answer: -1,
          partId: '',
        },
        {
          id: result[8].id,
          question: 'What is the capital of France?',
          answers: ['London', 'Paris', 'Berlin', 'Madrid'],
          correctAnswer: 1,
          answer: -1,
          partId: '',
        },
        {
          id: result[9].id,
          question: 'What is the capital of Spain?',
          answers: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla'],
          correctAnswer: 0,
          answer: -1,
          partId: '',
        },
      ];

      expect(result).toEqual(expectedResult);
      expect(mockLLM.generate).toHaveBeenCalledTimes(1);
    });

    it('should retry on invalid question format', async () => {
      const invalidResponse = 'Invalid response';

      mockLLM.generate
        .mockResolvedValueOnce(invalidResponse)
        .mockResolvedValueOnce(validResponse);

      const result = await agentQuiz.createQuestions(
        fakeStringWithSpaces(),
        mockLanguage,
      );

      const expectedResult = [
        {
          id: result[0].id,
          question: 'What is the capital of France?',
          answers: ['London', 'Paris', 'Berlin', 'Madrid'],
          correctAnswer: 1,
          answer: -1,
          partId: '',
        },
        {
          id: result[1].id,
          question: 'What is the capital of Spain?',
          answers: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla'],
          correctAnswer: 0,
          answer: -1,
          partId: '',
        },
        {
          id: result[2].id,
          question: 'What is the capital of Germany?',
          answers: ['Berlin', 'Munich', 'Hamburg', 'Cologne'],
          correctAnswer: 0,
          answer: -1,
          partId: '',
        },
        {
          id: result[3].id,
          question: 'What is the capital of Italy?',
          answers: ['Rome', 'Naples', 'Milan', 'Venice'],
          correctAnswer: 0,
          answer: -1,
          partId: '',
        },
        {
          id: result[4].id,
          question: 'What is the capital of Poland?',
          answers: ['Warsaw', 'Krakow', 'Poznan', 'Wroclaw'],
          correctAnswer: 0,
          answer: -1,
          partId: '',
        },
        {
          id: result[5].id,
          question: 'What is the capital of Russia?',
          answers: ['Moscow', 'St. Petersburg', 'Kazan', 'Yekaterinburg'],
          correctAnswer: 0,
          answer: -1,
          partId: '',
        },
        {
          id: result[6].id,
          question: 'What is the capital of Ukraine?',
          answers: ['Kyiv', 'Lviv', 'Kharkiv', 'Odessa'],
          correctAnswer: 0,
          answer: -1,
          partId: '',
        },
        {
          id: result[7].id,
          question: 'What is the capital of Turkey?',
          answers: ['Ankara', 'Istanbul', 'Izmir', 'Bursa'],
          correctAnswer: 0,
          answer: -1,
          partId: '',
        },
        {
          id: result[8].id,
          question: 'What is the capital of France?',
          answers: ['London', 'Paris', 'Berlin', 'Madrid'],
          correctAnswer: 1,
          answer: -1,
          partId: '',
        },
        {
          id: result[9].id,
          question: 'What is the capital of Spain?',
          answers: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla'],
          correctAnswer: 0,
          answer: -1,
          partId: '',
        },
      ];

      expect(result).toEqual(expectedResult);
      expect(mockLLM.generate).toHaveBeenCalledTimes(2);
    });
  });

  it('should fallback to a default question if the model fails five times', async () => {
    const mockSection: SectionDto = SectionMother.create();

    const mockLanguage = fakeLanguage();

    vi.spyOn(mockLLM, 'generate').mockResolvedValue('Hola');

    const result = await agentQuiz.createQuestions(
      fakeStringWithSpaces(),
      mockLanguage,
    );

    expect(result).toEqual([]);
    expect(mockLLM.generate).toHaveBeenCalledTimes(5);
  });
});
