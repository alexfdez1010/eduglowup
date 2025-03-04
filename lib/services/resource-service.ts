import {
  s3StorageProvider,
  S3StorageProvider,
} from '@/lib/providers/s3-storage';
import { UUID } from '@/lib/uuid';

export class ResourceService {
  private storageProvider: S3StorageProvider;

  constructor(storageProvider: S3StorageProvider) {
    this.storageProvider = storageProvider;
  }

  /**
   * Uploads a file to the storage
   * @param file The file buffer to upload
   * @returns The URL of the uploaded file
   */
  async uploadFile(file: File): Promise<string> {
    if (!file) {
      return null;
    }

    const extension = file.type.split('/')[1] || '';
    const key = `${UUID.generate()}.${extension}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    return await this.storageProvider.uploadFile(buffer, key, file.type);
  }

  /**
   * Gets a temporary public URL for a file
   * @param fileUrl The URL of the file
   * @param expiresIn Time in seconds until the URL expires (default: 1 hour)
   * @returns A temporary public URL for the file
   */
  async getTemporaryUrl(
    fileUrl: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    if (!fileUrl) {
      return null;
    }

    return await this.storageProvider.getTemporaryPublicUrl(fileUrl, expiresIn);
  }

  /**
   * Deletes a file from storage
   * @param fileUrl The URL of the file to delete
   */
  async deleteFile(fileUrl: string): Promise<void> {
    fileUrl && (await this.storageProvider.deleteFile(fileUrl));
  }

  /**
   * Updates an existing file in storage
   * @param fileUrl The URL of the existing file
   * @param newFile The new file buffer
   * @param mimeType The MIME type of the new file
   * @returns The URL of the updated file
   */
  async updateFile(
    fileUrl: string,
    newFile: Buffer,
    mimeType: string,
  ): Promise<string> {
    return await this.storageProvider.updateFile(fileUrl, newFile, mimeType);
  }
}

export const resourceService = new ResourceService(s3StorageProvider);
