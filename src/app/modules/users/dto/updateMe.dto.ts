import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create.dto';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Validate,
} from 'class-validator';
import { TranslateDto } from 'src/app/shared/utils/TranslateDto';

export class UpdateMeDto extends PartialType(
  OmitType(CreateUserDto, [
    'social_id',
    'provider',
    'email',
    'phone_number',
    'role',
    'status',
  ]),
) {
  @IsOptional()
  @IsString({ message: TranslateDto('IsString') })
  @IsNotEmpty({
    message: TranslateDto('IsNotEmpty'),
  })
  @Validate((o: any) => o.password === o.confirm_password, {
    message: TranslateDto('MatchPassword'),
  })
  confirm_password!: string;
}
