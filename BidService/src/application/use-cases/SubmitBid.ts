import { BidQueueRepository } from '../../domain/repositories/BidQueueRepository';
import { BidDTO } from '../dtos/BidDTO';

export class SubmitBid {
  constructor(private bidQueueRepo: BidQueueRepository) {}

  async execute(bidDto: BidDTO): Promise<{ success: boolean; message: string }> {
    // Validación básica
    if (!bidDto.auctionId || !bidDto.userId || typeof bidDto.amount !== 'number') {
      return { success: false, message: 'Invalid bid data' };
    }
    if (bidDto.amount < 1) {
      return { success: false, message: 'Bid amount must be at least 1' };
    }

    const bid = {
      ...bidDto,
      timestamp: new Date(),
    };

    await this.bidQueueRepo.enqueue(bid);

    // Aquí se puede agregar lógica de logging, monitoreo, etc.
    return { success: true, message: 'Bid submitted to queue' };
  }
} 