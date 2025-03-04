import { FileDecoder } from './file-decoder';

import fs from 'fs';
import { Promise } from 'ts-toolbelt/out/Any/Promise';
import { Document } from '@langchain/core/documents';
import { EPubLoader } from '@langchain/community/document_loaders/fs/epub';
import { UUID } from '@/lib/uuid';

export class FileEpub implements FileDecoder {
  getMimeType(): string {
    return 'application/epub+zip';
  }

  async decode(file: File): Promise<Document[]> {
    // We create a temporal file as the
    // epub loader only admits filenames
    const uuid = UUID.generate();

    const filename = `${uuid}.epub`;

    await fs.promises.writeFile(
      filename,
      Buffer.from(await file.arrayBuffer()),
    );

    const loader = new EPubLoader(filename, {
      splitChapters: true,
    });

    const documents = await loader.load();

    // We delete the temporal file
    fs.unlink(filename, (err) => {
      if (err) {
        console.error(err);
      }
    });

    return documents;
  }
}
