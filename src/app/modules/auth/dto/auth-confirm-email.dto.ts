import { IsEmail, Length } from 'class-validator';
import { TranslateDto } from 'src/app/shared/utils/TranslateDto';

export class AuthConfirmEmailDto {
  @Length(4, 4, { message: TranslateDto('Length') })
  otp!: string;

  @IsEmail({}, { message: TranslateDto('IsEmail') })
  email!: string;
}
