import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthConfirmEmailDto } from './dto/auth-confirm-email.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { AuthenticatedUser } from './decorators/user.decorator';
import { AuthRegisterLoginPhoneDto } from './dto/auth-register-login-phone.dto';
import { AuthConfirmPhoneDto } from './dto/auth-confirm-phone.dto';
import { AuthPhoneLoginDto } from './dto/auth-phone-login.dto';
import { AuthOtpLoginDto } from './dto/auth-otp-login.dto';
import { TRANSACTION_PROVIDER } from 'src/app/database/conf/constants';
import { ITransaction } from 'src/app/database/types/transaction';
import { JwtAuthGuard } from './guards/jwt.guard';
import { DeviseToken } from './decorators/device-token.decorator';
import { AuthProvidersEnum } from '../users/infrastructure/entity';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly service: AuthService,
    @Inject(TRANSACTION_PROVIDER) private readonly trx: ITransaction,
  ) {}

  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() loginDto: AuthEmailLoginDto,
    @DeviseToken() deviseToken: string,
  ) {
    const { refreshToken, token, tokenExpires } =
      await this.service.validateEmailLogin(loginDto, deviseToken);
    this.trx.commit();
    return {
      refresh_token: refreshToken,
      access_token: token,
      token_expires: tokenExpires,
    };
  }

  @Post('email/register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() createUserDto: AuthRegisterLoginDto): Promise<void> {
    await this.service.registerEmail(createUserDto);
    this.trx.commit();
  }

  @Post('email/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmEmail(@Body() confirmEmailDto: AuthConfirmEmailDto) {
    const { refreshToken, token, tokenExpires } =
      await this.service.confirmEmail(confirmEmailDto);
    this.trx.commit();
    return {
      refresh_token: refreshToken,
      access_token: token,
      token_expires: tokenExpires,
    };
  }

  @Post('phone/login')
  @HttpCode(HttpStatus.OK)
  public async loginPhone(
    @Body() loginDto: AuthPhoneLoginDto,
    @DeviseToken() deviseToken: string,
  ) {
    const { refreshToken, token, tokenExpires } =
      await this.service.validatePhoneLogin(loginDto, deviseToken);
    this.trx.commit();
    return {
      refresh_token: refreshToken,
      access_token: token,
      token_expires: tokenExpires,
    };
  }

  @Post('phone/register')
  @HttpCode(HttpStatus.OK)
  async registerPhone(
    @Body() createUserDto: AuthRegisterLoginPhoneDto,
  ): Promise<void> {
    await this.service.registerPhone(createUserDto);
    this.trx.commit();
  }

  @Post('phone/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmPhone(@Body() confirmPhoneDto: AuthConfirmPhoneDto) {
    const { refreshToken, token, tokenExpires } =
      await this.service.confirmPhone(confirmPhoneDto);
    this.trx.commit();
    return {
      refresh_token: refreshToken,
      access_token: token,
      token_expires: tokenExpires,
    };
  }

  @Post('forgot/password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<void> {
    await this.service.forgotPassword(forgotPasswordDto);
    this.trx.commit();
  }

  @Post('otp/login')
  @HttpCode(HttpStatus.OK)
  public async loginOtp(
    @Body() loginDto: AuthOtpLoginDto,
    @DeviseToken() deviseToken: string,
  ) {
    const { refreshToken, token, tokenExpires } =
      await this.service.validateOtpLogin(loginDto, deviseToken);

    this.trx.commit();
    return {
      refresh_token: refreshToken,
      access_token: token,
      token_expires: tokenExpires,
    };
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public async refresh(@AuthenticatedUser() user: JwtRefreshPayloadType) {
    const { refreshToken, token, tokenExpires } =
      await this.service.refreshToken({
        session_id: user.session_id,
        hash: user.hash,
      });
    this.trx.commit();
    return {
      refresh_token: refreshToken,
      access_token: token,
      token_expires: tokenExpires,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async logout(
    @AuthenticatedUser() user: JwtPayloadType,
  ): Promise<void> {
    await this.service.logout({
      user_id: user.user_id,
    });
    this.trx.commit();
  }

  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  async auth() {
    return HttpStatus.OK;
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @AuthenticatedUser() user: any,
    @DeviseToken() deviseToken: string,
  ) {
    const { refreshToken, token, tokenExpires } =
      await this.service.validateSocialLogin(
        AuthProvidersEnum.GOOGLE,
        user,
        deviseToken,
      );

    this.trx.commit();

    return { refreshToken, token, tokenExpires };
  }

  // @Post('google/callback')
  // @HttpCode(HttpStatus.OK)
  // async loginWithGoogle(@Body() loginDto: AuthGoogleLoginDto) {
  //   const socialData = await this.authGoogleService.getProfileByToken(loginDto);
  //   const { refreshToken, token, tokenExpires } =
  //     await this.service.validateSocialLogin(
  //       AuthProvidersEnum.GOOGLE,
  //       socialData,
  //     );

  //   return { refreshToken, token, tokenExpires };
  // }

  @Get('facebook/login')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(
    @AuthenticatedUser() user: any,
    @DeviseToken() deviseToken: string,
  ): Promise<any> {
    const { refreshToken, token, tokenExpires } =
      await this.service.validateSocialLogin(
        AuthProvidersEnum.FACEBOOK,
        user,
        deviseToken,
      );

    this.trx.commit();

    return { refreshToken, token, tokenExpires };
  }

  @Get('linkedin/login')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  async linkedinLoginRedirect(
    @AuthenticatedUser() user: any,
    @DeviseToken() deviseToken: string,
  ): Promise<any> {
    const { refreshToken, token, tokenExpires } =
      await this.service.validateSocialLogin(
        AuthProvidersEnum.LINKEDIN,
        user,
        deviseToken,
      );

    this.trx.commit();

    return { refreshToken, token, tokenExpires };
  }
}
