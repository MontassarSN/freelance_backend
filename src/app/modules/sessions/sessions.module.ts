import { Module } from '@nestjs/common';
import { SessionController } from './sessions.controller';
import { SessionRepository } from './infrastructure/repository';
import { DatabaseModule } from '../../database/database.module';
import { SessionService } from './sessions.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SessionController],
  providers: [SessionRepository, SessionService],
  exports: [SessionRepository, SessionService],
})
export class SessionModule {}
