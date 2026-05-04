import { Injectable } from '@nestjs/common';
import { JobRepository } from './infrastructure/repository';
import { JobBudgetRepository } from './infrastructure/budget.repository';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';
import { CreateJobBudgetDto, UpdateJobBudgetDto } from './dto/budget.dto';
import { JobEntity } from './infrastructure/entity';
import { JobBudgetEntity } from './infrastructure/budget.entity';

@Injectable()
export class JobService {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly jobBudgetRepository: JobBudgetRepository,
  ) {}

  async getJob(id: string): Promise<JobEntity | null> {
    return this.jobRepository.findOne({ id });
  }

  async getJobsByClient(client_id: string): Promise<JobEntity[]> {
    return this.jobRepository.findByClient({ client_id });
  }

  async createJob(createJobDto: CreateJobDto): Promise<JobEntity> {
    return this.jobRepository.create(createJobDto);
  }

  async updateJob(id: string, updateJobDto: UpdateJobDto): Promise<JobEntity> {
    return this.jobRepository.update(id, updateJobDto);
  }

  async deleteJob(id: string): Promise<void> {
    return this.jobRepository.delete(id);
  }

  async getJobBudget(job_id: string): Promise<JobBudgetEntity | null> {
    return this.jobBudgetRepository.findOne({ job_id });
  }

  async createJobBudget(
    createJobBudgetDto: CreateJobBudgetDto,
  ): Promise<JobBudgetEntity> {
    return this.jobBudgetRepository.create(createJobBudgetDto);
  }

  async updateJobBudget(
    job_id: string,
    updateJobBudgetDto: UpdateJobBudgetDto,
  ): Promise<JobBudgetEntity> {
    return this.jobBudgetRepository.update(job_id, updateJobBudgetDto);
  }

  async deleteJobBudget(job_id: string): Promise<void> {
    return this.jobBudgetRepository.delete(job_id);
  }
}
