import { Bid } from '../entities/Bid';

export interface BidQueueRepository {
  enqueue(bid: Bid): Promise<void>;
} 