import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { AllConfigType } from 'src/app/config/types/config.type';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(configService: ConfigService<AllConfigType>) {
    super({
      clientID: configService.getOrThrow('auth.facebookAppID', {
        infer: true,
      }),
      clientSecret: configService.getOrThrow('auth.facebookAppSecret', {
        infer: true,
      }),
      callbackURL: configService.getOrThrow('auth.facebookCallbackURL', {
        infer: true,
      }),
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { name, emails } = profile;
    const user = {
      id: profile.id,
      email: emails?.[0].value,
      firstName: name?.givenName,
      lastName: name?.familyName,
    };

    done(null, user);
  }
}
