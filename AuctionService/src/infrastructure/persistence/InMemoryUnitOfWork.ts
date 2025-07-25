import { UnitOfWork } from '../../domain/services/UnitOfWork';
import { AuctionRepository } from '../../domain/repositories/AuctionRepository';
import { InMemoryAuctionRepository } from './InMemoryAuctionRepository';

export class InMemoryUnitOfWork implements UnitOfWork {
  private auctionRepo = new InMemoryAuctionRepository();
  async start() {}
  async commit() {}
  async rollback() {}
  getAuctionRepository(): AuctionRepository {
    return this.auctionRepo;
  }
} 