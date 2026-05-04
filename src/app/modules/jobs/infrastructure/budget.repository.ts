import { Inject } from '@nestjs/common';
import {
  JobBudgetEntity,
  KyselyJobBudgetEntity,
  NewJobBudget,
  UpdateJobBudget,
} from './budget.entity';
import { GenericRepository } from 'src/app/shared/types/GenericRepository';
import { TRANSACTION_PROVIDER } from 'src/app/database/conf/constants';
import { ITransaction } from 'src/app/database/types/transaction';
import { PostgresError } from 'src/app/shared/Errors/PostgresError';

export class JobBudgetRepository
  implements GenericRepository<KyselyJobBudgetEntity, UpdateJobBudget, any>
{
  constructor(
    @Inject(TRANSACTION_PROVIDER) private readonly trx: ITransaction,
  ) {}

  async findOne({
    job_id,
  }: {
    job_id: string;
  }): Promise<JobBudgetEntity | null> {
    try {
      const res = await this.trx
        .selectFrom('job_budget')
        .where('job_budget.job_id', '=', job_id)
        .selectAll()
        .executeTakeFirst();
      if (!res) return null;
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async create(data: NewJobBudget): Promise<JobBudgetEntity> {
    try {
      const res = await this.trx
        .insertInto('job_budget')
        .values(data)
        .returningAll()
        .executeTakeFirstOrThrow();
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async update(
    job_id: string,
    data: UpdateJobBudget,
  ): Promise<JobBudgetEntity> {
    try {
      const res = await this.trx
        .updateTable('job_budget')
        .set(data)
        .where('job_budget.job_id', '=', job_id)
        .returningAll()
        .executeTakeFirstOrThrow();
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async delete(job_id: string): Promise<void> {
    try {
      await this.trx
        .deleteFrom('job_budget')
        .where('job_budget.job_id', '=', job_id)
        .execute();
    } catch (err) {
      throw new PostgresError(err);
    }
  }
}
