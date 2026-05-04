import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { FreelancerService } from './freelancer.service';
import {
  CreateFreelancerDto,
  UpdateFreelancerDto,
} from './dto/freelancer.dto';

@Controller('freelancers')
export class FreelancerController {
  constructor(private readonly freelancerService: FreelancerService) {}

  @Get(':user_id')
  async getFreelancer(@Param('user_id') user_id: string) {
    return this.freelancerService.getFreelancerByUserId(user_id);
  }

  @Post()
  async createFreelancer(@Body() createFreelancerDto: CreateFreelancerDto) {
    return this.freelancerService.createFreelancer(createFreelancerDto);
  }

  @Put(':user_id')
  async updateFreelancer(
    @Param('user_id') user_id: string,
    @Body() updateFreelancerDto: UpdateFreelancerDto,
  ) {
    return this.freelancerService.updateFreelancer(user_id, updateFreelancerDto);
  }

  @Delete(':user_id')
  async deleteFreelancer(@Param('user_id') user_id: string) {
    return this.freelancerService.deleteFreelancer(user_id);
  }
}
