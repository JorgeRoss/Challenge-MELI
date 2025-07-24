import { AuctionRepository } from '../../domain/repositories/AuctionRepository';
import { BidDTO } from '../dtos/BidDTO';
import { Auction, Bid } from '../../domain/entities/Auction';
import { SnsPublisher } from '../../infrastructure/sns/SnsPublisher';

export class ProcessBid {
  constructor(
    private auctionRepo: AuctionRepository,
    private snsPublisher: SnsPublisher
  ) {}

  async execute(bidDto: BidDTO): Promise<{ success: boolean; message: string }> {
    const auction = await this.auctionRepo.findById(bidDto.auctionId);
    if (!auction) return { success: false, message: 'Auction not found' };
    if (auction.status !== 'active') return { success: false, message: 'Auction not active' };

    const minIncrement = 1;
    const highest = auction.highestBid;
    const minBid = highest ? highest.amount + minIncrement : auction.basePrice;

    if (bidDto.amount < minBid) {
      return { success: false, message: `Bid must be at least ${minBid}` };
    }

    const bid: Bid = {
      userId: bidDto.userId,
      amount: bidDto.amount,
      timestamp: new Date(bidDto.timestamp),
    };

    auction.addBid(bid);
    await this.auctionRepo.save(auction);

    // Publicar evento en SNS (simulado)
    await this.snsPublisher.publish({
      type: 'NEW_HIGHEST_BID',
      auctionId: auction.id,
      userId: bid.userId,
      amount: bid.amount,
      timestamp: bid.timestamp.toISOString(),
    });

    return { success: true, message: 'Bid processed and event published' };
  }
} 