import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshPayloadType } from './types/jwt-refresh-payload.type';
import { AllConfigType } from 'src/app/config/types/config.type';
import { DB_PROVIDER } from 'src/app/database/conf/constants';
import { ITransaction } from 'src/app/database/types/transaction';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(DB_PROVIDER) private readonly trx: ITransaction,
    configService: ConfigService<AllConfigType>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('auth.refreshSecret', {
        infer: true,
      }),
    });
  }

  public async validate(payload: JwtRefreshPayloadType) {
    if (!payload.session_id) {
      throw new UnauthorizedException();
    }
    const session = await this.trx
      .selectFrom('sessions')
      .selectAll()
      .where('id', '=', payload.session_id)
      .where('active', '=', true)
      .executeTakeFirst();

    if (!session) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
