import fs from 'fs';
import { allowedFileTypes } from '../dto/CreateFileDto';

export type FileDownloadReturnType = {
  headers: {
    'Content-Range'?: string;
    'Accept-Ranges'?: string;
    'Content-Length': number;
    'Content-Type': string;
    'Cross-Origin-Resource-Policy': string;
  };
  fileStream: fs.ReadStream;
};

export type fileType = (typeof allowedFileTypes)[number];
