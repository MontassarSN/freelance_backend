import { Inject } from '@nestjs/common';
import {
  ClientReviewEntity,
  FreelancerReviewEntity,
  KyselyClientReviewEntity,
  KyselyFreelancerReviewEntity,
  NewClientReview,
  NewFreelancerReview,
  UpdateClientReview,
  UpdateFreelancerReview,
} from './entity';
import { GenericRepository } from 'src/app/shared/types/GenericRepository';
import { TRANSACTION_PROVIDER } from 'src/app/database/conf/constants';
import { ITransaction } from 'src/app/database/types/transaction';
import { PostgresError } from 'src/app/shared/Errors/PostgresError';

export class ClientReviewRepository
  implements
    GenericRepository<KyselyClientReviewEntity, UpdateClientReview, any>
{
  constructor(
    @Inject(TRANSACTION_PROVIDER) private readonly trx: ITransaction,
  ) {}

  async findOne({ id }: { id: string }): Promise<ClientReviewEntity | null> {
    try {
      const res = await this.trx
        .selectFrom('clients_reviews')
        .where('clients_reviews.id', '=', id)
        .selectAll()
        .executeTakeFirst();
      if (!res) return null;
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async findByClient({
    client_id,
  }: {
    client_id: string;
  }): Promise<ClientReviewEntity[]> {
    try {
      const res = await this.trx
        .selectFrom('clients_reviews')
        .where('clients_reviews.client_id', '=', client_id)
        .selectAll()
        .execute();
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async create(data: NewClientReview): Promise<ClientReviewEntity> {
    try {
      const res = await this.trx
        .insertInto('clients_reviews')
        .values(data)
        .returningAll()
        .executeTakeFirstOrThrow();
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async update(id: string, data: UpdateClientReview): Promise<ClientReviewEntity> {
    try {
      const res = await this.trx
        .updateTable('clients_reviews')
        .set(data)
        .where('clients_reviews.id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow();
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.trx
        .deleteFrom('clients_reviews')
        .where('clients_reviews.id', '=', id)
        .execute();
    } catch (err) {
      throw new PostgresError(err);
    }
  }
}

export class FreelancerReviewRepository
  implements
    GenericRepository<KyselyFreelancerReviewEntity, UpdateFreelancerReview, any>
{
  constructor(
    @Inject(TRANSACTION_PROVIDER) private readonly trx: ITransaction,
  ) {}

  async findOne({ id }: { id: string }): Promise<FreelancerReviewEntity | null> {
    try {
      const res = await this.trx
        .selectFrom('freelancers_reviews')
        .where('freelancers_reviews.id', '=', id)
        .selectAll()
        .executeTakeFirst();
      if (!res) return null;
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async findByFreelancer({
    freelancer_id,
  }: {
    freelancer_id: string;
  }): Promise<FreelancerReviewEntity[]> {
    try {
      const res = await this.trx
        .selectFrom('freelancers_reviews')
        .where('freelancers_reviews.freelancer_id', '=', freelancer_id)
        .selectAll()
        .execute();
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async create(data: NewFreelancerReview): Promise<FreelancerReviewEntity> {
    try {
      const res = await this.trx
        .insertInto('freelancers_reviews')
        .values(data)
        .returningAll()
        .executeTakeFirstOrThrow();
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async update(
    id: string,
    data: UpdateFreelancerReview,
  ): Promise<FreelancerReviewEntity> {
    try {
      const res = await this.trx
        .updateTable('freelancers_reviews')
        .set(data)
        .where('freelancers_reviews.id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow();
      return res;
    } catch (err) {
      throw new PostgresError(err);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.trx
        .deleteFrom('freelancers_reviews')
        .where('freelancers_reviews.id', '=', id)
        .execute();
    } catch (err) {
      throw new PostgresError(err);
    }
  }
}
