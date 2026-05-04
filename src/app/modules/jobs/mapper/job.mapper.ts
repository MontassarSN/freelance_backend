import { JobEntity } from '../infrastructure/entity';

export default function JobMapper<T extends Partial<JobEntity>>(job: T) {
  return job;
}
