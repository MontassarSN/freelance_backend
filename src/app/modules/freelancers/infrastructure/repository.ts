import { Inject } from '@nestjs/common';
import {
  FreelancerEntity,
  KyselyFreelancerEntity,
  NewFreelancer,
  UpdateFreelancer,
} from './entity';
import { GenericRepository } from 'src/app/shared/types/GenericRepository';
import { TRANSACTION_PROVIDER } from 'src/app/database/conf/constants';
import { ITransaction } from 'src/app/database/types/transaction';
import { PostgresError } from 'src/app/shared/Errors/PostgresError';

export class FreelancerRepository
  implements GenericRepository<KyselyFreelancerEntity, UpdateFreelancer, any>
{
  constructor(
    @Inject(TRANSACTION_PROVIDER) private readonly trx: ITransaction,
  ) {}

  async findOne({
    user_id,
  }: {
    user_id: string;
  }): Promise<FreelancerEntity | null> {
    try {
      const res = await this.trx
        .selectFrom('freelancers')
        .where('freelancers.user_id', '=', user_id)
        .selectAll()
        .executeTakeFirst();
      if (!res) return null;
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async create(data: NewFreelancer): Promise<FreelancerEntity> {
    try {
      const res = await this.trx
        .insertInto('freelancers')
        .values(data)
        .returningAll()
        .executeTakeFirstOrThrow();
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async update(
    user_id: string,
    data: UpdateFreelancer,
  ): Promise<FreelancerEntity> {
    try {
      const res = await this.trx
        .updateTable('freelancers')
        .set(data)
        .where('freelancers.user_id', '=', user_id)
        .returningAll()
        .executeTakeFirstOrThrow();
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async delete(user_id: string): Promise<void> {
    try {
      await this.trx
        .deleteFrom('freelancers')
        .where('freelancers.user_id', '=', user_id)
        .execute();
    } catch (err) {
      throw new PostgresError(err);
    }
  }
}
