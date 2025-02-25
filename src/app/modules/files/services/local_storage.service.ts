import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import path from 'path';
import fs, { createWriteStream } from 'fs';
import { FileDownloadReturnType } from '../types/types';
import { ConfigService } from '@nestjs/config';
import renameFile from '../utils/renameFile';
import { AllConfigType } from 'src/app/config/types/config.type';

@Injectable()
export class LocalStorageService {
  CHUNK_SIZE_IN_BYTES = 8 * 1024 * 1024;

  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  downloadFile({
    filePath,
    fileSizeInBytes,
    fileMimeType,
  }: {
    filePath: string;
    fileSizeInBytes: number;
    fileMimeType: string;
  }): FileDownloadReturnType {
    const headers = {
      'Content-Type': fileMimeType,
      'Content-Length': fileSizeInBytes,
      'Cross-Origin-Resource-Policy': 'cross-origin',
    };
    const fileStream = fs.createReadStream(filePath);
    return { headers, fileStream };
  }

  downloadVideo({
    filePath,
    fileSizeInBytes,
    fileMimeType,
    range,
  }: {
    filePath: string;
    fileSizeInBytes: number;
    fileMimeType: string;
    range: string;
  }): FileDownloadReturnType {
    const chunkStart = Number(range?.replace(/\D/g, '') ?? 1);
    const chunkEnd = Math.min(
      chunkStart + this.CHUNK_SIZE_IN_BYTES,
      fileSizeInBytes - 1,
    );
    const contentLength = chunkEnd - chunkStart + 1;

    const headers = {
      'Content-Range': `bytes ${chunkStart}-${chunkEnd}/${fileSizeInBytes}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': fileMimeType,
      'Cross-Origin-Resource-Policy': 'cross-origin',
    };

    const fileStream = fs.createReadStream(filePath, {
      start: chunkStart,
      end: chunkEnd,
    });
    return { headers, fileStream };
  }

  async uploadFile(fileData: any): Promise<{
    fileUrl: string;
    filename: string;
  }> {
    try {
      const [originalFilename, fileType] = [
        fileData.originalname,
        fileData.mimetype.split('/')[1],
      ];
      const filename = renameFile({ originalName: originalFilename, fileType });
      fileData.filename = filename;
      await this.saveFileToStorage(fileData, filename);
      const base_url = this.configService.getOrThrow('app.apiUrl', {
        infer: true,
      });
      const fileUrl = `${base_url}/api/files/${filename}`;
      return { fileUrl, filename };
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async saveFileToStorage(file: any, filename: string): Promise<string> {
    try {
      const filesDir = this.configService.getOrThrow('app.filesDir', {
        infer: true,
      });
      const filePath = path.join(filesDir, filename);
      await fs.promises.mkdir(filesDir, { recursive: true });
      const writeStream = createWriteStream(filePath);
      writeStream.write(file.buffer);
      writeStream.end();
      Logger.debug('Saving... to:', filePath);
      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });
      Logger.debug('File saved to:', filePath);
      return filePath;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async deleteFile(filename: string): Promise<void> {
    try {
      const filesDir = this.configService.getOrThrow('app.filesDir', {
        infer: true,
      });
      const filePath = path.join(filesDir, filename);
      await fs.promises.unlink(filePath);
    } catch (error) {
      Logger.error(
        `Failed to delete file: ${filename}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
