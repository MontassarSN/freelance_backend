import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create.dto';
import { UpdateUser } from '../infrastructure/entity';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { TranslateDto } from 'src/app/shared/utils/TranslateDto';

export class UpdateUserDto
  extends PartialType(OmitType(CreateUserDto, ['social_id', 'provider']))
  implements UpdateUser {}
