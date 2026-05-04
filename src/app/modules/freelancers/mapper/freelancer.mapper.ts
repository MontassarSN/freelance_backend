import { FreelancerEntity } from '../infrastructure/entity';

export default function FreelancerMapper<T extends Partial<FreelancerEntity>>(
  freelancer: T,
) {
  return freelancer;
}
