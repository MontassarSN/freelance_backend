import { Inject } from '@nestjs/common';
import {
  PortfolioEntity,
  KyselyPortfolioEntity,
  NewPortfolio,
  UpdatePortfolio,
} from './entity';
import { GenericRepository } from 'src/app/shared/types/GenericRepository';
import { TRANSACTION_PROVIDER } from 'src/app/database/conf/constants';
import { ITransaction } from 'src/app/database/types/transaction';
import { PostgresError } from 'src/app/shared/Errors/PostgresError';

export class PortfolioRepository
  implements GenericRepository<KyselyPortfolioEntity, UpdatePortfolio, any>
{
  constructor(
    @Inject(TRANSACTION_PROVIDER) private readonly trx: ITransaction,
  ) {}

  async findOne({
    user_id,
  }: {
    user_id: string;
  }): Promise<PortfolioEntity | null> {
    try {
      const res = await this.trx
        .selectFrom('portfolios')
        .where('portfolios.user_id', '=', user_id)
        .selectAll()
        .executeTakeFirst();
      if (!res) return null;
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async create(data: NewPortfolio): Promise<PortfolioEntity> {
    try {
      const res = await this.trx
        .insertInto('portfolios')
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
    data: UpdatePortfolio,
  ): Promise<PortfolioEntity> {
    try {
      const res = await this.trx
        .updateTable('portfolios')
        .set(data)
        .where('portfolios.user_id', '=', user_id)
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
        .deleteFrom('portfolios')
        .where('portfolios.user_id', '=', user_id)
        .execute();
    } catch (err) {
      throw new PostgresError(err);
    }
  }
}
