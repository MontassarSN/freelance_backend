import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsPhoneNumber, Length } from 'class-validator';
import { lowerCaseTransformer } from 'src/app/shared/utils/lower-case.transformer';
import { TranslateDto } from 'src/app/shared/utils/TranslateDto';

export class AuthOtpLoginDto {
  @IsOptional()
  @Transform(lowerCaseTransformer)
  @IsEmail(
    {},
    {
      message: TranslateDto('IsEmail'),
    },
  )
  email?: string;

  @IsOptional()
  @IsPhoneNumber(undefined, {
    message: TranslateDto('IsPhoneNumber'),
  })
  phone_number?: string;

  @Length(4, 4, { message: TranslateDto('Length') })
  otp!: string;
}
