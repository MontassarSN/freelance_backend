import {
  ColumnType,
  GeneratedAlways,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';

export interface KyselySessionEntity {
  id: GeneratedAlways<string>;
  user_id: string;
  hash: string;
  active: boolean;
  created_at: GeneratedAlways<Date>;
  updated_at: ColumnType<Date, never, Date>;
}

export type SessionEntity = Selectable<KyselySessionEntity>;
export type NewSession = Insertable<KyselySessionEntity>;
export type UpdateSession = Updateable<KyselySessionEntity>;
export type IQuerySessionKeys = `sessions.${keyof KyselySessionEntity}`;
