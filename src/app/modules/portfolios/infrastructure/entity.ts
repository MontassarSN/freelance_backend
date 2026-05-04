import {
  ColumnType,
  GeneratedAlways,
  Insertable,
  Selectable,
  Updateable,
} from 'kysely';

export interface KyselyPortfolioEntity {
  user_id: string;
  title: ColumnType<string | null, string | null | undefined, string | null>;
  description: ColumnType<string | null, string | null | undefined, string | null>;
  image_url: ColumnType<string | null, string | null | undefined, string | null>;
  link: string;
}

export type PortfolioEntity = Selectable<KyselyPortfolioEntity>;
export type NewPortfolio = Insertable<KyselyPortfolioEntity>;
export type UpdatePortfolio = Updateable<KyselyPortfolioEntity>;
