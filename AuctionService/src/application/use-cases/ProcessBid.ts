import { AuctionRepository } from '../../domain/repositories/AuctionRepository';
import { BidDTO } from '../dtos/BidDTO';
import { Auction, Bid } from '../../domain/entities/Auction';
import { EventPublisher } from '../../domain/services/EventPublisher';
import axios from 'axios'; // Requiere instalar axios: npm install axios y npm install --save-dev @types/axios

export class ProcessBid {
  constructor(
    private auctionRepo: AuctionRepository,
    private eventPublisher: EventPublisher
  ) {}

  async execute(bidDto: BidDTO): Promise<{ success: boolean; message: string }> {
    const auction = await this.auctionRepo.findById(bidDto.auctionId);
    if (!auction) {
      // Registrar intento fallido en auditoría
      await axios.post('http://audit-service:3000/api/audit', {
        service: 'AuctionService',
        type: 'BID_ATTEMPT',
        payload: {
          auctionId: bidDto.auctionId,
          userId: bidDto.userId,
          amount: bidDto.amount,
          timestamp: new Date().toISOString(),
          result: 'rejected',
          reason: 'Auction not found'
        }
      }).catch(() => {}); // Ignorar error de auditoría para no afectar flujo principal
      return { success: false, message: 'Auction not found' };
    }
    if (auction.status !== 'active') {
      await axios.post('http://audit-service:3000/api/audit', {
        service: 'AuctionService',
        type: 'BID_ATTEMPT',
        payload: {
          auctionId: bidDto.auctionId,
          userId: bidDto.userId,
          amount: bidDto.amount,
          timestamp: new Date().toISOString(),
          result: 'rejected',
          reason: 'Auction not active'
        }
      }).catch(() => {});
      return { success: false, message: 'Auction not active' };
    }

    const minIncrement = 1;
    const highest = auction.highestBid;
    const minBid = highest ? highest.amount + minIncrement : auction.basePrice;

    if (bidDto.amount < minBid) {
      await axios.post('http://audit-service:3000/api/audit', {
        service: 'AuctionService',
        type: 'BID_ATTEMPT',
        payload: {
          auctionId: bidDto.auctionId,
          userId: bidDto.userId,
          amount: bidDto.amount,
          timestamp: new Date().toISOString(),
          result: 'rejected',
          reason: `Bid below minimum (${minBid})`
        }
      }).catch(() => {});
      return { success: false, message: `Bid must be at least ${minBid}` };
    }

    const bid: Bid = {
      userId: bidDto.userId,
      amount: bidDto.amount,
      timestamp: new Date(bidDto.timestamp),
    };

    auction.addBid(bid);
    await this.auctionRepo.save(auction);
    await this.eventPublisher.publish({
      type: 'NEW_HIGHEST_BID',
      auctionId: auction.id,
      userId: bid.userId,
      amount: bid.amount,
      timestamp: bid.timestamp.toISOString(),
    });
    // Registrar puja aceptada en auditoría
    await axios.post('http://audit-service:3000/api/audit', {
      service: 'AuctionService',
      type: 'BID_ATTEMPT',
      payload: {
        auctionId: auction.id,
        userId: bid.userId,
        amount: bid.amount,
        timestamp: bid.timestamp.toISOString(),
        result: 'accepted'
      }
    }).catch(() => {});
    return { success: true, message: 'Bid processed and event published' };
  }
} 