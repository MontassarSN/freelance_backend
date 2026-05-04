import { Inject } from '@nestjs/common';
import { JobEntity, KyselyJobEntity, NewJob, UpdateJob } from './entity';
import { GenericRepository } from 'src/app/shared/types/GenericRepository';
import { TRANSACTION_PROVIDER } from 'src/app/database/conf/constants';
import { ITransaction } from 'src/app/database/types/transaction';
import { PostgresError } from 'src/app/shared/Errors/PostgresError';

export class JobRepository
  implements GenericRepository<KyselyJobEntity, UpdateJob, any>
{
  constructor(
    @Inject(TRANSACTION_PROVIDER) private readonly trx: ITransaction,
  ) {}

  async findOne({ id }: { id: string }): Promise<JobEntity | null> {
    try {
      const res = await this.trx
        .selectFrom('jobs')
        .where('jobs.id', '=', id)
        .selectAll()
        .executeTakeFirst();
      if (!res) return null;
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async findByClient({ client_id }: { client_id: string }): Promise<JobEntity[]> {
    try {
      const res = await this.trx
        .selectFrom('jobs')
        .where('jobs.client_id', '=', client_id)
        .selectAll()
        .execute();
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async create(data: NewJob): Promise<JobEntity> {
    try {
      const res = await this.trx
        .insertInto('jobs')
        .values(data)
        .returningAll()
        .executeTakeFirstOrThrow();
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async update(id: string, data: UpdateJob): Promise<JobEntity> {
    try {
      const res = await this.trx
        .updateTable('jobs')
        .set(data)
        .where('jobs.id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow();
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.trx.deleteFrom('jobs').where('jobs.id', '=', id).execute();
    } catch (err) {
      throw new PostgresError(err);
    }
  }
}
