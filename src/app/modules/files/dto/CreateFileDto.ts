import { Injectable } from '@nestjs/common';
import { IsNumber, IsPositive, IsIn, IsOptional } from 'class-validator';
import { fileType } from '../types/types';
import { Transform } from 'class-transformer';
import { TranslateDto } from 'src/app/shared/utils/TranslateDto';

export const allowedFileTypes = [
  'jpg',
  'mp4',
  'jpeg',
  'png',
  'pdf',
  'zip',
] as const;

@Injectable()
export class CreateFileDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber(undefined, {
    message: TranslateDto('IsNumber'),
  })
  @IsPositive({
    message: TranslateDto('IsPositive'),
  })
  maxSize?: number;

  @IsIn(allowedFileTypes, {
    message: TranslateDto('IsIn'),
  })
  type!: fileType;

  file!: any;
}
