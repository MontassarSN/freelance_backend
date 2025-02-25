import {
  AuthProvidersEnum,
  AuthStatusEnum,
  NewUser,
  RolesEnum,
} from '../infrastructure/entity';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';
import { TranslateDto } from 'src/app/shared/utils/TranslateDto';

export class CreateUserDto implements NewUser {
  @IsEnum(RolesEnum, {
    message: TranslateDto('IsEnum'),
  })
  role!: RolesEnum;

  @IsEnum(AuthProvidersEnum, {
    message: TranslateDto('IsEnum'),
  })
  provider!: AuthProvidersEnum;

  @IsOptional()
  @ValidateIf((o) => o.social_id !== null)
  @IsNotEmpty({ message: TranslateDto('IsNotEmpty') })
  social_id?: string | null;

  @ValidateIf((o) => o.password !== null)
  @IsString({ message: TranslateDto('IsString') })
  @IsNotEmpty({ message: TranslateDto('IsNotEmpty') })
  password!: string | null;

  @IsOptional()
  @IsEnum(AuthStatusEnum, {
    message: TranslateDto('IsEnum'),
  })
  status!: AuthStatusEnum;

  @IsOptional()
  @ValidateIf((o) => o.avatar !== '')
  @IsUrl(undefined, { message: TranslateDto('IsUrl') })
  avatar?: string;

  @IsOptional()
  @IsString({ message: TranslateDto('IsString') })
  @IsNotEmpty({ message: TranslateDto('IsNotEmpty') })
  username?: string;

  @IsOptional()
  @IsPhoneNumber(undefined, { message: TranslateDto('IsPhoneNumber') })
  phone_number?: string;

  @IsOptional()
  @IsEmail({}, { message: TranslateDto('IsEmail') })
  email?: string;
}

export class DeleteUserDto {
  @IsString()
  @IsNotEmpty()
  password!: string;
}
