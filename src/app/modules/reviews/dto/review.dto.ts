import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateClientReviewDto {
  @IsNotEmpty()
  @IsString()
  job_id!: string;

  @IsNotEmpty()
  @IsString()
  reviewer_id!: string;

  @IsNotEmpty()
  @IsString()
  client_id!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

export class CreateFreelancerReviewDto {
  @IsNotEmpty()
  @IsString()
  job_id!: string;

  @IsNotEmpty()
  @IsString()
  reviewer_id!: string;

  @IsNotEmpty()
  @IsString()
  freelancer_id!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

export class UpdateClientReviewDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

export class UpdateFreelancerReviewDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
