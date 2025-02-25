import { IsEmail, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/app/shared/utils/lower-case.transformer';
import { TranslateDto } from 'src/app/shared/utils/TranslateDto';
import { RolesEnum } from '../../users/infrastructure/entity';

export class AuthRegisterLoginDto {
  @Transform(lowerCaseTransformer)
  @IsEmail(
    {},
    {
      message: TranslateDto('IsEmail'),
    },
  )
  email!: string;

  @IsIn([RolesEnum.USER, RolesEnum.SELLER], {
    message: TranslateDto('IsIn'),
  })
  role!: RolesEnum;
}
