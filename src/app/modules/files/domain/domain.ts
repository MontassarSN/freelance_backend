import { BadRequestException } from '@nestjs/common';
import { CreateFileDto } from '../dto/CreateFileDto';

export class File {
  readonly data: { mimetype: string } | undefined;
  readonly query: CreateFileDto;
  readonly allowedMaxSize?: number;
  constructor({
    file,
    query,
    allowedMaxSize,
  }: {
    file: { mimetype: string } | undefined;
    query: CreateFileDto;
    allowedMaxSize?: number;
  }) {
    this.data = file;
    this.query = query;
    this.allowedMaxSize = allowedMaxSize;
    this.validateFile();
  }
  private validateFile(): void {
    if (!this.data) {
      throw new BadRequestException('File upload failed');
    }
    //   const fileType = this.data.mimetype.split('/')[1];
    //   if (this.query.type !== fileType) {
    //     throw new BadRequestException(
    //       `File type is ${fileType},but you requested ${this.query.type}. Please request the correct file type.`,
    //     );
    //   }
    //
  }
}
