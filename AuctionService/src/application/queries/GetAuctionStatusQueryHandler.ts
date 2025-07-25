import { AuctionRepository } from '../../domain/repositories/AuctionRepository';

export class GetAuctionStatusQueryHandler {
  constructor(private auctionRepo: AuctionRepository) {}

  async execute(auctionId: string) {
    const auction = await this.auctionRepo.findById(auctionId);
    if (!auction) return null;
    return {
      id: auction.id,
      productId: auction.productId,
      basePrice: auction.basePrice,
      status: auction.status,
      highestBid: auction.highestBid,
      bids: auction.bids,
      createdAt: auction.createdAt,
      durationMinutes: auction.durationMinutes,
      region: auction.region
    };
  }
} 