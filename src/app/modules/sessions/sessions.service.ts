import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SessionRepository } from './infrastructure/repository';
import { QueryUserDto } from './dto/query.dto';
import { InfinityPaginationResultType } from 'src/app/shared/types/InfinityPaginationResultType';
import {
  NewSession,
  SessionEntity,
  UpdateSession,
} from './infrastructure/entity';
import { ERRORS } from 'src/assets/constants/errors';

@Injectable()
export class SessionService {
  constructor(private readonly repository: SessionRepository) {}

  async findManyWithPagination(
    query: QueryUserDto,
  ): Promise<InfinityPaginationResultType<SessionEntity>> {
    return this.repository.findManyWithPagination(query);
  }

  async findOne({ id }: { id: string }): Promise<SessionEntity> {
    const user = await this.repository.findOne({ id });
    if (user === null) {
      throw new NotFoundException(ERRORS('Session not found'));
    }
    return user;
  }

  async updateOne({
    id,
    payload,
  }: {
    id: string;
    payload: UpdateSession;
  }): Promise<SessionEntity> {
    const updatedEntity = await this.repository.updateOne({
      id,
      payload,
    });
    if (!updatedEntity) {
      throw new NotFoundException(ERRORS('Session not found'));
    }
    return updatedEntity;
  }

  async deleteOne({ id }: { id: string }): Promise<void> {
    await this.findOne({ id });
    await this.repository.deleteOne({ id });
  }

  async createOne(payload: NewSession): Promise<SessionEntity> {
    const createdEntity = await this.repository.createOne(payload);
    if (!createdEntity) {
      throw new InternalServerErrorException(ERRORS('Unexpected error!'));
    }
    return createdEntity;
  }

  async deactivateUserSessions({
    user_id,
    exclude_id,
  }: {
    user_id: string;
    exclude_id?: string;
  }): Promise<void> {
    await this.repository.deactivateUserSessions({ user_id, exclude_id });
  }
}
