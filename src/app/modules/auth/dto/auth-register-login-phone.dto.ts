import { IsIn, IsPhoneNumber } from 'class-validator';
import { TranslateDto } from 'src/app/shared/utils/TranslateDto';
import { RolesEnum } from '../../users/infrastructure/entity';

export class AuthRegisterLoginPhoneDto {
  @IsPhoneNumber(undefined, {
    message: TranslateDto('IsPhoneNumber'),
  })
  phone_number!: string;

  @IsIn([RolesEnum.USER, RolesEnum.SELLER], {
    message: TranslateDto('IsIn'),
  })
  role!: RolesEnum;
}
