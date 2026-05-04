import { BadRequestException, Inject } from '@nestjs/common';
import {
  ClientEntity,
  KyselyClientEntity,
  NewClient,
  UpdateClient,
} from './entity';
import { GenericRepository } from 'src/app/shared/types/GenericRepository';
import { TRANSACTION_PROVIDER } from 'src/app/database/conf/constants';
import { ITransaction } from 'src/app/database/types/transaction';
import { PostgresError } from 'src/app/shared/Errors/PostgresError';

export class ClientRepository
  implements GenericRepository<KyselyClientEntity, UpdateClient, any>
{
  constructor(
    @Inject(TRANSACTION_PROVIDER) private readonly trx: ITransaction,
  ) {}

  async findOne({ user_id }: { user_id: string }): Promise<ClientEntity | null> {
    try {
      const res = await this.trx
        .selectFrom('clients')
        .where('clients.user_id', '=', user_id)
        .selectAll()
        .executeTakeFirst();
      if (!res) return null;
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async create(data: NewClient): Promise<ClientEntity> {
    try {
      const res = await this.trx
        .insertInto('clients')
        .values(data)
        .returningAll()
        .executeTakeFirstOrThrow();
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async update(user_id: string, data: UpdateClient): Promise<ClientEntity> {
    try {
      const res = await this.trx
        .updateTable('clients')
        .set(data)
        .where('clients.user_id', '=', user_id)
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
        .deleteFrom('clients')
        .where('clients.user_id', '=', user_id)
        .execute();
    } catch (err) {
      throw new PostgresError(err);
    }
  }
}
