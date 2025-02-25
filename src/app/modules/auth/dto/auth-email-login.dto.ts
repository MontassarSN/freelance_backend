import { IsEmail, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/app/shared/utils/lower-case.transformer';
import { TranslateDto } from 'src/app/shared/utils/TranslateDto';

export class AuthEmailLoginDto {
  @Transform(lowerCaseTransformer)
  @IsEmail(undefined, {
    message: TranslateDto('IsEmail'),
  })
  email!: string;

  @IsNotEmpty({
    message: TranslateDto('IsNotEmpty'),
  })
  password!: string;
}
