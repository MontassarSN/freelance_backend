import {
  ColumnType,
  GeneratedAlways,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';
import { JobLevelEnum, JobUrgencyEnum } from 'src/app/shared/types/enums.types';

export interface KyselyJobEntity {
  id: GeneratedAlways<string>;
  postedDate: GeneratedAlways<Date>;
  title: ColumnType<string, string | undefined, string>;
  description: ColumnType<string, string | undefined, string>;
  category: ColumnType<string, string | undefined, string>;
  level: ColumnType<JobLevelEnum, JobLevelEnum | undefined, JobLevelEnum>;
  urgency: ColumnType<JobUrgencyEnum, JobUrgencyEnum | undefined, JobUrgencyEnum>;
  skills: ColumnType<string[], string[] | undefined, string[]>;
  client_id: string;
  images_urls: ColumnType<string[], string[] | undefined, string[]>;
}

export type JobEntity = Selectable<KyselyJobEntity>;
export type NewJob = Insertable<KyselyJobEntity>;
export type UpdateJob = Updateable<KyselyJobEntity>;
