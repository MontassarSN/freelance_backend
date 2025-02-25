import { IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/app/shared/utils/lower-case.transformer';
import { TranslateDto } from 'src/app/shared/utils/TranslateDto';

export class AuthForgotPasswordDto {
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
}
