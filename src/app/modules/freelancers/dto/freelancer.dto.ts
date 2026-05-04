import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsEnum,
  IsPositive,
} from 'class-validator';
import { NewFreelancer } from '../infrastructure/entity';
import { AvailabilityEnum } from 'src/app/shared/types/enums.types';

export class CreateFreelancerDto implements NewFreelancer {
  @IsNotEmpty()
  @IsString()
  user_id!: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  hourlyRate?: bigint;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsEnum(AvailabilityEnum)
  availability?: AvailabilityEnum;
}

export class UpdateFreelancerDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  hourlyRate?: bigint;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsEnum(AvailabilityEnum)
  availability?: AvailabilityEnum;
}
