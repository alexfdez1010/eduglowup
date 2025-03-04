import { promisify } from 'util';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import tmp from 'tmp';

tmp.setGracefulCleanup();

export class FFmpegProvider {
  private static createTempFile(extension?: string): tmp.FileResult {
    return tmp.fileSync({
      postfix: extension ? `.${extension}` : undefined,
      keep: false,
    });
  }

  private static executeFFmpeg(
    inputPath: string,
    outputPath: string,
    options: string[],
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const command = ffmpeg(inputPath)
        .outputOptions(options)
        .on('end', resolve as any)
        .on('error', (err) => {
          console.error(err);
          reject(err);
        });

      if (process.env.NODE_ENV === 'development') {
        command.on('start', (commandLine) => {
          console.log('FFmpeg command:', commandLine);
        });
      }

      command.save(outputPath);
    });
  }

  public async convertToWebm720p(inputFile: File): Promise<File> {
    const tempInput = FFmpegProvider.createTempFile('webm');
    const tempOutput = FFmpegProvider.createTempFile('webm');

    try {
      const buffer = await inputFile.arrayBuffer();
      await fs.promises.writeFile(tempInput.name, Buffer.from(buffer));

      await FFmpegProvider.executeFFmpeg(tempInput.name, tempOutput.name, [
        '-c:v',
        'libvpx-vp9',
        '-c:a',
        'libopus',
        '-b:v',
        '2M',
        '-vf',
        'scale=-1:720',
        '-deadline',
        'good',
        '-cpu-used',
        '2',
      ]);

      const outputContent = await fs.promises.readFile(tempOutput.name);
      return new File(
        [outputContent],
        `${inputFile.name.split('.').slice(0, -1).join('.')}.webm`,
        { type: 'video/webm' },
      );
    } finally {
      // Clean up temp files
      tempInput.removeCallback();
      tempOutput.removeCallback();
    }
  }

  public async convertToMp3(inputFile: File): Promise<File> {
    const tempInput = FFmpegProvider.createTempFile('webm');
    const tempOutput = FFmpegProvider.createTempFile('mp3');

    try {
      const buffer = await inputFile.arrayBuffer();
      await fs.promises.writeFile(tempInput.name, Buffer.from(buffer));

      await FFmpegProvider.executeFFmpeg(tempInput.name, tempOutput.name, [
        '-vn',
        '-ar',
        '16000',
        '-ac',
        '1',
        '-map',
        '0:a',
      ]);

      const outputContent = await fs.promises.readFile(tempOutput.name);
      const outputFile = new File(
        [outputContent],
        `${inputFile.name.split('.').slice(0, -1).join('.')}.mp3`,
        { type: 'audio/mpeg' },
      );

      return outputFile;
    } finally {
      // Clean up temp files
      tempInput.removeCallback();
      tempOutput.removeCallback();
    }
  }
}

export const ffmpegProvider = new FFmpegProvider();
