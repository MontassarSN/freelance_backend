import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AllConfigType } from 'src/app/config/types/config.type';

@Injectable()
export class SmsService {
  constructor(private configService: ConfigService<AllConfigType>) {}

  async sendOtpToMobile({
    phoneNumber,
    otp,
  }: {
    phoneNumber: string;
    otp: string;
  }): Promise<void> {
    const api_url = this.configService.getOrThrow('sms.url', {
      infer: true,
    });
    const key = this.configService.getOrThrow('sms.key', {
      infer: true,
    });
    const sender = this.configService.getOrThrow('sms.sender', {
      infer: true,
    });
    const func = this.configService.getOrThrow('sms.function', {
      infer: true,
    });
    const baseUrl = `${api_url}?fct=${func}&key=${key}&mobile=216XXXXXXXX&sms=Hello+World&sender=${sender}&date=jj/mm/aaaa&heure=hh:mm:ss`;

    const url = baseUrl
      .replace('216XXXXXXXX', phoneNumber)
      .replace('Hello+World', `Your OTP is ${otp}`)
      .replace('YYYYYYYY', 'MySender') // Replace with your sender ID
      .replace('jj/mm/aaaa', new Date().toDateString())
      .replace('hh:mm:ss', new Date().toTimeString());

    try {
      const response = await axios.get(url);
      if (response.status !== 200) {
        console.error('Failed to send OTP:', response.data);
        throw new InternalServerErrorException('Failed to send OTP via SMS');
      }
    } catch (error) {
      console.error('Error sending OTP via SMS', error);
      throw new InternalServerErrorException('Failed to send OTP via SMS');
    }
  }

  async sendOtp({
    phoneNumber,
    otp,
  }: {
    phoneNumber: string;
    otp: string;
  }): Promise<void> {
    await this.sendOtpToMobile({
      phoneNumber,
      otp,
    });
  }
}
