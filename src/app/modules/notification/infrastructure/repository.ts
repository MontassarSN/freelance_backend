import { Inject } from '@nestjs/common';
import {
  NotificationEntity,
  KyselyNotificationEntity,
  NewNotification,
  UpdateNotification,
  IQueryNotificationKeys,
} from './entity';
import { GenericRepository } from 'src/app/shared/types/GenericRepository';
import { DB_PROVIDER } from 'src/app/database/conf/constants';
import { ITransaction } from 'src/app/database/types/transaction';
import { PostgresError } from 'src/app/shared/Errors/PostgresError';
import { InfinityPaginationResultType } from 'src/app/shared/types/InfinityPaginationResultType';
import { infinityPagination } from 'src/app/shared/utils/infinityPagination';
import { QueryNotificationDto } from '../dto/dto';

export class NotificationsRepository
  implements
    GenericRepository<
      KyselyNotificationEntity,
      UpdateNotification,
      QueryNotificationDto
    >
{
  constructor(@Inject(DB_PROVIDER) private readonly trx: ITransaction) {}
  async findOne({ id }: { id: string }): Promise<NotificationEntity | null> {
    try {
      const res = await this.trx
        .selectFrom(['notifications'])
        .where('notifications.id', '=', id)
        .selectAll()
        .executeTakeFirst();
      if (!res) return null;
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async findUserNotifications({
    user_id,
    query,
  }: {
    user_id: string;
    query: QueryNotificationDto;
  }): Promise<InfinityPaginationResultType<NotificationEntity>> {
    try {
      const queryBuilder = this.trx
        .selectFrom('users_notifications')
        .where('users_notifications.user_id', '=', user_id)
        .innerJoin(
          'notifications',
          'notifications.id',
          'users_notifications.notification_id',
        )
        .$if(!!query.filters, (q) =>
          q.where((e) =>
            e.and(
              (
                Object.keys(query.filters ?? {}) as IQueryNotificationKeys[]
              ).flatMap((key) =>
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
              (
                Object.keys(query.search ?? {}) as IQueryNotificationKeys[]
              ).flatMap((key) =>
                (query.search?.[key] ?? []).map((search) =>
                  e(key, 'ilike', `%${search}%`),
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
          .select(this.trx.fn.countAll('notifications').as('count'))
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
    } & { payload: UpdateNotification },
  ): Promise<NotificationEntity | null> {
    try {
      const res = await this.trx
        .updateTable('notifications')
        .set({
          ...args.payload,
        })
        .where('id', '=', args.id)
        .returningAll()
        .executeTakeFirst();
      return res ?? null;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async createOne(
    payload: NewNotification,
  ): Promise<NotificationEntity | null> {
    try {
      const res = await this.trx
        .insertInto('notifications')
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

  async createMany(payload: NewNotification[]): Promise<NotificationEntity[]> {
    try {
      const res = await this.trx
        .insertInto('notifications')
        .values(payload)
        .returningAll()
        .execute();
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async deleteOne({ id }: { id: string }): Promise<void> {
    try {
      await this.trx.deleteFrom('notifications').where('id', '=', id).execute();
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async deleteMany({ ids }: { ids: string[] }): Promise<void> {
    try {
      await this.trx
        .deleteFrom('notifications')
        .where('id', 'in', ids)
        .execute();
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async createManyUserNotifications(
    payload: { user_id: string; notification_id: string }[],
  ): Promise<void> {
    try {
      await this.trx
        .insertInto('users_notifications')
        .values(payload)
        .execute();
    } catch (err) {
      throw new PostgresError(err);
    }
  }
}
