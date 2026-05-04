import { KyselySessionEntity } from 'src/app/modules/sessions/infrastructure/entity';
import { KyselyUserEntity } from 'src/app/modules/users/infrastructure/entity';
import {
  KyselyNotificationEntity,
  KyselyUsersNotificationEntity,
} from 'src/app/modules/notification/infrastructure/entity';
import { KyselyClientEntity } from 'src/app/modules/clients/infrastructure/entity';
import { KyselyFreelancerEntity } from 'src/app/modules/freelancers/infrastructure/entity';
import { KyselyJobEntity } from 'src/app/modules/jobs/infrastructure/entity';
import { KyselyJobBudgetEntity } from 'src/app/modules/jobs/infrastructure/budget.entity';
import {
  KyselyClientReviewEntity,
  KyselyFreelancerReviewEntity,
} from 'src/app/modules/reviews/infrastructure/entity';
import { KyselyPortfolioEntity } from 'src/app/modules/portfolios/infrastructure/entity';

export interface IDb {
  users: KyselyUserEntity;
  sessions: KyselySessionEntity;
  files: never;
  notifications: KyselyNotificationEntity;
  users_notifications: KyselyUsersNotificationEntity;
  clients: KyselyClientEntity;
  freelancers: KyselyFreelancerEntity;
  jobs: KyselyJobEntity;
  job_budget: KyselyJobBudgetEntity;
  clients_reviews: KyselyClientReviewEntity;
  freelancers_reviews: KyselyFreelancerReviewEntity;
  portfolios: KyselyPortfolioEntity;
}
