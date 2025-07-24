import { AuctionRepository } from '../../domain/repositories/AuctionRepository';
import { Auction } from '../../domain/entities/Auction';

export class InMemoryAuctionRepository implements AuctionRepository {
  private auctions: Map<string, Auction> = new Map();

  async findById(id: string): Promise<Auction | null> {
    return this.auctions.get(id) ?? null;
  }

  async save(auction: Auction): Promise<void> {
    this.auctions.set(auction.id, auction);
  }
} 