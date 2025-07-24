export type AuctionStatus = 'pending' | 'active' | 'suspended' | 'finished';

export interface Bid {
  userId: string;
  amount: number;
  timestamp: Date;
}

export class Auction {
  public readonly id: string;
  public readonly productId: string;
  public readonly sellerId: string;
  public readonly basePrice: number;
  public status: AuctionStatus;
  public readonly bids: Bid[] = [];
  public readonly createdAt: Date;
  public readonly durationMinutes: number;
  public readonly region: string;

  constructor(params: {
    id: string;
    productId: string;
    sellerId: string;
    basePrice: number;
    durationMinutes: number;
    region: string;
    status?: AuctionStatus;
    createdAt?: Date;
  }) {
    this.id = params.id;
    this.productId = params.productId;
    this.sellerId = params.sellerId;
    this.basePrice = params.basePrice;
    this.durationMinutes = params.durationMinutes;
    this.region = params.region;
    this.status = params.status ?? 'pending';
    this.createdAt = params.createdAt ?? new Date();
  }

  get highestBid(): Bid | null {
    if (this.bids.length === 0) return null;
    return this.bids.reduce((max, bid) => (bid.amount > max.amount ? bid : max), this.bids[0]);
  }

  get secondHighestBid(): Bid | null {
    if (this.bids.length < 2) return null;
    const sorted = [...this.bids].sort((a, b) => b.amount - a.amount);
    return sorted[1];
  }

  addBid(bid: Bid) {
    this.bids.push(bid);
  }
} 