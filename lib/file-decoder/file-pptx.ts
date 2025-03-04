import { PPTXLoader } from '@langchain/community/document_loaders/fs/pptx';
import { Document } from '@langchain/core/documents';

export class FilePptx {
  getMimeType(): string {
    return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
  }

  async decode(file: File): Promise<Document[]> {
    const loader = new PPTXLoader(file);

    return await loader.load();
  }
}
