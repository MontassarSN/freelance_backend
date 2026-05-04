import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';
import { NewJob } from '../infrastructure/entity';
import { JobLevelEnum, JobUrgencyEnum } from 'src/app/shared/types/enums.types';

export class CreateJobDto implements NewJob {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsString()
  category!: string;

  @IsOptional()
  @IsEnum(JobLevelEnum)
  level?: JobLevelEnum;

  @IsOptional()
  @IsEnum(JobUrgencyEnum)
  urgency?: JobUrgencyEnum;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsNotEmpty()
  @IsString()
  client_id!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images_urls?: string[];
}

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(JobLevelEnum)
  level?: JobLevelEnum;

  @IsOptional()
  @IsEnum(JobUrgencyEnum)
  urgency?: JobUrgencyEnum;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images_urls?: string[];
}
