import Groq from 'groq-sdk';
import fs from 'fs';
import { UUID } from '../uuid';

export class WhisperProvider {
  private readonly groqApiKeys: string[];
  private readonly deepInfraApiKey: string;
  private callsCount: number[];

  private static readonly DEEP_INFRA_TRANSCRIPTION_URL =
    'https://api.deepinfra.com/v1/openai/audio/transcriptions';

  constructor() {
    const groqKeys = process.env.GROQ_API_KEYS?.split(',') || [];

    if (groqKeys.length === 0) {
      throw new Error('No GROQ API keys provided');
    }

    this.groqApiKeys = groqKeys;
    this.deepInfraApiKey = process.env.DEEP_INFRA_API_KEY || '';
    this.callsCount = groqKeys.map(() => 0);

    // Reset call counts every minute
    setInterval(() => {
      this.callsCount = this.callsCount.map(() => 0);
    }, 1000 * 60);
  }

  private selectApiKey(): { key: string; index: number } {
    const minCallCount = Math.min(...this.callsCount);
    const availableIndices = this.callsCount
      .map((count, index) => ({ count, index }))
      .filter((item) => item.count === minCallCount)
      .map((item) => item.index);

    const selectedIndex =
      availableIndices[Math.floor(Math.random() * availableIndices.length)];
    this.callsCount[selectedIndex]++;

    return {
      key: this.groqApiKeys[selectedIndex],
      index: selectedIndex,
    };
  }

  private async createTempFile(audioFile: File): Promise<string> {
    const extension = audioFile.type.split('/')[1] || '';
    const key = `${UUID.generate()}.${extension}`;

    const buffer = Buffer.from(await audioFile.arrayBuffer());
    fs.writeFileSync(key, buffer);
    return key;
  }

  private async transcribeWithGroq(
    audioFile: File,
    language?: string,
  ): Promise<string | null> {
    const { key } = this.selectApiKey();

    const groq = new Groq({
      apiKey: key,
    });

    const tempFile = await this.createTempFile(audioFile);

    try {
      const transcription = await groq.audio.transcriptions.create({
        file: fs.createReadStream(tempFile),
        model: 'whisper-large-v3-turbo',
        response_format: 'json',
        ...(language ? { language } : {}),
      });
      return transcription.text;
    } catch (error) {
      console.error('Error in Groq transcription:', error);
      return null;
    } finally {
      fs.unlinkSync(tempFile);
    }
  }

  private async transcribeWithDeepInfra(
    audioFile: File,
    language?: string,
  ): Promise<string> {
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', 'openai/whisper-large-v3-turbo');
    formData.append('temperature', '0');
    language && formData.append('language', language);
    formData.append('format', 'text');

    const response = await fetch(WhisperProvider.DEEP_INFRA_TRANSCRIPTION_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.deepInfraApiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        `Deep Infra API error: ${response.status} ${response.statusText}`,
      );
    }

    return response.text();
  }

  public async transcribe(audioFile: File, language: string): Promise<string> {
    const result = await this.transcribeWithGroq(audioFile, language);

    if (result) {
      return result;
    }

    return this.transcribeWithDeepInfra(audioFile, language);
  }
}

export const whisperProvider = new WhisperProvider();
