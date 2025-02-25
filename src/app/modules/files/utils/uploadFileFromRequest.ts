import Busboy from 'busboy';
import { InternalServerErrorException } from '@nestjs/common';
import { Request } from 'express';
import { Readable } from 'stream';
import { CreateFileDto } from '../dto/CreateFileDto';
import { File } from '../domain/domain';

export default async function uploadFileFromRequest(
  req: Request,
  query: CreateFileDto,
  uploadFileStream: (
    fileStream: Readable,
    filename: string,
    mimeType: string,
    maxSize: number,
  ) => Promise<string>,
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    try {
      const busboy = Busboy({ headers: req.headers });
      let fileFound = false;

      busboy.on('file', async (name, fileStream, info) => {
        fileFound = true;
        try {
          if (!fileStream) {
            throw new Error('No file received');
          }

          new File({ file: { mimetype: info.mimeType }, query });

          const url = await uploadFileStream(
            fileStream,
            info.filename,
            info.mimeType,
            Number(query.maxSize),
          );

          resolve(url);
        } catch (err) {
          reject(err);
        }
      });

      busboy.on('error', (error: any) => {
        console.error('Error in busboy:', error);
        reject(error);
      });

      busboy.on('finish', () => {
        if (!fileFound) {
          console.error('No file received in the form data');
          reject(new Error('No file received'));
        } else {
          console.log('File upload processing finished');
        }
      });

      req.pipe(busboy);
    } catch (err) {
      console.error(err);
      reject(new InternalServerErrorException('Error processing file upload'));
    }
  });
}
