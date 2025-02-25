import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UserRepository } from './infrastructure/repository';
import { DatabaseModule } from '../../database/database.module';
import { UsersService } from './user.service';
import { SessionModule } from '../sessions/sessions.module';
import { UsersHandler } from './handler';
import { NotificationsModule } from '../notification/module';

@Module({
  imports: [DatabaseModule, SessionModule, NotificationsModule],
  controllers: [UsersController],
  providers: [UserRepository, UsersService, UsersHandler],
  exports: [UserRepository, UsersService],
})
export class UsersModule {}
