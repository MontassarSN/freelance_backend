import { Injectable } from '@nestjs/common';
import { PortfolioRepository } from './infrastructure/repository';
import {
  CreatePortfolioDto,
  UpdatePortfolioDto,
} from './dto/portfolio.dto';
import { PortfolioEntity } from './infrastructure/entity';

@Injectable()
export class PortfolioService {
  constructor(private readonly portfolioRepository: PortfolioRepository) {}

  async getPortfolioByUserId(user_id: string): Promise<PortfolioEntity | null> {
    return this.portfolioRepository.findOne({ user_id });
  }

  async createPortfolio(
    createPortfolioDto: CreatePortfolioDto,
  ): Promise<PortfolioEntity> {
    return this.portfolioRepository.create(createPortfolioDto);
  }

  async updatePortfolio(
    user_id: string,
    updatePortfolioDto: UpdatePortfolioDto,
  ): Promise<PortfolioEntity> {
    return this.portfolioRepository.update(user_id, updatePortfolioDto);
  }

  async deletePortfolio(user_id: string): Promise<void> {
    return this.portfolioRepository.delete(user_id);
  }
}
