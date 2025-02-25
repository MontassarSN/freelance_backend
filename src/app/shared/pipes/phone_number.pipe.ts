import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParsePhoneNumberPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(value)) {
      throw new BadRequestException('Invalid phone number format');
    }
    return value;
  }
}
