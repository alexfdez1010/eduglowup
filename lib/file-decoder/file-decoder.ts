import { Document } from '@langchain/core/documents';

/**
 * Interface for a file decoder, each decoder should
 * specialize in decoding a specific type of file
 */
export interface FileDecoder {
  /**
   * Decode the content of the file
   * @param file The file
   */
  decode(file: File): Promise<Document[]>;

  // Get the mime type of the file that admits the classes
  getMimeType(): string;
}
