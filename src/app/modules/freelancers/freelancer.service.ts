import { Injectable } from '@nestjs/common';
import { FreelancerRepository } from './infrastructure/repository';
import {
  CreateFreelancerDto,
  UpdateFreelancerDto,
} from './dto/freelancer.dto';
import { FreelancerEntity } from './infrastructure/entity';

@Injectable()
export class FreelancerService {
  constructor(private readonly freelancerRepository: FreelancerRepository) {}

  async getFreelancerByUserId(user_id: string): Promise<FreelancerEntity | null> {
    return this.freelancerRepository.findOne({ user_id });
  }

  async createFreelancer(
    createFreelancerDto: CreateFreelancerDto,
  ): Promise<FreelancerEntity> {
    return this.freelancerRepository.create(createFreelancerDto);
  }

  async updateFreelancer(
    user_id: string,
    updateFreelancerDto: UpdateFreelancerDto,
  ): Promise<FreelancerEntity> {
    return this.freelancerRepository.update(user_id, updateFreelancerDto);
  }

  async deleteFreelancer(user_id: string): Promise<void> {
    return this.freelancerRepository.delete(user_id);
  }
}
