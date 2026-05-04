import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { BudgetTypeEnum } from 'src/app/shared/types/enums.types';

export class CreateJobBudgetDto {
  @IsNotEmpty()
  @IsString()
  job_id!: string;

  @IsNotEmpty()
  @IsNumber()
  min!: bigint;

  @IsNotEmpty()
  @IsNumber()
  max!: bigint;

  @IsOptional()
  @IsEnum(BudgetTypeEnum)
  type?: BudgetTypeEnum;
}

export class UpdateJobBudgetDto {
  @IsOptional()
  @IsNumber()
  min?: bigint;

  @IsOptional()
  @IsNumber()
  max?: bigint;

  @IsOptional()
  @IsEnum(BudgetTypeEnum)
  type?: BudgetTypeEnum;
}
