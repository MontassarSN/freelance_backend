import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { ROLE_KEY, RoleDecoratorArgs } from '../decorators/Role.decorator';
import { Reflector } from '@nestjs/core';
import { ITransaction } from 'src/app/database/types/transaction';
import { TRANSACTION_PROVIDER } from 'src/app/database/conf/constants';
import { JwtPayloadType } from '../strategies/types/jwt-payload.type';
import { AuthStatusEnum } from '../../users/infrastructure/entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(TRANSACTION_PROVIDER) private readonly trx: ITransaction,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const args = this.reflector.getAllAndOverride<
      RoleDecoratorArgs | undefined
    >(ROLE_KEY, [context.getHandler(), context.getClass()]);

    const user: JwtPayloadType = request.user;

    if (!user || !args) {
      throw new ForbiddenException();
    }

    const res = await this.trx
      .selectFrom('users')
      .where('id', '=', user.user_id)
      .where('status', '=', AuthStatusEnum.ACTIVE)
      .where('role', 'in', args.roles)
      .select((q) => q.fn.countAll().as('count'))
      .executeTakeFirst();

    if (Number(res?.count) === 1) {
      return true;
    }

    return false;
  }
}
