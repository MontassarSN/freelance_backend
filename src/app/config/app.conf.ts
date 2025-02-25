import 'dotenv/config';
import { IsString, IsNotEmpty, IsPositive } from 'class-validator';
import { registerAs } from '@nestjs/config';
import { AppConfig } from './types/app-config.type';
import { Transform } from 'class-transformer';
import { validateConfig } from '../shared/utils/validateConfig';
import path from 'path';
class EnvironmentVariablesValidator {
  @IsNotEmpty()
  APP_FALLBACK_LANGUAGE!: string;

  @IsNotEmpty()
  APP_HEADER_LANGUAGE!: string;

  @IsNotEmpty()
  FRONTEND_URL!: string;

  @IsNotEmpty()
  DATABASE_USERNAME!: string;

  @IsNotEmpty()
  DATABASE_PASSWORD!: string;

  @IsNotEmpty()
  DATABASE_NAME!: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsPositive()
  DATABASE_POOL_MAX!: number;

  @IsNotEmpty()
  DATABASE_HOST!: string;

  @IsNotEmpty()
  API_URL!: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsPositive()
  API_PORT!: string;

  @IsString()
  @IsNotEmpty()
  APP_NAME!: string;

  @IsString()
  @IsNotEmpty()
  FIREBASE_PROJECT_ID!: string;

  @IsString()
  @IsNotEmpty()
  FIREBASE_CLIENT_EMAIL!: string;

  @IsString()
  @IsNotEmpty()
  FIREBASE_PRIVATE_KEY!: string;
}

export default registerAs<AppConfig>('app', (): AppConfig => {
  validateConfig(process.env, EnvironmentVariablesValidator);
  return {
    fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE as string,
    headerLanguage: process.env.APP_HEADER_LANGUAGE as string,
    frontendUrl: process.env.FRONTEND_URL as string,
    apiUrl: process.env.API_URL as string,
    apiPort: parseInt(process.env.API_PORT as string, 10),
    dbPoolMax: parseInt(process.env.DATABASE_POOL_MAX as string, 10),
    dbName: process.env.DATABASE_NAME as string,
    dbPassword: process.env.DATABASE_PASSWORD as string,
    dbHost: process.env.DATABASE_HOST as string,
    dbUsername: process.env.DATABASE_USERNAME as string,
    name: process.env.APP_NAME as string,
    filesDir: path.resolve(process.cwd(), 'public'),
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID as string,
    firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
    firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(
      /\\n/g,
      '\n',
    ) as string,
  };
});
