import 'dotenv/config';
import { registerAs } from '@nestjs/config';
import { DbxConfig } from './types/dbx-config.types';
// class EnvironmentVariablesValidator {
//   @IsString()
//   @IsNotEmpty()
//   DROPBOX_APP_KEY!: string;
//   @IsString()
//   @IsNotEmpty()
//   DROPBOX_APP_SECRET!: string;
//   @IsString()
//   @IsNotEmpty()
//   DROPBOX_REFRESH_TOKEN!: string;
//   @IsString()
//   @IsNotEmpty()
//   DROPBOX_FOLDER!: string;
// }

export default registerAs<DbxConfig>('dbx', (): DbxConfig => {
  // validateConfig(process.env, EnvironmentVariablesValidator);
  return {
    dbxKey: process.env.DROPBOX_APP_KEY as string,
    dbxSecret: process.env.DROPBOX_APP_SECRET as string,
    dbxRefreshToken: process.env.DROPBOX_REFRESH_TOKEN as string,
    dbxFolder: process.env.DROPBOX_FOLDER as string,
  };
});
