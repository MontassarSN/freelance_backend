import { IsNotEmpty } from 'class-validator';
import { TranslateDto } from 'src/app/shared/utils/TranslateDto';

export class AuthGoogleLoginDto {
  @IsNotEmpty({
    message: TranslateDto('IsNotEmpty'),
  })
  idToken!: string;
}
