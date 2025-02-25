import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { validateConfig } from 'src/app/shared/utils/validateConfig';
import { StringValue } from 'ms';
import { AuthConfig } from './types/auth-config.type';

class EnvironmentVariablesValidator {
  @IsNotEmpty()
  AUTH_JWT_SECRET!: string;

  @IsNotEmpty()
  AUTH_JWT_TOKEN_EXPIRES_IN!: StringValue;

  @IsNotEmpty()
  AUTH_REFRESH_SECRET!: string;

  @IsNotEmpty()
  AUTH_REFRESH_TOKEN_EXPIRES_IN!: StringValue;

  @IsNotEmpty()
  AUTH_FORGOT_SECRET!: string;

  @IsNotEmpty()
  AUTH_FORGOT_TOKEN_EXPIRES_IN!: StringValue;

  @IsNotEmpty()
  AUTH_CONFIRM_EMAIL_SECRET!: string;

  @IsNotEmpty()
  AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN!: StringValue;

  @IsNotEmpty()
  GOOGLE_CLIENT_ID!: string;

  @IsOptional()
  @IsNotEmpty()
  GOOGLE_CLIENT_SECRET?: string;

  @IsNotEmpty()
  GOOGLE_CALLBACK_URL!: string;

  @IsNotEmpty()
  FACEBOOK_APP_ID!: string;

  @IsNotEmpty()
  FACEBOOK_APP_SECRET!: string;

  @IsNotEmpty()
  FACEBOOK_CALLBACK_URL!: string;

  @IsNotEmpty()
  LINKEDIN_CLIENT_ID!: string;

  @IsNotEmpty()
  LINKEDIN_CLIENT_SECRET!: string;

  @IsNotEmpty()
  LINKEDIN_CALLBACK_URL!: string;
}

export default registerAs<AuthConfig>('auth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    secret: process.env.AUTH_JWT_SECRET as string,
    expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN as StringValue,
    refreshSecret: process.env.AUTH_REFRESH_SECRET as string,
    refreshExpires: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN as StringValue,
    forgotSecret: process.env.AUTH_FORGOT_SECRET as string,
    forgotExpires: process.env.AUTH_FORGOT_TOKEN_EXPIRES_IN as StringValue,
    confirmEmailSecret: process.env.AUTH_CONFIRM_EMAIL_SECRET as string,
    confirmEmailExpires: process.env
      .AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN as StringValue,
    saltRounds: 10,
    googleClientID: process.env.GOOGLE_CLIENT_ID as string,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET as string | undefined,
    googleCallbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    facebookAppID: process.env.FACEBOOK_APP_ID as string,
    facebookAppSecret: process.env.FACEBOOK_APP_SECRET as string,
    facebookCallbackURL: process.env.FACEBOOK_CALLBACK_URL as string,
    linkedinClientID: process.env.LINKEDIN_CLIENT_ID as string,
    linkedinClientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
    linkedinCallbackURL: process.env.LINKEDIN_CALLBACK_URL as string,
  };
});
