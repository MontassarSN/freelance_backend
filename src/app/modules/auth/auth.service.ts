import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import ms from 'ms';
import crypto from 'crypto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { UsersService } from '../users/user.service';
import { SessionService } from '../sessions/sessions.service';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { AuthRegisterLoginPhoneDto } from './dto/auth-register-login-phone.dto';
import { AuthPhoneLoginDto } from './dto/auth-phone-login.dto';
import { AuthOtpLoginDto } from './dto/auth-otp-login.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { ERRORS } from 'src/assets/constants/errors';
import { MailService } from 'src/app/shared/services/mail/mail.service';
import { SmsService } from 'src/app/shared/services/sms/sms.service';
import { AllConfigType } from 'src/app/config/types/config.type';
import { generateOtp } from 'src/app/shared/utils/generateOtp';
import { UserRepository } from '../users/infrastructure/repository';
import { FirebaseService } from '../notification/firebase.service';
import {
  AuthProvidersEnum,
  AuthStatusEnum,
  RolesEnum,
} from '../users/infrastructure/entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private sessionService: SessionService,
    private mailService: MailService,
    private smsService: SmsService,
    private configService: ConfigService<AllConfigType>,
    private userRepository: UserRepository,
    private readonly firebaseService: FirebaseService,
  ) {}

  async validateOtpLogin(loginDto: AuthOtpLoginDto, deviseToken: string) {
    if (!loginDto.email && !loginDto.phone_number) {
      throw new BadRequestException(
        ERRORS('Email or phone number is required'),
      );
    }

    const user = loginDto.email
      ? await this.usersService.findOneByEmail({
          email: loginDto.email,
        })
      : await this.usersService.findOneByPhoneNumber({
          phone_number: loginDto.phone_number!,
        });

    if (!user.temp_password) {
      throw new InternalServerErrorException(ERRORS('Password is not set'));
    }

    const isValidOtp = await bcrypt.compare(loginDto.otp, user.temp_password!);

    if (!isValidOtp) {
      throw new BadRequestException(ERRORS('Incorrect otp. Please try again'));
    }

    await this.userRepository.updateOne({
      id: user.id,
      payload: {
        temp_password: null,
      },
    });

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = await this.sessionService.createOne({
      user_id: user.id,
      hash,
      active: true,
    });

    await this.firebaseService.subscribeToTopic({
      topic: user.id,
      token: deviseToken,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokens({
      user_id: user.id,
      session_id: session.id,
      hash,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
    };
  }

  async validateEmailLogin(loginDto: AuthEmailLoginDto, deviseToken: string) {
    const user = await this.usersService.findOneByEmail({
      email: loginDto.email,
    });

    if (user.provider !== AuthProvidersEnum.EMAIL) {
      throw new BadRequestException(
        ERRORS(`You need to login via your original provider`),
      );
    }

    if (!user.password) {
      throw new InternalServerErrorException(ERRORS('Password is not set'));
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new BadRequestException(ERRORS('Incorrect password'));
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = await this.sessionService.createOne({
      user_id: user.id,
      hash,
      active: true,
    });

    await this.firebaseService.subscribeToTopic({
      topic: user.id,
      token: deviseToken,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokens({
      user_id: user.id,
      session_id: session.id,
      hash,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
    };
  }

  async validatePhoneLogin(loginDto: AuthPhoneLoginDto, deviseToken: string) {
    const user = await this.usersService.findOneByPhoneNumber({
      phone_number: loginDto.phone_number,
    });

    if (user.provider !== AuthProvidersEnum.PHONE) {
      throw new BadRequestException(
        ERRORS(`You need to login via your original provider`),
      );
    }

    if (!user.password) {
      throw new InternalServerErrorException(ERRORS('Password is not set'));
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new BadRequestException(ERRORS('Incorrect password'));
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = await this.sessionService.createOne({
      user_id: user.id,
      hash,
      active: true,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokens({
      user_id: user.id,
      session_id: session.id,
      hash,
    });

    await this.firebaseService.subscribeToTopic({
      topic: user.id,
      token: deviseToken,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
    };
  }

  async validateSocialLogin(
    authProvider: AuthProvidersEnum,
    socialData: {
      id: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      avatar?: string;
    },
    deviseToken: string,
  ) {
    let user = null;
    const socialEmail = socialData.email?.toLowerCase();

    let userByEmail = null;

    if (socialEmail) {
      userByEmail = await this.usersService.findOneByEmail({
        email: socialEmail,
      });
    }
    if (userByEmail) {
      user = userByEmail;
    } else {
      user = await this.usersService.createOne({
        email: socialEmail ?? '',
        username:
          (socialData.firstName ?? '') + ' ' + (socialData.lastName ?? ''),
        social_id: socialData.id,
        provider: authProvider,
        role: RolesEnum.USER,
        status: AuthStatusEnum.ACTIVE,
        avatar: socialData.avatar,
        password: null,
        temp_password: null,
      });
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = await this.sessionService.createOne({
      user_id: user.id,
      hash,
      active: true,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokens({
      user_id: user.id,
      session_id: session.id,
      hash,
    });

    await this.firebaseService.subscribeToTopic({
      topic: user.id,
      token: deviseToken,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
    };
  }

  async logout(data: { user_id: string }) {
    await this.sessionService.deactivateUserSessions({
      user_id: data.user_id,
    });
  }

  async registerEmail(dto: AuthRegisterLoginDto): Promise<void> {
    const saltRounds = this.configService.getOrThrow('auth.saltRounds', {
      infer: true,
    });
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, saltRounds);

    await this.usersService.createOne({
      email: dto.email,
      provider: AuthProvidersEnum.EMAIL,
      role: dto.role,
      status: AuthStatusEnum.INACTIVE,
      password: null,
      temp_password: hashedOtp,
    });

    await this.mailService.userSignUp({
      to: dto.email,
      data: {
        hash: otp,
      },
    });
  }

  async confirmEmail({ otp, email }: { otp: string; email: string }) {
    const user = await this.usersService.findOneByEmail({
      email,
    });

    if (user?.status !== AuthStatusEnum.INACTIVE) {
      throw new BadRequestException(
        ERRORS('User is already active. Please login'),
      );
    }

    const isValidOtp = await bcrypt.compare(otp, user.temp_password!);

    if (!isValidOtp) {
      throw new BadRequestException(ERRORS('Invalid otp. Please try again'));
    }

    await this.userRepository.updateOne({
      id: user.id,
      payload: {
        status: AuthStatusEnum.ACTIVE,
        password: null,
        temp_password: null,
      },
    });

    const SessionHash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = await this.sessionService.createOne({
      user_id: user.id,
      hash: SessionHash,
      active: true,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokens({
      user_id: user.id,
      session_id: session.id,
      hash: SessionHash,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
    };
  }

  async registerPhone(dto: AuthRegisterLoginPhoneDto): Promise<void> {
    const saltRounds = this.configService.getOrThrow('auth.saltRounds', {
      infer: true,
    });
    const otp = generateOtp();
    const hashedPassword = await bcrypt.hash(otp, saltRounds);
    await this.usersService.createOne({
      phone_number: dto.phone_number,
      provider: AuthProvidersEnum.PHONE,
      role: dto.role,
      status: AuthStatusEnum.INACTIVE,
      password: null,
      temp_password: hashedPassword,
    });

    await this.smsService.sendOtp({
      phoneNumber: dto.phone_number,
      otp,
    });
  }

  async confirmPhone({
    otp,
    phone_number,
  }: {
    otp: string;
    phone_number: string;
  }) {
    const user = await this.usersService.findOneByPhoneNumber({
      phone_number,
    });

    if (user?.status !== AuthStatusEnum.INACTIVE) {
      throw new BadRequestException(
        ERRORS('User is already active. Please login'),
      );
    }

    const isValidOtp = await bcrypt.compare(otp, user.temp_password!);

    if (!isValidOtp) {
      throw new BadRequestException(ERRORS('Invalid otp. Please try again'));
    }

    await this.userRepository.updateOne({
      id: user.id,
      payload: {
        status: AuthStatusEnum.ACTIVE,
        password: null,
        temp_password: null,
      },
    });

    const SessionHash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = await this.sessionService.createOne({
      user_id: user.id,
      hash: SessionHash,
      active: true,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokens({
      user_id: user.id,
      session_id: session.id,
      hash: SessionHash,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
    };
  }

  async forgotPassword({
    email,
    phone_number,
  }: AuthForgotPasswordDto): Promise<void> {
    if (!email && !phone_number) {
      throw new BadRequestException(
        ERRORS('Email or phone number is required'),
      );
    }

    const user = email
      ? await this.usersService.findOneByEmail({
          email,
        })
      : await this.usersService.findOneByPhoneNumber({
          phone_number: phone_number!,
        });

    const saltRounds = this.configService.getOrThrow('auth.saltRounds', {
      infer: true,
    });
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, saltRounds);

    await this.userRepository.updateOne({
      id: user.id,
      payload: { temp_password: hashedOtp },
    });

    if (email) {
      await this.mailService.forgotPassword({
        to: email,
        data: {
          hash: otp,
        },
      });
    } else {
      await this.smsService.sendOtp({
        phoneNumber: phone_number!,
        otp,
      });
    }
  }

  async refreshToken(data: Pick<JwtRefreshPayloadType, 'session_id' | 'hash'>) {
    const session = await this.sessionService.findOne({
      id: data.session_id,
    });

    if (session.hash !== data.hash) {
      throw new UnauthorizedException();
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    await this.sessionService.updateOne({
      id: session.id,
      payload: {
        hash,
      },
    });

    const { token, refreshToken, tokenExpires } = await this.getTokens({
      user_id: session.user_id,
      session_id: session.id,
      hash,
    });

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }

  private async getTokens(data: Omit<JwtPayloadType, 'exp' | 'iat'>) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          ...data,
          iat: Date.now(),
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          ...data,
          iat: Date.now(),
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}
