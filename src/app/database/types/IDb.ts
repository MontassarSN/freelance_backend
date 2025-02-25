import { KyselySessionEntity } from 'src/app/modules/sessions/infrastructure/entity';
import { KyselyUserEntity } from 'src/app/modules/users/infrastructure/entity';
import {
  KyselyNotificationEntity,
  KyselyUsersNotificationEntity,
} from 'src/app/modules/notification/infrastructure/entity';

export interface IDb {
  users: KyselyUserEntity;
  sessions: KyselySessionEntity;
  files: never;
  notifications: KyselyNotificationEntity;
  users_notifications: KyselyUsersNotificationEntity;
}
