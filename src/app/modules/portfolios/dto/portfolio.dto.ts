import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';
import { NewPortfolio } from '../infrastructure/entity';

export class CreatePortfolioDto implements NewPortfolio {
  @IsNotEmpty()
  @IsString()
  user_id!: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  image_url?: string;

  @IsNotEmpty()
  @IsUrl()
  link!: string;
}

export class UpdatePortfolioDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  image_url?: string;

  @IsOptional()
  @IsUrl()
  link?: string;
}
