import { AgentConceptImpl } from '@/lib/agents/agent-concept';
import { PartMother } from '../object-mothers';

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fakeLanguage, fakeName } from '../fake';

const mockLLM = {
  chat: vi.fn(),
  generate: vi.fn(),
};

describe('AgentConceptImpl', () => {
  let agentConcept: AgentConceptImpl;

  beforeEach(() => {
    agentConcept = new AgentConceptImpl(mockLLM);
    vi.clearAllMocks();
  });

  it('should generate a list of concepts', async () => {
    const text = fakeName();
    const language = fakeLanguage();

    vi.spyOn(mockLLM, 'generate').mockResolvedValueOnce(
      `Sun: It is the central star and the planets orbit around it.\n` +
        `Planet: It is a celestial body that orbits a star, is large enough to be round, and has enough mass to be held together by its gravity.\n` +
        `Moon: It is a natural satellite of a planet, typically round in shape and composed of cheese.\n`,
    );

    const result = await agentConcept.createQuestions(text, language);

    expect(result).toEqual([
      {
        id: result[0].id,
        partId: '',
        concept: 'Sun',
        definition: 'It is the central star and the planets orbit around it.',
      },
      {
        id: result[1].id,
        partId: '',
        concept: 'Planet',
        definition:
          'It is a celestial body that orbits a star, is large enough to be round, and has enough mass to be held together by its gravity.',
      },
      {
        id: result[2].id,
        partId: '',
        concept: 'Moon',
        definition:
          'It is a natural satellite of a planet, typically round in shape and composed of cheese.',
      },
    ]);

    expect(mockLLM.generate).toHaveBeenCalledTimes(1);
  });

  it('should be able to replace a concept in the definition if it is appears on the definition', async () => {
    const text = fakeName();
    const language = fakeLanguage();

    vi.spyOn(mockLLM, 'generate').mockResolvedValueOnce(
      `Sun: The Sun is the central star and the planets orbit around it.\n` +
        `Planet: The Planet is a celestial body that orbits a star, is large enough to be round, and has enough mass to be held together by its gravity.\n` +
        `Moon: The Moon is a natural satellite of a planet, typically round in shape and composed of cheese.\n`,
    );

    const result = await agentConcept.createQuestions(text, language);

    expect(result).toEqual([
      {
        id: result[0].id,
        partId: '',
        concept: 'Sun',
        definition: `The ${AgentConceptImpl.placeholder} is the central star and the planets orbit around it.`,
      },
      {
        id: result[1].id,
        partId: '',
        concept: 'Planet',
        definition: `The ${AgentConceptImpl.placeholder} is a celestial body that orbits a star, is large enough to be round, and has enough mass to be held together by its gravity.`,
      },
      {
        id: result[2].id,
        partId: '',
        concept: 'Moon',
        definition: `The ${AgentConceptImpl.placeholder} is a natural satellite of a planet, typically round in shape and composed of cheese.`,
      },
    ]);

    expect(result).toBeTruthy();
  });

  it('should only take into account the lines with <concept>: <definition>', async () => {
    const text = fakeName();
    const language = fakeLanguage();

    vi.spyOn(mockLLM, 'generate').mockResolvedValueOnce(
      `Here you have the concepts:\n` +
        `Sun: The Sun is the central star and the planets orbit around it.\n` +
        `Planet: The Planet is a celestial body that orbits a star, is large enough to be round, and has enough mass to be held together by its gravity.\n` +
        `Moon: The Moon is a natural satellite of a planet, typically round in shape and composed of cheese.\n` +
        `I hope that these definitions are useful for you.\n`,
    );

    const result = await agentConcept.createQuestions(text, language);

    expect(result).toEqual([
      {
        id: result[0].id,
        partId: '',
        concept: 'Sun',
        definition: `The ${AgentConceptImpl.placeholder} is the central star and the planets orbit around it.`,
      },
      {
        id: result[1].id,
        partId: '',
        concept: 'Planet',
        definition: `The ${AgentConceptImpl.placeholder} is a celestial body that orbits a star, is large enough to be round, and has enough mass to be held together by its gravity.`,
      },
      {
        id: result[2].id,
        partId: '',
        concept: 'Moon',
        definition: `The ${AgentConceptImpl.placeholder} is a natural satellite of a planet, typically round in shape and composed of cheese.`,
      },
    ]);
  });

  it('should remove 1., 2. and so on from the concepts', async () => {
    const text = fakeName();
    const language = fakeLanguage();

    vi.spyOn(mockLLM, 'generate').mockResolvedValueOnce(
      `1.Sun: It is the central star and the planets orbit around it.\n` +
        `2. Planet: It is a celestial body that orbits a star, is large enough to be round, and has enough mass to be held together by its gravity.\n` +
        `3. Moon: It is a natural satellite of a planet, typically round in shape and composed of cheese.\n`,
    );

    const result = await agentConcept.createQuestions(text, language);

    expect(result).toEqual([
      {
        id: result[0].id,
        partId: '',
        concept: 'Sun',
        definition: `It is the central star and the planets orbit around it.`,
      },
      {
        id: result[1].id,
        partId: '',
        concept: 'Planet',
        definition: `It is a celestial body that orbits a star, is large enough to be round, and has enough mass to be held together by its gravity.`,
      },
      {
        id: result[2].id,
        partId: '',
        concept: 'Moon',
        definition: `It is a natural satellite of a planet, typically round in shape and composed of cheese.`,
      },
    ]);
  });

  it('should return empty list if the list of concept is not valid', async () => {
    const text = fakeName();
    const language = fakeLanguage();

    vi.spyOn(mockLLM, 'generate')
      .mockResolvedValueOnce(`Sun:\n` + `Planet:\n` + `Moon:\n`)
      .mockResolvedValueOnce(
        `Sun: It is the central star and the planets orbit around it.\n` +
          `Planet: It is a celestial body that orbits a star, is large enough to be round, and has enough mass to be held together by its gravity.\n` +
          `Moon: It is a natural satellite of a planet, typically round in shape and composed of cheese.\n`,
      );

    const result = await agentConcept.createQuestions(text, language);

    expect(result).toEqual([
      {
        id: result[0].id,
        partId: '',
        concept: 'Sun',
        definition: `It is the central star and the planets orbit around it.`,
      },
      {
        id: result[1].id,
        partId: '',
        concept: 'Planet',
        definition: `It is a celestial body that orbits a star, is large enough to be round, and has enough mass to be held together by its gravity.`,
      },
      {
        id: result[2].id,
        partId: '',
        concept: 'Moon',
        definition: `It is a natural satellite of a planet, typically round in shape and composed of cheese.`,
      },
    ]);
  });
});
