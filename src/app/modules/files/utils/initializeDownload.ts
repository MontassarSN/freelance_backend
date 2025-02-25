import { BadRequestException, Logger } from '@nestjs/common';
import path from 'path';
import mime from 'mime-types';
import fs from 'fs';

export default function initializeDownload({
  fileName,
  filesDir,
}: {
  fileName: string;
  filesDir: string;
}): {
  filePath: string;
  fileSizeInBytes: number;
  fileMimeType: string;
} {
  const filePath = path.resolve(filesDir, fileName);
  let fileSizeInBytes = 0;
  try {
    fileSizeInBytes = fs.statSync(filePath).size;
  } catch (err) {
    Logger.error(`File not found: ${err}`);
    throw new BadRequestException('File not found');
  }
  const fileMimeType = mime.lookup(filePath) || 'application/octet-stream';
  return {
    filePath,
    fileSizeInBytes,
    fileMimeType,
  };
}
