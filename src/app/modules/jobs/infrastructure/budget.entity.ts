import {
  ColumnType,
  GeneratedAlways,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';
import { BudgetTypeEnum } from 'src/app/shared/types/enums.types';

export interface KyselyJobBudgetEntity {
  job_id: string;
  min: bigint;
  max: bigint;
  type: ColumnType<BudgetTypeEnum, BudgetTypeEnum | undefined, BudgetTypeEnum>;
}

export type JobBudgetEntity = Selectable<KyselyJobBudgetEntity>;
export type NewJobBudget = Insertable<KyselyJobBudgetEntity>;
export type UpdateJobBudget = Updateable<KyselyJobBudgetEntity>;
