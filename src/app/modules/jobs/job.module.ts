import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { JobRepository } from './infrastructure/repository';
import { JobBudgetRepository } from './infrastructure/budget.repository';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [JobController],
  providers: [JobRepository, JobBudgetRepository, JobService],
  exports: [JobRepository, JobBudgetRepository, JobService],
})
export class JobModule {}
