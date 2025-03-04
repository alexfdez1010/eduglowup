import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class S3StorageProvider {
  private s3Client: S3Client;
  private bucket: string;
  private region: string;

  constructor() {
    this.region = process.env.AWS_REGION || 'us-east-1';
    this.bucket = process.env.AWS_S3_BUCKET || '';

    if (!this.bucket) {
      throw new Error('AWS S3 bucket name is required');
    }

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  /**
   * Uploads a file to S3 and returns its URL
   * @param file The file buffer to upload
   * @param key The key (path) where the file will be stored
   * @param contentType The content type of the file
   * @returns The URL of the uploaded file
   */
  async uploadFile(
    file: Buffer,
    key: string,
    contentType: string,
  ): Promise<string> {
    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: contentType,
      },
    });

    await upload.done();
    return this.getFileUrl(key);
  }

  /**
   * Updates an existing file in S3
   * @param url The URL of the existing file
   * @param file The new file buffer
   * @param contentType The content type of the file
   * @returns The URL of the updated file
   */
  async updateFile(
    url: string,
    file: Buffer,
    contentType: string,
  ): Promise<string> {
    const key = this.getKeyFromUrl(url);
    if (!key) {
      throw new Error('Invalid S3 URL');
    }

    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: contentType,
      },
    });

    await upload.done();
    return this.getFileUrl(key);
  }

  /**
   * Deletes a file from S3
   * @param url The URL of the file to delete
   */
  async deleteFile(url: string): Promise<void> {
    const key = this.getKeyFromUrl(url);
    if (!key) {
      throw new Error('Invalid S3 URL');
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  /**
   * Gets a presigned URL for a file
   * @param key The key of the file
   * @returns The presigned URL
   */
  private async getFileUrl(key: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  /**
   * Generates a temporary public URL for direct file access
   * @param url The S3 URL of the file
   * @param expiresIn Time in seconds until the URL expires (default: 1 hour)
   * @returns A presigned URL for direct file access
   */
  async getTemporaryPublicUrl(
    url: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    const key = this.getKeyFromUrl(url);
    if (!key) {
      throw new Error('Invalid S3 URL');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }

  /**
   * Extracts the key from an S3 URL
   * @param url The S3 URL
   * @returns The key
   */
  private getKeyFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      return path.startsWith('/') ? path.slice(1) : path;
    } catch {
      return null;
    }
  }
}

export const s3StorageProvider = new S3StorageProvider();
