import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './infrastructure/repository';
import { QueryUserDto } from './dto/query.dto';
import { CreateUserDto } from './dto/create.dto';
import { InfinityPaginationResultType } from 'src/app/shared/types/InfinityPaginationResultType';
import {
  AuthProvidersEnum,
  AuthStatusEnum,
  NewUser,
  UpdateUser,
  UserEntity,
} from './infrastructure/entity';
import { ERRORS } from 'src/assets/constants/errors';
import { AllConfigType } from 'src/app/config/types/config.type';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';
import { SessionService } from '../sessions/sessions.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UserRepository,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly sessionService: SessionService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findManyWithPagination(
    query: QueryUserDto,
  ): Promise<InfinityPaginationResultType<UserEntity>> {
    return this.repository.findManyWithPagination(query);
  }

  async findOne({ id }: { id: string }) {
    const user = await this.repository.findOne({ id });
    if (user === null) {
      throw new NotFoundException(ERRORS('User not found'));
    }
    return user;
  }

  async findOneByPhoneNumber({ phone_number }: { phone_number: string }) {
    const user = await this.repository.findOneByPhoneNumber({ phone_number });
    if (user === null) {
      throw new NotFoundException(ERRORS('User not found'));
    }
    return user;
  }

  async findOneByEmail({ email }: { email: string }) {
    const user = await this.repository.findOneByEmail({ email });
    if (user === null) {
      throw new NotFoundException(ERRORS('User not found'));
    }
    return user;
  }

  async updateOne({
    id,
    session_id,
    payload,
  }: {
    id: string;
    session_id?: string;
    payload: UpdateUser & {
      confirm_password?: string;
    };
  }): Promise<UserEntity> {
    const { password } = payload;

    if (password) {
      const saltRounds = this.configService.getOrThrow('auth.saltRounds', {
        infer: true,
      });
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      await this.sessionService.deactivateUserSessions({
        user_id: id,
        exclude_id: session_id,
      });
      payload.password = hashedPassword;
      delete payload.confirm_password;
    }

    const updatedEntity = await this.repository.updateOne({
      id,
      payload,
    });
    if (!updatedEntity) {
      throw new NotFoundException(ERRORS('User not found'));
    }

    this.validateUser(updatedEntity);

    return updatedEntity;
  }

  async deleteOne({
    id,
    password,
  }: {
    id: string;
    password?: string;
  }): Promise<void> {
    const { password: hashedPassword } = await this.findOne({ id });
    if (password && hashedPassword) {
      await bcrypt.compare(password, hashedPassword);
    }
    await this.repository.deleteOne({ id });
  }

  async createOne(
    payload: CreateUserDto & {
      temp_password?: string | null;
    },
  ): Promise<UserEntity> {
    this.validateUser(payload);

    const createdEntity = await this.repository.createOne(payload);
    if (!createdEntity) {
      throw new InternalServerErrorException(ERRORS('Unexpected error!'));
    }
    return createdEntity;
  }

  async createOneByAdmin(payload: CreateUserDto): Promise<UserEntity> {
    const { password, ...rest } = payload;

    this.validateUser(payload);

    if (!password) {
      throw new BadRequestException(ERRORS('Password is required!'));
    }
    const saltRounds = this.configService.getOrThrow('auth.saltRounds', {
      infer: true,
    });
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const createdEntity = await this.repository.createOne({
      ...rest,
      status: payload.status ?? AuthStatusEnum.ACTIVE,
      password: hashedPassword,
    });
    if (!createdEntity) {
      throw new InternalServerErrorException(ERRORS('Unexpected error!'));
    }
    return createdEntity;
  }

  private async validateUser(user: NewUser): Promise<void> {
    if (user.provider === AuthProvidersEnum.EMAIL && !user.email) {
      throw new NotFoundException(ERRORS('User must have an email'));
    }
    if (user.provider === AuthProvidersEnum.PHONE && !user.phone_number) {
      throw new NotFoundException(ERRORS('User must have a phone number'));
    }
  }
}
