export interface EmbeddingModel {
  /**
   * Compute the embedding for the text given
   * @param raw the string to compute the embedding
   * @returns the embedding as a vector
   */
  getEmbedding(raw: string): Promise<number[]>;
}
