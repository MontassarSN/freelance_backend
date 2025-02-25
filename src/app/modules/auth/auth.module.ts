import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AuthGoogleService } from './googleAuth.service';
import { LinkedinStrategy } from './strategies/oauth/linkedin.strategy';
import { FacebookStrategy } from './strategies/oauth/fb.strategy';
import { GoogleStrategy } from './strategies/oauth/google.strategy';
import { UsersModule } from '../users/user.module';
import { SessionModule } from '../sessions/sessions.module';
import { MailModule } from 'src/app/shared/services/mail/mail.module';
import { SmsModule } from 'src/app/shared/services/sms/sms.module';
import { DatabaseModule } from 'src/app/database/database.module';
import { NotificationsModule } from '../notification/module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    SessionModule,
    PassportModule,
    MailModule,
    SmsModule,
    JwtModule.register({}),
    DatabaseModule,
    NotificationsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthGoogleService,
    JwtStrategy,
    JwtRefreshStrategy,
    LinkedinStrategy,
    FacebookStrategy,
    GoogleStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
