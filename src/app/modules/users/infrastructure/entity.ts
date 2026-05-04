import {
  ColumnType,
  GeneratedAlways,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';
import { LangEnum, UserRoleEnum } from 'src/app/shared/types/enums.types';
export enum AuthStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum VerificationStatusEnum {
  VERIFIED = 'verified',
  UNVERIFIED = 'unverified',
}

export enum AuthProvidersEnum {
  EMAIL = 'email',
  PHONE = 'phone',
  FACEBOOK = 'fb',
  GOOGLE = 'google',
  LINKEDIN = 'linkedin',
}
export interface KyselyUserEntity {
  id: GeneratedAlways<string>;
  //Auth related stuff
  role: ColumnType<UserRoleEnum, UserRoleEnum | undefined, UserRoleEnum>;
  provider: ColumnType<AuthProvidersEnum, AuthProvidersEnum, never>;
  social_id: ColumnType<string | null, string | null | undefined, never>;

  status: AuthStatusEnum;
  password: string | null;
  temp_password: ColumnType<string | null, string | null | undefined, never>;

  // User related stuff
  name: ColumnType<string, string | undefined, string>;
  default_language: ColumnType<LangEnum, LangEnum | undefined, LangEnum>;
  phone_number: ColumnType<string | null, string | undefined | null, never>;
  email: ColumnType<string | null, string | null, never>;
  avatar: ColumnType<string, string | undefined, string>;
  avatar_url: ColumnType<string, string | undefined, string>;
  username: ColumnType<string, string | undefined, string>;
  verified: ColumnType<boolean, boolean | undefined, boolean>;

  // Timestamps
  created_at: GeneratedAlways<Date>;
  updated_at: ColumnType<Date, never, Date>;
}

export type UserEntity = Selectable<KyselyUserEntity>;
export type NewUser = Insertable<KyselyUserEntity>;
export type UpdateUser = Updateable<KyselyUserEntity>;
export type IQueryUserKeys = `users.${keyof KyselyUserEntity}`;
