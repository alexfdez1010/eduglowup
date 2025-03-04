import { FileDecoder } from '@/lib/file-decoder/file-decoder';
import { FilePdf } from '@/lib/file-decoder/file-pdf';
import { FileEpub } from '@/lib/file-decoder/file-epub';
import { FileDocx } from '../file-decoder/file-docx';
import { FilePptx } from '../file-decoder/file-pptx';

export class FileDecoderService {
  private files: FileDecoder[];

  constructor(files: FileDecoder[]) {
    this.files = files;
  }

  /**
   * Decode the content of a file
   *
   * @param file The file to decode
   * @returns The decoded content
   */
  async decode(file: File): Promise<string> {
    const fileDecoder = this.files.find((f) => f.getMimeType() === file.type);

    if (!fileDecoder) {
      throw new Error('Unsupported file type');
    }

    const documents = await fileDecoder.decode(file);

    let text = '';

    for (const document of documents) {
      text += document.pageContent;
    }

    return text;
  }

  /**
   * Get the available mime types that the service can decode
   *
   * @returns The available mime types
   */
  availableMimeTypes(): string[] {
    return this.files.map((f) => f.getMimeType());
  }
}

export const fileDecoderService = new FileDecoderService([
  new FilePdf(),
  new FileEpub(),
  new FileDocx(),
  new FilePptx(),
]);
