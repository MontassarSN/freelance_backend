import {
  ColumnType,
  GeneratedAlways,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';

export interface KyselyClientEntity {
  user_id: string;
  title: ColumnType<string, string | undefined, string>;
  bio: ColumnType<string, string | undefined, string>;
  verified: ColumnType<boolean, boolean | undefined, boolean>;
}

export type ClientEntity = Selectable<KyselyClientEntity>;
export type NewClient = Insertable<KyselyClientEntity>;
export type UpdateClient = Updateable<KyselyClientEntity>;
