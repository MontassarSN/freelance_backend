import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import http from 'http';
import https from 'https';
import renameFile from '../utils/renameFile';
import { AllConfigType } from 'src/app/config/types/config.type';

const axiosInstance = axios.create({
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
});
@Injectable()
export class DropboxService {
  CHUNK_SIZE_IN_BYTES = 100 * 1024 * 1024;

  constructor(private readonly configService: ConfigService<AllConfigType>) {}
  async refreshTokensDropbox() {
    try {
      const dbxRefreshToken = this.configService.getOrThrow(
        'dbx.dbxRefreshToken',
        {
          infer: true,
        },
      );
      const dbxApiKey = this.configService.getOrThrow('dbx.dbxKey', {
        infer: true,
      });
      const dbxApiSecret = this.configService.getOrThrow('dbx.dbxSecret', {
        infer: true,
      });
      const accessToken = Buffer.from(`${dbxApiKey}:${dbxApiSecret}`).toString(
        'base64',
      );
      const response = await axiosInstance.post(
        `https://api.dropboxapi.com/oauth2/token?grant_type=refresh_token&refresh_token=${dbxRefreshToken}`,
        null,
        {
          headers: {
            Authorization: `Basic ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      return response.data.access_token;
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException(
        'There was a problem refreshing the tokens',
      );
    }
  }

  async uploadFileStreamToDropbox(
    fileStream: Readable,
    filename: string,
    mimetype: string,
    maxSize?: number,
  ): Promise<string> {
    try {
      const fileName = renameFile({
        originalName: filename,
        fileType: mimetype.split('/')[1],
      });
      const dbxAccessToken = await this.refreshTokensDropbox();

      const dbxFolder = this.configService.getOrThrow('dbx.dbxFolder', {
        infer: true,
      });

      // Step 1: Start an upload session
      const startSessionResponse = await axiosInstance.post(
        'https://content.dropboxapi.com/2/files/upload_session/start',
        Buffer.alloc(0), // Empty buffer to start the session
        {
          headers: {
            Authorization: `Bearer ${dbxAccessToken}`,
            'Content-Type': 'application/octet-stream',
          },
        },
      );
      const sessionId = startSessionResponse.data.session_id;

      let cursor = 0;
      const MAX_CHUNK_SIZE = this.CHUNK_SIZE_IN_BYTES;
      let accumulatedChunks: Buffer[] = [];
      let accumulatedSize = 0;

      for await (const chunk of fileStream) {
        const chunkBuffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        accumulatedChunks.push(chunkBuffer);
        accumulatedSize += chunkBuffer.length;

        if (maxSize && accumulatedSize > maxSize) {
          throw new Error('File size exceeds the maximum allowed size');
        }

        if (accumulatedSize >= MAX_CHUNK_SIZE) {
          const combinedBuffer = Buffer.concat(
            accumulatedChunks,
            accumulatedSize,
          );

          await this.uploadChunk(
            combinedBuffer,
            sessionId,
            cursor,
            dbxAccessToken,
          );
          Logger.log(
            `Uploaded chunk at cursor position: ${cursor}, size: ${accumulatedSize} bytes`,
          );
          cursor += combinedBuffer.length;

          // Reset accumulators
          accumulatedChunks = [];
          accumulatedSize = 0;
        }
      }

      // Upload any remaining data
      if (accumulatedSize > 0) {
        const combinedBuffer = Buffer.concat(
          accumulatedChunks,
          accumulatedSize,
        );

        await this.uploadChunk(
          combinedBuffer,
          sessionId,
          cursor,
          dbxAccessToken,
        );
        Logger.log(
          `Uploaded final chunk at cursor position: ${cursor}, size: ${accumulatedSize} bytes`,
        );
        cursor += combinedBuffer.length;
      }

      // Finish the upload session
      const dbxPath = `/${dbxFolder}/${fileName.replace(/[\u007F-\uFFFF]/g, '')}`;
      Logger.log('🚀 ~ DropboxService ~ uploadFile ~ dbxPath:' + dbxPath);
      const dbxArgsPayload = {
        cursor: {
          session_id: sessionId,
          offset: cursor,
        },
        commit: {
          path: dbxPath,
          mode: 'add',
          autorename: true,
          mute: false,
        },
      };
      await axiosInstance.post(
        'https://content.dropboxapi.com/2/files/upload_session/finish',
        null,
        {
          headers: {
            Authorization: `Bearer ${dbxAccessToken}`,
            'Content-Type': 'application/octet-stream',
            'Dropbox-API-Arg': JSON.stringify(dbxArgsPayload),
          },
        },
      );
      Logger.log('🚀 ~ upload finish');

      const getRequest = await axiosInstance.post(
        'https://api.dropboxapi.com/2/sharing/create_shared_link',
        {
          path: dbxPath,
        },
        {
          headers: {
            Authorization: `Bearer ${dbxAccessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const newUrl = getRequest.data.url.replace('dl=0', 'raw=1');
      Logger.log('🚀 ~ DropboxService ~ uploadFile ~ newUrl:' + newUrl);
      return newUrl;
    } catch (err) {
      console.log(
        '🚀 ~ DropboxService ~ uploadFileStreamToDropbox ~ err:' + err,
      );
      if (axios.isAxiosError(err)) {
        Logger.error(err.response?.data);
      }
      Logger.error('File Upload failed :', err);
      throw new InternalServerErrorException(
        'There was a problem uploading the file',
      );
    }
  }

  async uploadChunk(
    chunkBuffer: Buffer,
    sessionId: string,
    cursor: number,
    dbxAccessToken: string,
  ) {
    let attempts = 0;
    const maxRetries = 3;
    while (attempts < maxRetries) {
      try {
        await axiosInstance.post(
          'https://content.dropboxapi.com/2/files/upload_session/append_v2',
          chunkBuffer,
          {
            headers: {
              Authorization: `Bearer ${dbxAccessToken}`,
              'Content-Type': 'application/octet-stream',
              'Dropbox-API-Arg': JSON.stringify({
                cursor: { session_id: sessionId, offset: cursor },
                close: false,
              }),
            },
          },
        );
        return;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          Logger.error(err.response?.data);
        } else {
          Logger.log('Error uploading chunk:' + (err as Error).message);
        }
        Logger.log('Retrying...');
        attempts++;
        if (attempts === maxRetries)
          throw new Error('Failed to upload chunk after multiple attempts');
      }
    }
  }
}
