import {
  ColumnType,
  GeneratedAlways,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';

export interface KyselyClientReviewEntity {
  id: GeneratedAlways<string>;
  job_id: string;
  reviewer_id: string;
  client_id: string;
  rating: number; // CHECK (rating >= 1 AND rating <= 5)
  comment: ColumnType<string, string | undefined, string>;
  created_at: GeneratedAlways<Date>;
}

export interface KyselyFreelancerReviewEntity {
  id: GeneratedAlways<string>;
  job_id: string;
  reviewer_id: string;
  freelancer_id: string;
  rating: number; // CHECK (rating >= 1 AND rating <= 5)
  comment: ColumnType<string, string | undefined, string>;
  created_at: GeneratedAlways<Date>;
}

export type ClientReviewEntity = Selectable<KyselyClientReviewEntity>;
export type NewClientReview = Insertable<KyselyClientReviewEntity>;
export type UpdateClientReview = Updateable<KyselyClientReviewEntity>;

export type FreelancerReviewEntity = Selectable<KyselyFreelancerReviewEntity>;
export type NewFreelancerReview = Insertable<KyselyFreelancerReviewEntity>;
export type UpdateFreelancerReview = Updateable<KyselyFreelancerReviewEntity>;
