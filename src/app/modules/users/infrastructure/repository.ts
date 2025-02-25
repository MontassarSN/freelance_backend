import { BadRequestException, Inject } from '@nestjs/common';
import { QueryUserDto } from '../dto/query.dto';
import {
  UserEntity,
  IQueryUserKeys,
  KyselyUserEntity,
  NewUser,
  UpdateUser,
} from './entity';
import { GenericRepository } from 'src/app/shared/types/GenericRepository';
import { TRANSACTION_PROVIDER } from 'src/app/database/conf/constants';
import { ITransaction } from 'src/app/database/types/transaction';
import { PostgresError } from 'src/app/shared/Errors/PostgresError';
import { InfinityPaginationResultType } from 'src/app/shared/types/InfinityPaginationResultType';
import { infinityPagination } from 'src/app/shared/utils/infinityPagination';

export class UserRepository
  implements GenericRepository<KyselyUserEntity, UpdateUser, QueryUserDto>
{
  constructor(
    @Inject(TRANSACTION_PROVIDER) private readonly trx: ITransaction,
  ) {}
  async findOne({ id }: { id: string }): Promise<UserEntity | null> {
    try {
      const res = await this.trx
        .selectFrom(['users'])
        .where('users.id', '=', id)
        .selectAll()
        .executeTakeFirst();
      if (!res) return null;
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async findOneByEmail({ email }: { email: string }) {
    try {
      const res = await this.trx
        .selectFrom('users')
        .where('users.email', '=', email)
        .select([
          'avatar',
          'email',
          'id',
          'username',
          'password',
          'temp_password',
          'status',
          'provider',
        ])
        .executeTakeFirst();
      if (!res) return null;
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async findOneByPhoneNumber({ phone_number }: { phone_number: string }) {
    try {
      const res = await this.trx
        .selectFrom('users')
        .where('users.phone_number', '=', phone_number)
        .select([
          'avatar',
          'email',
          'id',
          'username',
          'password',
          'temp_password',
          'status',
          'provider',
        ])
        .executeTakeFirst();
      if (!res) return null;
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async findManyWithPagination(
    query: QueryUserDto,
  ): Promise<InfinityPaginationResultType<UserEntity>> {
    try {
      const queryBuilder = this.trx
        .selectFrom('users')
        .$if(!!query.filters, (q) =>
          q.where((e) =>
            e.and(
              (Object.keys(query.filters ?? {}) as IQueryUserKeys[]).flatMap(
                (key) =>
                  (query.filters?.[key] ?? []).map((filter) =>
                    e(key, filter.operator, filter.value),
                  ),
              ),
            ),
          ),
        )
        .$if(!!query.search, (q) =>
          q.where((e) =>
            e.or(
              (Object.keys(query.search ?? {}) as IQueryUserKeys[]).flatMap(
                (key) =>
                  (query.search?.[key] ?? []).map((filter) =>
                    e(key, filter.operator, filter.value),
                  ),
              ),
            ),
          ),
        );
      const [res, total] = await Promise.all([
        queryBuilder
          .$if(!!query.sort, (q) =>
            q.orderBy(query.sort!.orderBy, query.sort?.order),
          )
          .$if(!!query.limit, (q) => q.limit(query.limit))
          .$if(!!query.limit && !!query.page, (q) =>
            q.offset((query.page - 1) * query.limit),
          )
          .selectAll()
          .execute(),
        queryBuilder
          .select(this.trx.fn.countAll('users').as('count'))
          .executeTakeFirst(),
      ]);
      return infinityPagination(res, {
        total_count: Number(total?.count ?? 0),
        page: query.page,
        limit: query.limit,
      });
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async updateOne(
    args: {
      id: string;
    } & {
      payload: UpdateUser & {
        temp_password?: string | null;
      };
    },
  ): Promise<UserEntity | null> {
    try {
      const res = await this.trx
        .updateTable('users')
        .set({
          ...args.payload,
          updated_at: new Date(),
        })
        .where('id', '=', args.id)
        .returningAll()
        .executeTakeFirst();
      return res ?? null;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async createOne(payload: NewUser): Promise<UserEntity | null> {
    try {
      const res = await this.trx
        .insertInto('users')
        .values({
          ...payload,
        })
        .returningAll()
        .executeTakeFirst();
      return res ?? null;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async deleteOne({ id }: { id: string }): Promise<void> {
    try {
      await this.trx.deleteFrom('users').where('id', '=', id).execute();
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async removeUserFromSessions({ user_id }: { user_id: string }) {
    try {
      await this.trx
        .deleteFrom('sessions')
        .where('user_id', '=', user_id)
        .execute();
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async removeUserFromNotifications({ user_id }: { user_id: string }) {
    try {
      await this.trx
        .deleteFrom('users_notifications')
        .where('user_id', '=', user_id)
        .execute();
    } catch (err) {
      throw new PostgresError(err);
    }
  }
}
