import { FileDecoder } from './file-decoder';
import { extractRawText } from 'mammoth';
import { Document } from '@langchain/core/documents';

export class FileDocx implements FileDecoder {
  getMimeType(): string {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }

  async decode(file: File): Promise<Document[]> {
    const docx = await extractRawText({
      buffer: Buffer.from(await file.arrayBuffer()),
    });

    if (!docx.value) return [];

    return [
      new Document({
        pageContent: docx.value,
      }),
    ];
  }
}
