import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import {
  ClientReviewRepository,
  FreelancerReviewRepository,
} from './infrastructure/repository';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ReviewController],
  providers: [ClientReviewRepository, FreelancerReviewRepository, ReviewService],
  exports: [ClientReviewRepository, FreelancerReviewRepository, ReviewService],
})
export class ReviewModule {}
