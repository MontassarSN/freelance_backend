import { IsPhoneNumber, Length } from 'class-validator';
import { TranslateDto } from 'src/app/shared/utils/TranslateDto';

export class AuthConfirmPhoneDto {
  @IsPhoneNumber(undefined, {
    message: TranslateDto('IsPhoneNumber'),
  })
  phone_number!: string;

  @Length(4, 4, { message: TranslateDto('Length') })
  otp!: string;
}
