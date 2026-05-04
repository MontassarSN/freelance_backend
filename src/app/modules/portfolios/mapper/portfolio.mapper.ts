import { PortfolioEntity } from '../infrastructure/entity';

export default function PortfolioMapper<T extends Partial<PortfolioEntity>>(
  portfolio: T,
) {
  return portfolio;
}
