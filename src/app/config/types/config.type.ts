import { AuthConfig } from 'src/app/config/types/auth-config.type';
import { AppConfig } from './app-config.type';
import { MailConfig } from './mail-config.type';
import { SmsConfig } from './sms-config.type';
import { DbxConfig } from './dbx-config.types';

export type AllConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  mail: MailConfig;
  sms: SmsConfig;
  dbx: DbxConfig;
};
