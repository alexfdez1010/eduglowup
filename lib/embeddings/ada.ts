import { EmbeddingModel } from '@/lib/embeddings/interface';
import OpenAI from 'openai';

export class Ada implements EmbeddingModel {
  private provider: OpenAI;

  constructor() {
    this.provider = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getEmbedding(raw: string) {
    const text = raw.replace(/\n/g, ' ').trim();

    const embeddingData = await this.provider.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    const [{ embedding }] = embeddingData.data;
    return embedding;
  }
}
