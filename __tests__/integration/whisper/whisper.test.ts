import { describe, it, expect, beforeAll } from 'vitest';
import { WhisperProvider } from '../../../lib/providers/whisper-provider';
import fs from 'fs/promises';
import path from 'path';

describe('WhisperProvider Integration Tests', () => {
  let whisperProvider: WhisperProvider;
  let dummyAudioBuffer: Buffer;

  beforeAll(async () => {
    // Check if required environment variables are set
    if (!process.env.GROQ_API_KEYS || !process.env.DEEP_INFRA_API_KEY) {
      throw new Error(
        'Required environment variables GROQ_API_KEYS and DEEP_INFRA_API_KEY must be set',
      );
    }

    // Initialize the Whisper provider
    whisperProvider = new WhisperProvider();

    // Read the dummy audio file
    const audioPath = path.join(
      process.cwd(),
      '__tests__',
      'integration',
      'whisper',
      'test.mp3',
    );
    dummyAudioBuffer = await fs.readFile(audioPath);
  });

  it('should transcribe audio using Groq API', async () => {
    // Create a File object from the buffer
    const inputFile = new File([dummyAudioBuffer], 'test.mp3', {
      type: 'audio/mpeg',
    });

    // Attempt transcription
    const transcription = await whisperProvider.transcribe(inputFile, 'es');

    // Verify the transcription
    expect(transcription).toBeDefined();
    expect(typeof transcription).toBe('string');
    expect(transcription.length).toBeGreaterThan(0);

    console.debug(transcription);
  }, 30000);

  it('should transcribe audio using Deep Infra API', async () => {
    // Create a File object from the buffer
    const inputFile = new File([dummyAudioBuffer], 'test.mp3', {
      type: 'audio/mpeg',
    });

    // Attempt transcription
    const transcription = await (
      whisperProvider as any
    ).transcribeWithDeepInfra(inputFile, 'es');

    // Verify the transcription
    expect(transcription).toBeDefined();
    expect(typeof transcription).toBe('string');
    expect(transcription.length).toBeGreaterThan(0);

    console.debug(transcription);
  }, 30000);
});
