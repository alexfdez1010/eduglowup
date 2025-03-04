import { describe, it, expect, beforeAll } from 'vitest';
import { FFmpegProvider } from '../../../lib/providers/ffmpeg-provider';
import fs from 'fs/promises';
import path from 'path';

describe('FFmpegProvider Integration Tests', () => {
  let ffmpegProvider: FFmpegProvider;
  let dummyVideoBuffer: Buffer;

  beforeAll(async () => {
    // Initialize the FFmpeg provider
    ffmpegProvider = new FFmpegProvider();

    // Read the dummy video
    const videoPath = path.join(
      process.cwd(),
      '__tests__',
      'integration',
      'ffmpeg',
      'dummy.webm',
    );
    dummyVideoBuffer = await fs.readFile(videoPath);
  });

  it('should convert video to WebM 720p', async () => {
    // Create a File object from the buffer
    const inputFile = new File([dummyVideoBuffer], 'dummy.webm', {
      type: 'video/webm',
    });

    // Convert to WebM
    const result = await ffmpegProvider.convertToWebm720p(inputFile);

    // Check if the result is a File object
    expect(result).toBeInstanceOf(File);
    expect(result.name).toBe('dummy.webm');
    expect(result.type).toBe('video/webm');

    // Check if the file has content
    const buffer = await result.arrayBuffer();
    expect(buffer.byteLength).toBeGreaterThan(0);
  });

  it('should convert video to MP3', async () => {
    // Create a File object from the buffer
    const inputFile = new File([dummyVideoBuffer], 'dummy.webm', {
      type: 'video/webm',
    });

    // Convert to MP3
    const result = await ffmpegProvider.convertToMp3(inputFile);

    // Check if the result is a File object
    expect(result).toBeInstanceOf(File);
    expect(result.name).toBe('dummy.mp3');
    expect(result.type).toBe('audio/mpeg');

    // Check if the file has content
    const buffer = await result.arrayBuffer();
    expect(buffer.byteLength).toBeGreaterThan(0);
  });

  it('should handle invalid input gracefully', async () => {
    // Create an empty file
    const inputFile = new File([], 'empty.webm', { type: 'video/webm' });

    // Attempt conversions and expect them to fail
    await expect(ffmpegProvider.convertToWebm720p(inputFile)).rejects.toThrow();
    await expect(ffmpegProvider.convertToMp3(inputFile)).rejects.toThrow();
  });
});
