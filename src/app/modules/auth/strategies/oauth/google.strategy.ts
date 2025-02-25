import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { AllConfigType } from 'src/app/config/types/config.type';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService<AllConfigType>) {
    super({
      clientID: configService.getOrThrow('auth.googleClientID', {
        infer: true,
      }),
      // clientSecret: configService.getOrThrow('auth.googleClientSecret', {
      //   infer: true,
      // }),
      callbackURL: configService.getOrThrow('auth.googleCallbackURL', {
        infer: true,
      }),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    const user = {
      id: id,
      email: emails[0].value,
      first_name: name.givenName,
      avatar: photos[0].value,
      last_name: name.familyName,
    };

    done(null, user);
  }
}
