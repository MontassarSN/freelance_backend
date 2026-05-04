import {
  ColumnType,
  GeneratedAlways,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';
import { AvailabilityEnum } from 'src/app/shared/types/enums.types';

export interface KyselyFreelancerEntity {
  user_id: string;
  title: ColumnType<string, string | undefined, string>;
  bio: ColumnType<string, string | undefined, string>;
  rating: ColumnType<number | null, number | null | undefined, number | null>;
  reviews: ColumnType<bigint, bigint | undefined, bigint>;
  hourlyRate: ColumnType<bigint | null, bigint | null | undefined, bigint | null>;
  skills: ColumnType<string[], string[] | undefined, string[]>;
  completedJobs: ColumnType<bigint, bigint | undefined, bigint>;
  availability: ColumnType<AvailabilityEnum, AvailabilityEnum | undefined, AvailabilityEnum>;
}

export type FreelancerEntity = Selectable<KyselyFreelancerEntity>;
export type NewFreelancer = Insertable<KyselyFreelancerEntity>;
export type UpdateFreelancer = Updateable<KyselyFreelancerEntity>;
