import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { NotificationsRepository } from './infrastructure/repository';
import { InfinityPaginationResultType } from 'src/app/shared/types/InfinityPaginationResultType';
import { NewNotification, NotificationEntity } from './infrastructure/entity';
import { ERRORS } from 'src/assets/constants/errors';
import { AllConfigType } from 'src/app/config/types/config.type';
import { ConfigService } from '@nestjs/config';
import { QueryNotificationDto } from './dto/dto';
import { FirebaseService } from './firebase.service';
import { LangEnum } from 'src/app/shared/types/enums.types';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly repository: NotificationsRepository,
    private readonly firebaseService: FirebaseService,
    private readonly I18n: I18nService<I18nTranslations>,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async findUserNotifications({
    query,
    user_id,
  }: {
    query: QueryNotificationDto;
    user_id: string;
  }): Promise<InfinityPaginationResultType<NotificationEntity>> {
    return this.repository.findUserNotifications({ query, user_id });
  }

  async findOne({ id }: { id: string }): Promise<NotificationEntity> {
    const user = await this.repository.findOne({ id });
    if (user === null) {
      throw new NotFoundException(ERRORS('Notification not found'));
    }
    return user;
  }

  async notifyUsers({
    payload,
  }: {
    payload: {
      notification: NewNotification;
      users: { id: string; lang: LangEnum }[];
    }[];
  }): Promise<NotificationEntity[]> {
    const createdEntities = await this.repository.createMany(
      payload.map(({ notification }) => notification),
    );
    if (createdEntities.length != payload.length) {
      throw new InternalServerErrorException(ERRORS('Unexpected error!'));
    }

    await this.createManyUserNotifications(
      createdEntities.map((notification, index) => ({
        notification,
        users: payload[index].users,
      })),
    );

    return createdEntities;
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.repository.deleteMany({ ids });
  }

  async createManyUserNotifications(
    payload: {
      users: {
        id: string;
        lang: LangEnum;
      }[];
      notification: NotificationEntity;
    }[],
  ): Promise<void> {
    await Promise.all([
      await this.repository.createManyUserNotifications(
        payload.flatMap((item) =>
          item.users.map((user) => ({
            user_id: user.id,
            notification_id: item.notification.id,
          })),
        ),
      ),
      ...payload.flatMap((item) =>
        item.users.map((user) =>
          this.firebaseService.sendTopicNotification({
            topic: user.id,
            title: this.I18n.t(`notifications.${item.notification.title}`, {
              lang: user.lang,
            }),
            body: this.I18n.t(`notifications.${item.notification.body}`, {
              lang: user.lang,
            }),
            icon: item.notification.icon_url,
          }),
        ),
      ),
    ]);
  }
}
