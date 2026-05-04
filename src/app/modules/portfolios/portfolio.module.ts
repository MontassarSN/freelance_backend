import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { PortfolioRepository } from './infrastructure/repository';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PortfolioController],
  providers: [PortfolioRepository, PortfolioService],
  exports: [PortfolioRepository, PortfolioService],
})
export class PortfolioModule {}
