import { Injectable } from '@nestjs/common';
import {
  ClientReviewRepository,
  FreelancerReviewRepository,
} from './infrastructure/repository';
import {
  CreateClientReviewDto,
  CreateFreelancerReviewDto,
  UpdateClientReviewDto,
  UpdateFreelancerReviewDto,
} from './dto/review.dto';
import {
  ClientReviewEntity,
  FreelancerReviewEntity,
} from './infrastructure/entity';

@Injectable()
export class ReviewService {
  constructor(
    private readonly clientReviewRepository: ClientReviewRepository,
    private readonly freelancerReviewRepository: FreelancerReviewRepository,
  ) {}

  async getClientReview(id: string): Promise<ClientReviewEntity | null> {
    return this.clientReviewRepository.findOne({ id });
  }

  async getClientReviewsByClient(
    client_id: string,
  ): Promise<ClientReviewEntity[]> {
    return this.clientReviewRepository.findByClient({ client_id });
  }

  async createClientReview(
    createClientReviewDto: CreateClientReviewDto,
  ): Promise<ClientReviewEntity> {
    return this.clientReviewRepository.create(createClientReviewDto);
  }

  async updateClientReview(
    id: string,
    updateClientReviewDto: UpdateClientReviewDto,
  ): Promise<ClientReviewEntity> {
    return this.clientReviewRepository.update(id, updateClientReviewDto);
  }

  async deleteClientReview(id: string): Promise<void> {
    return this.clientReviewRepository.delete(id);
  }

  async getFreelancerReview(id: string): Promise<FreelancerReviewEntity | null> {
    return this.freelancerReviewRepository.findOne({ id });
  }

  async getFreelancerReviewsByFreelancer(
    freelancer_id: string,
  ): Promise<FreelancerReviewEntity[]> {
    return this.freelancerReviewRepository.findByFreelancer({ freelancer_id });
  }

  async createFreelancerReview(
    createFreelancerReviewDto: CreateFreelancerReviewDto,
  ): Promise<FreelancerReviewEntity> {
    return this.freelancerReviewRepository.create(createFreelancerReviewDto);
  }

  async updateFreelancerReview(
    id: string,
    updateFreelancerReviewDto: UpdateFreelancerReviewDto,
  ): Promise<FreelancerReviewEntity> {
    return this.freelancerReviewRepository.update(id, updateFreelancerReviewDto);
  }

  async deleteFreelancerReview(id: string): Promise<void> {
    return this.freelancerReviewRepository.delete(id);
  }
}
