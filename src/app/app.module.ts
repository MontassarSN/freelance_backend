import { ConfigModule, ConfigService } from '@nestjs/config';
import { I18nModule, AcceptLanguageResolver } from 'nestjs-i18n';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MiddlewareConsumer, Module, Scope } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './shared/logger/logger.module';
import { DatabaseModule } from './database/database.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import appConfig from './config/app.conf';
import { join } from 'path';
import { CronModule } from './shared/cron/cron.module';
import { AllExceptionsFilter } from './shared/exceptionFilters/AllExceptionsFilter.filter';
import { RequestIdMiddleware } from './shared/middleware/RequestIdMiddleware';
import { UsersModule } from './modules/users/user.module';
import { SessionModule } from './modules/sessions/sessions.module';
import mailConfig from './config/mail.config';
import authConfig from './config/auth.config';
import smsConfig from './config/sms.config';
import { AuthModule } from './modules/auth/auth.module';
import dbxConfig from './config/dbx.config';
import { FilesModule } from './modules/files/files.module';
import { NotificationsModule } from './modules/notification/module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AllConfigType } from './config/types/config.type';
import { SentryModule } from '@sentry/nestjs/setup';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 20 * 1000, // 20 seconds
          limit: 60,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, mailConfig, authConfig, smsConfig, dbxConfig],
      envFilePath: ['.env'],
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        fallbacks: {
          'en-CA': 'fr',
          'en-*': 'en',
          'fr-*': 'fr',
          'ar-*': 'ar',
          '*': 'ar',
        },
        loaderOptions: {
          path: join(process.cwd(), 'src/assets/i18n'),
          watch: true,
        },
        typesOutputPath: join(process.cwd(), 'src/generated/i18n.generated.ts'),
      }),
      resolvers: [
        {
          use: AcceptLanguageResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot({
      ignoreErrors: false,
      wildcard: false,
      verboseMemoryLeak: true,
      global: true,
    }),
    SentryModule.forRoot(),
    CronModule,
    DatabaseModule,
    LoggerModule,
    AuthModule,
    UsersModule,
    SessionModule,
    FilesModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
      scope: Scope.REQUEST,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
