import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nContext } from 'nestjs-i18n';
import { MailData } from './interfaces/mail-data.interface';
import { MailerService } from '../mailer/mailer.service';
import path from 'path';
import { AllConfigType } from 'src/app/config/types/config.type';
import { MaybeType } from '../../types/maybe.type';
import { I18nTranslations } from 'src/generated/i18n.generated';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async userSignUp(mailData: MailData<{ hash: string }>): Promise<void> {
    const i18n = I18nContext.current<I18nTranslations>();
    let emailConfirmTitle: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;

    if (i18n) {
      [emailConfirmTitle, text1, text2, text3] = await Promise.all([
        i18n.t('email.confirmEmail'),
        i18n.t('email.confirm-email-text1'),
        i18n.t('email.confirm-email-text2'),
        i18n.t('email.confirm-email-text3'),
      ]);
    }

    const hash = mailData.data.hash;

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: emailConfirmTitle,
      text: `${emailConfirmTitle}`,
      templatePath: path.join(
        process.cwd(),
        'src',
        'app',
        'shared',
        'services',
        'mail',
        'mail-templates',
        'activation.hbs',
      ),
      context: {
        title: emailConfirmTitle,
        hash,
        actionTitle: emailConfirmTitle,
        app_name: this.configService.get('app.name', { infer: true }),
        text1,
        text2,
        text3,
      },
    });
  }

  async forgotPassword(mailData: MailData<{ hash: string }>): Promise<void> {
    const i18n = I18nContext.current<I18nTranslations>();
    let resetPasswordTitle: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;
    let text4: MaybeType<string>;

    if (i18n) {
      [resetPasswordTitle, text1, text2, text3, text4] = await Promise.all([
        i18n.t('email.resetPassword'),
        i18n.t('email.reset-password-text1'),
        i18n.t('email.reset-password-text2'),
        i18n.t('email.reset-password-text3'),
        i18n.t('email.reset-password-text4'),
      ]);
    }

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: resetPasswordTitle,
      text: `${resetPasswordTitle}`,
      templatePath: path.join(
        process.cwd(),
        'src',
        'app',
        'shared',
        'services',
        'mail',
        'mail-templates',
        'reset-password.hbs',
      ),
      context: {
        title: resetPasswordTitle,
        hash: mailData.data.hash,
        actionTitle: resetPasswordTitle,
        app_name: this.configService.get('app.name', {
          infer: true,
        }),
        text1,
        text2,
        text3,
        text4,
      },
    });
  }
}
