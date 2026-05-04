import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { NewClient } from '../infrastructure/entity';

export class CreateClientDto implements NewClient {
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
  @IsBoolean()
  verified?: boolean;
}

export class UpdateClientDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsBoolean()
  verified?: boolean;
}
