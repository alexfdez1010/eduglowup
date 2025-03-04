import { FileDecoder } from './file-decoder';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { Document } from '@langchain/core/documents';

export class FilePdf implements FileDecoder {
  async decode(file: File): Promise<Document[]> {
    const loader = new PDFLoader(file, {
      splitPages: true,
    });

    return await loader.load();
  }

  getMimeType(): string {
    return 'application/pdf';
  }
}
