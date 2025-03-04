import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  s3StorageProvider,
  S3StorageProvider,
} from '../../../lib/providers/s3-storage';
import fs from 'fs/promises';
import path from 'path';

describe('S3StorageProvider Integration Tests', () => {
  let s3Provider: S3StorageProvider;
  let imageBuffer: Buffer;
  let uploadedFileUrl: string;

  beforeAll(async () => {
    // Initialize the S3 provider
    s3Provider = s3StorageProvider;

    // Read the test image
    const imagePath = path.join(
      process.cwd(),
      'public',
      'images',
      'members',
      'alejandro.webp',
    );
    imageBuffer = await fs.readFile(imagePath);
  });

  it('should upload a file successfully', async () => {
    const key = `test/alejandro-${Date.now()}.webp`;
    uploadedFileUrl = await s3Provider.uploadFile(
      imageBuffer,
      key,
      'image/webp',
    );

    expect(uploadedFileUrl).toBeDefined();
    expect(uploadedFileUrl).toContain(key);
  }, 10000);

  it('should generate a temporary public URL', async () => {
    const publicUrl = await s3Provider.getTemporaryPublicUrl(uploadedFileUrl);

    expect(publicUrl).toBeDefined();
    expect(publicUrl).toContain(process.env.AWS_S3_BUCKET);

    // Verify the URL is accessible
    const response = await fetch(publicUrl);
    expect(response.ok).toBe(true);
    expect(response.headers.get('content-type')).toBe('image/webp');
  }, 10000);

  it('should update an existing file', async () => {
    const updatedUrl = await s3Provider.updateFile(
      uploadedFileUrl,
      imageBuffer,
      'image/webp',
    );

    expect(updatedUrl).toBeDefined();
    expect(updatedUrl).toContain(process.env.AWS_S3_BUCKET);

    // Verify the updated file is accessible
    const publicUrl = await s3Provider.getTemporaryPublicUrl(updatedUrl);
    const response = await fetch(publicUrl);
    expect(response.ok).toBe(true);
  }, 10000);

  afterAll(async () => {
    // Clean up: delete the test file
    if (uploadedFileUrl) {
      await s3Provider.deleteFile(uploadedFileUrl);

      // Verify the file was deleted
      try {
        await s3Provider.getTemporaryPublicUrl(uploadedFileUrl);
        throw new Error('File should have been deleted');
      } catch (error) {
        expect(error).toBeDefined();
      }
    }
  });
});
