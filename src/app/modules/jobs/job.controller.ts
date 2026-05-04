import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';
import { CreateJobBudgetDto, UpdateJobBudgetDto } from './dto/budget.dto';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get(':id')
  async getJob(@Param('id') id: string) {
    return this.jobService.getJob(id);
  }

  @Get('client/:client_id')
  async getJobsByClient(@Param('client_id') client_id: string) {
    return this.jobService.getJobsByClient(client_id);
  }

  @Post()
  async createJob(@Body() createJobDto: CreateJobDto) {
    return this.jobService.createJob(createJobDto);
  }

  @Put(':id')
  async updateJob(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return this.jobService.updateJob(id, updateJobDto);
  }

  @Delete(':id')
  async deleteJob(@Param('id') id: string) {
    return this.jobService.deleteJob(id);
  }

  @Get(':job_id/budget')
  async getJobBudget(@Param('job_id') job_id: string) {
    return this.jobService.getJobBudget(job_id);
  }

  @Post('budget')
  async createJobBudget(@Body() createJobBudgetDto: CreateJobBudgetDto) {
    return this.jobService.createJobBudget(createJobBudgetDto);
  }

  @Put(':job_id/budget')
  async updateJobBudget(
    @Param('job_id') job_id: string,
    @Body() updateJobBudgetDto: UpdateJobBudgetDto,
  ) {
    return this.jobService.updateJobBudget(job_id, updateJobBudgetDto);
  }

  @Delete(':job_id/budget')
  async deleteJobBudget(@Param('job_id') job_id: string) {
    return this.jobService.deleteJobBudget(job_id);
  }
}
