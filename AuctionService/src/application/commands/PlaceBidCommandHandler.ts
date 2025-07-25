import { BidDTO } from '../../dtos/BidDTO';
import { UnitOfWork } from '../../../domain/services/UnitOfWork';
import { EventPublisher } from '../../../domain/services/EventPublisher';
import axios from 'axios';

export class PlaceBidCommandHandler {
  constructor(
    private unitOfWork: UnitOfWork,
    private eventPublisher: EventPublisher
  ) {}

  async execute(bidDto: BidDTO): Promise<{ success: boolean; message: string }> {
    await this.unitOfWork.start();
    try {
      const auctionRepo = this.unitOfWork.getAuctionRepository();
      const auction = await auctionRepo.findById(bidDto.auctionId);
      if (!auction) {
        await this.audit('rejected', bidDto, 'Auction not found');
        return { success: false, message: 'Auction not found' };
      }
      if (auction.status !== 'active') {
        await this.audit('rejected', bidDto, 'Auction not active');
        return { success: false, message: 'Auction not active' };
      }
      const minIncrement = 1;
      const highest = auction.highestBid;
      const minBid = highest ? highest.amount + minIncrement : auction.basePrice;
      if (bidDto.amount < minBid) {
        await this.audit('rejected', bidDto, `Bid below minimum (${minBid})`);
        return { success: false, message: `Bid must be at least ${minBid}` };
      }
      const bid = {
        userId: bidDto.userId,
        amount: bidDto.amount,
        timestamp: new Date(bidDto.timestamp),
      };
      auction.addBid(bid);
      await auctionRepo.save(auction);
      await this.eventPublisher.publish({
        type: 'NEW_HIGHEST_BID',
        auctionId: auction.id,
        userId: bid.userId,
        amount: bid.amount,
        timestamp: bid.timestamp.toISOString(),
      });
      await this.audit('accepted', bidDto);
      await this.unitOfWork.commit();
      return { success: true, message: 'Bid processed and event published' };
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }

  private async audit(result: string, bidDto: BidDTO, reason?: string) {
    await axios.post('http://audit-service:3000/api/audit', {
      service: 'AuctionService',
      type: 'BID_ATTEMPT',
      payload: {
        auctionId: bidDto.auctionId,
        userId: bidDto.userId,
        amount: bidDto.amount,
        timestamp: new Date().toISOString(),
        result,
        ...(reason ? { reason } : {})
      }
    }).catch(() => {});
  }
} 