import { PickType } from '@nestjs/mapped-types';
import { QueryDtoWithPagination } from 'src/app/shared/dto/QueryDtoWithPagination.dto';
import { IQueryNotificationKeys } from '../infrastructure/entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { TranslateDto } from 'src/app/shared/utils/TranslateDto';

export class NotificationDto {
  token!: string;
  title!: string;
  body!: string;
  icon!: string;
}

export class MultipleDeviceNotificationDto extends PickType(NotificationDto, [
  'title',
  'body',
  'icon',
]) {
  tokens!: string[];
}

export class TopicNotificationDto extends PickType(NotificationDto, [
  'title',
  'body',
  'icon',
]) {
  topic!: string;
}

export class QueryNotificationDto extends QueryDtoWithPagination<IQueryNotificationKeys> {}

export class SubscribeToTopicDto {
  @IsString({
    message: TranslateDto('IsString'),
  })
  @IsNotEmpty({
    message: TranslateDto('IsNotEmpty'),
  })
  token!: string;
}
