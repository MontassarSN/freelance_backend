import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { AuthGoogleLoginDto } from './dto/auth-google-login.dto';

@Injectable()
export class AuthGoogleService {
  private google: OAuth2Client;

  constructor() {
    this.google = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );
  }

  async getProfileByToken(loginDto: AuthGoogleLoginDto) {
    const ticket = await this.google.verifyIdToken({
      idToken: loginDto.idToken,
      audience: [process.env.GOOGLE_CLIENT_ID as string],
    });
    const data = ticket.getPayload();
    if (!data) {
      throw new UnauthorizedException('Invalid token');
    }
    return {
      id: data.sub,
      email: data.email,
      firstName: data.given_name,
      lastName: data.family_name,
      picture: data.picture,
    };
  }
}
