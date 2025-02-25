import { Inject } from '@nestjs/common';
import { QueryUserDto } from '../dto/query.dto';
import {
  SessionEntity,
  IQuerySessionKeys,
  KyselySessionEntity,
  NewSession,
  UpdateSession,
} from './entity';
import { GenericRepository } from 'src/app/shared/types/GenericRepository';
import { TRANSACTION_PROVIDER } from 'src/app/database/conf/constants';
import { ITransaction } from 'src/app/database/types/transaction';
import { PostgresError } from 'src/app/shared/Errors/PostgresError';
import { InfinityPaginationResultType } from 'src/app/shared/types/InfinityPaginationResultType';
import { infinityPagination } from 'src/app/shared/utils/infinityPagination';

export class SessionRepository
  implements
    GenericRepository<KyselySessionEntity, UpdateSession, QueryUserDto>
{
  constructor(
    @Inject(TRANSACTION_PROVIDER) private readonly trx: ITransaction,
  ) {}
  async findOne({ id }: { id: string }): Promise<SessionEntity | null> {
    try {
      const res = await this.trx
        .selectFrom(['sessions'])
        .where('sessions.id', '=', id)
        .where('sessions.active', '=', true)
        .selectAll()
        .executeTakeFirst();
      if (!res) return null;
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async findManyWithPagination(
    query: QueryUserDto,
  ): Promise<InfinityPaginationResultType<SessionEntity>> {
    try {
      const queryBuilder = this.trx
        .selectFrom('sessions')
        .$if(!!query.filters, (q) =>
          q.where((e) =>
            e.and(
              (Object.keys(query.filters ?? {}) as IQuerySessionKeys[]).flatMap(
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
              (Object.keys(query.search ?? {}) as IQuerySessionKeys[]).flatMap(
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
          .select(this.trx.fn.countAll('sessions').as('count'))
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
    } & { payload: UpdateSession },
  ): Promise<SessionEntity | null> {
    try {
      const res = await this.trx
        .updateTable('sessions')
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

  async createOne(payload: NewSession): Promise<SessionEntity | null> {
    try {
      const res = await this.trx
        .insertInto('sessions')
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
      await this.trx.deleteFrom('sessions').where('id', '=', id).execute();
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async deactivateUserSessions({
    user_id,
    exclude_id,
  }: {
    user_id: string;
    exclude_id?: string;
  }): Promise<void> {
    try {
      await this.trx
        .updateTable('sessions')
        .set({ active: false })
        .where('user_id', '=', user_id)
        .where('active', '=', true)
        .$if(!!exclude_id, (q) => q.where('id', '!=', exclude_id!))
        .execute();
    } catch (err) {
      throw new PostgresError(err);
    }
  }
}
