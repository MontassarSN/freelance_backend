import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import {
  CreatePortfolioDto,
  UpdatePortfolioDto,
} from './dto/portfolio.dto';

@Controller('portfolios')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get(':user_id')
  async getPortfolio(@Param('user_id') user_id: string) {
    return this.portfolioService.getPortfolioByUserId(user_id);
  }

  @Post()
  async createPortfolio(@Body() createPortfolioDto: CreatePortfolioDto) {
    return this.portfolioService.createPortfolio(createPortfolioDto);
  }

  @Put(':user_id')
  async updatePortfolio(
    @Param('user_id') user_id: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
  ) {
    return this.portfolioService.updatePortfolio(user_id, updatePortfolioDto);
  }

  @Delete(':user_id')
  async deletePortfolio(@Param('user_id') user_id: string) {
    return this.portfolioService.deletePortfolio(user_id);
  }
}
