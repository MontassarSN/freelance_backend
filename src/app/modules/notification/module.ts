import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { SessionModule } from '../sessions/sessions.module';
import { NotificationsController } from './controller';
import { NotificationsRepository } from './infrastructure/repository';
import { NotificationsService } from './service';
import { FirebaseService } from './firebase.service';

@Module({
  imports: [DatabaseModule, SessionModule],
  controllers: [NotificationsController],
  providers: [NotificationsRepository, NotificationsService, FirebaseService],
  exports: [NotificationsRepository, NotificationsService, FirebaseService],
})
export class NotificationsModule {}
