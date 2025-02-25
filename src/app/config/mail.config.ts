import { registerAs } from '@nestjs/config';
import {
  IsOptional,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';
import { validateConfig } from '../shared/utils/validateConfig';
import { MailConfig } from './types/mail-config.type';
import { Transform } from 'class-transformer';

class EnvironmentVariablesValidator {
  @Transform(({ value }) => parseInt(value, 10))
  @IsPositive()
  MAIL_PORT!: number;

  @IsNotEmpty()
  MAIL_HOST!: string;

  @IsOptional()
  @IsNotEmpty()
  MAIL_USER?: string;

  @IsOptional()
  @IsNotEmpty()
  MAIL_PASSWORD?: string;

  @IsEmail()
  MAIL_DEFAULT_EMAIL!: string;

  @IsNotEmpty()
  MAIL_DEFAULT_NAME!: string;

  @IsBoolean()
  MAIL_IGNORE_TLS!: boolean;

  @IsBoolean()
  MAIL_SECURE!: boolean;

  @IsBoolean()
  MAIL_REQUIRE_TLS!: boolean;
}

export default registerAs<MailConfig>('mail', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    port: parseInt(process.env.MAIL_PORT as string, 10),
    host: process.env.MAIL_HOST,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    defaultEmail: process.env.MAIL_DEFAULT_EMAIL,
    defaultName: process.env.MAIL_DEFAULT_NAME,
    ignoreTLS: process.env.MAIL_IGNORE_TLS === 'true',
    secure: process.env.MAIL_SECURE === 'true',
    requireTLS: process.env.MAIL_REQUIRE_TLS === 'true',
  };
});
