import { registerAs } from '@nestjs/config';
import { IsString, IsUrl } from 'class-validator';
import { validateConfig } from 'src/app/shared/utils/validateConfig';
import { SmsConfig } from './types/sms-config.type';

class SmsEnvironmentVariables {
  @IsUrl()
  SMS_URL!: string;

  @IsString()
  SMS_KEY!: string;

  @IsString()
  SMS_SENDER!: string;

  @IsString()
  SMS_FUNCTION!: string;
}

export default registerAs<SmsConfig>('sms', () => {
  validateConfig(process.env, SmsEnvironmentVariables);

  return {
    url: process.env.SMS_URL as string,
    key: process.env.SMS_KEY as string,
    sender: process.env.SMS_SENDER as string,
    function: process.env.SMS_FUNCTION as string,
  };
});
