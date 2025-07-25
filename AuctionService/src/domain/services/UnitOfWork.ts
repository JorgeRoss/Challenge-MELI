import { AuctionRepository } from '../repositories/AuctionRepository';

export interface UnitOfWork {
  start(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  getAuctionRepository(): AuctionRepository;
} 