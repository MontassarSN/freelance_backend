import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadType } from './types/jwt-payload.type';
import { AllConfigType } from 'src/app/config/types/config.type';
import { DB_PROVIDER } from 'src/app/database/conf/constants';
import { ITransaction } from 'src/app/database/types/transaction';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(DB_PROVIDER) private readonly trx: ITransaction,
    configService: ConfigService<AllConfigType>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('auth.secret', { infer: true }),
    });
  }
  public async validate(payload: JwtPayloadType) {
    if (!payload.session_id) {
      throw new UnauthorizedException();
      return null;
    }
    const session = await this.trx
      .selectFrom('sessions')
      .selectAll()
      .where('id', '=', payload.session_id)
      .where('active', '=', true)
      .executeTakeFirst();

    if (!session) {
      throw new UnauthorizedException();
      return null;
    }
    return payload;
  }
}
