import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';
import { AllConfigType } from 'src/app/config/types/config.type';

@Injectable()
export class LinkedinStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(configService: ConfigService<AllConfigType>) {
    super({
      clientID: configService.getOrThrow('auth.linkedinClientID', {
        infer: true,
      }),
      clientSecret: configService.getOrThrow('auth.linkedinClientSecret', {
        infer: true,
      }),
      callbackURL: configService.getOrThrow('auth.linkedinCallbackURL', {
        infer: true,
      }),
      scope: ['r_emailaddress', 'r_liteprofile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { id, givenName, email, familyName, picture } = profile;

    const user = {
      id: id,
      email: email,
      first_name: givenName,
      last_name: familyName,
      avatar: picture,
    };

    done(null, user);
  }
}
