import {
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QueryUserDto } from './dto/query.dto';
import { SessionService } from './sessions.service';
import { ITransaction } from '../../database/types/transaction';
import { TRANSACTION_PROVIDER } from 'src/app/database/conf/constants';
import { InfinityPaginationResultType } from 'src/app/shared/types/InfinityPaginationResultType';
import { SessionEntity } from './infrastructure/entity';
import SessionMapper from './mappers/session.mapper';
import { RoleGuard } from '../auth/guards/role.guard';
import { Role } from '../auth/decorators/Role.decorator';
import { AuthenticatedUser } from '../auth/decorators/user.decorator';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { Resource } from '../auth/decorators/resource.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesEnum } from '../users/infrastructure/entity';

@Resource('sessions')
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'sessions',
  version: '1',
})
export class SessionController {
  constructor(
    private readonly service: SessionService,
    @Inject(TRANSACTION_PROVIDER) private readonly trx: ITransaction,
  ) {}

  @Role({ roles: [RolesEnum.ADMIN] })
  @UseGuards(RoleGuard)
  @Get()
  async getMany(
    @Query() query: QueryUserDto,
  ): Promise<InfinityPaginationResultType<SessionEntity>> {
    return this.service.findManyWithPagination(query);
  }

  @Get('me')
  async getMe(@AuthenticatedUser() userJwt: JwtPayloadType) {
    const res = await this.service.findOne({
      id: userJwt.user_id,
    });
    return SessionMapper(res);
  }

  @Role({ roles: [RolesEnum.ADMIN] })
  @UseGuards(RoleGuard)
  @Get(':id')
  async get(@Param('id', ParseUUIDPipe) id: string): Promise<SessionEntity> {
    return this.service.findOne({ id });
  }
}
