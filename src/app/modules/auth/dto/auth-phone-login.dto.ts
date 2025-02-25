import { IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { TranslateDto } from 'src/app/shared/utils/TranslateDto';

export class AuthPhoneLoginDto {
  @IsPhoneNumber(undefined, {
    message: TranslateDto('IsPhoneNumber'),
  })
  phone_number!: string;

  @IsNotEmpty({
    message: TranslateDto('IsNotEmpty'),
  })
  password!: string;
}
