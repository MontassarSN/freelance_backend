import { Module } from '@nestjs/common';
import { FreelancerController } from './freelancer.controller';
import { FreelancerService } from './freelancer.service';
import { FreelancerRepository } from './infrastructure/repository';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [FreelancerController],
  providers: [FreelancerRepository, FreelancerService],
  exports: [FreelancerRepository, FreelancerService],
})
export class FreelancerModule {}
