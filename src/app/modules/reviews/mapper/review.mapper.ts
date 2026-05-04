import {
  ClientReviewEntity,
  FreelancerReviewEntity,
} from '../infrastructure/entity';

export function ClientReviewMapper<T extends Partial<ClientReviewEntity>>(
  review: T,
) {
  return review;
}

export function FreelancerReviewMapper<T extends Partial<FreelancerReviewEntity>>(
  review: T,
) {
  return review;
}
