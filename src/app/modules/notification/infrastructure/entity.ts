import { GeneratedAlways, Insertable, Selectable, Updateable } from 'kysely';
import { I18nTranslations } from 'src/generated/i18n.generated';

export interface KyselyNotificationEntity {
  id: GeneratedAlways<string>;
  title: keyof I18nTranslations['notifications'];
  body: keyof I18nTranslations['notifications'];
  icon_url: string;
  created_at: GeneratedAlways<Date>;
}

export interface KyselyUsersNotificationEntity {
  user_id: string;
  notification_id: string;
}

export type NotificationEntity = Selectable<KyselyNotificationEntity>;
export type NewNotification = Insertable<KyselyNotificationEntity>;
export type UpdateNotification = Updateable<KyselyNotificationEntity>;
export type IQueryNotificationKeys =
  `notifications.${keyof KyselyNotificationEntity}`;
