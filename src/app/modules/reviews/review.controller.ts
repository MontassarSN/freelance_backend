import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import {
  CreateClientReviewDto,
  CreateFreelancerReviewDto,
  UpdateClientReviewDto,
  UpdateFreelancerReviewDto,
} from './dto/review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // Client Reviews
  @Get('client/:id')
  async getClientReview(@Param('id') id: string) {
    return this.reviewService.getClientReview(id);
  }

  @Get('client-by/:client_id')
  async getClientReviewsByClient(@Param('client_id') client_id: string) {
    return this.reviewService.getClientReviewsByClient(client_id);
  }

  @Post('client')
  async createClientReview(@Body() createClientReviewDto: CreateClientReviewDto) {
    return this.reviewService.createClientReview(createClientReviewDto);
  }

  @Put('client/:id')
  async updateClientReview(
    @Param('id') id: string,
    @Body() updateClientReviewDto: UpdateClientReviewDto,
  ) {
    return this.reviewService.updateClientReview(id, updateClientReviewDto);
  }

  @Delete('client/:id')
  async deleteClientReview(@Param('id') id: string) {
    return this.reviewService.deleteClientReview(id);
  }

  // Freelancer Reviews
  @Get('freelancer/:id')
  async getFreelancerReview(@Param('id') id: string) {
    return this.reviewService.getFreelancerReview(id);
  }

  @Get('freelancer-by/:freelancer_id')
  async getFreelancerReviewsByFreelancer(
    @Param('freelancer_id') freelancer_id: string,
  ) {
    return this.reviewService.getFreelancerReviewsByFreelancer(freelancer_id);
  }

  @Post('freelancer')
  async createFreelancerReview(
    @Body() createFreelancerReviewDto: CreateFreelancerReviewDto,
  ) {
    return this.reviewService.createFreelancerReview(createFreelancerReviewDto);
  }

  @Put('freelancer/:id')
  async updateFreelancerReview(
    @Param('id') id: string,
    @Body() updateFreelancerReviewDto: UpdateFreelancerReviewDto,
  ) {
    return this.reviewService.updateFreelancerReview(id, updateFreelancerReviewDto);
  }

  @Delete('freelancer/:id')
  async deleteFreelancerReview(@Param('id') id: string) {
    return this.reviewService.deleteFreelancerReview(id);
  }
}
