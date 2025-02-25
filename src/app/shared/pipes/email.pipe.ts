import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseEmailPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new BadRequestException('Invalid email format');
    }
    return value;
  }
}
