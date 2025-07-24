import { ProcessBid } from '../../application/use-cases/ProcessBid';
import { InMemoryAuctionRepository } from '../../infrastructure/persistence/InMemoryAuctionRepository';
import { SnsPublisher } from '../../infrastructure/sns/SnsPublisher';

const auctionRepo = new InMemoryAuctionRepository();
const snsPublisher = new SnsPublisher();
const processBid = new ProcessBid(auctionRepo, snsPublisher);

// Simulación de consumo de SQS
export async function consumeBidMessage(message: any) {
  // En producción, message vendría de SQS y sería un string JSON
  const bidDto = typeof message === 'string' ? JSON.parse(message) : message;
  const result = await processBid.execute(bidDto);
  console.log('[BidConsumer] Result:', result);
}

// Para demo: crear una subasta de ejemplo
auctionRepo.save({
  id: 'auction1',
  productId: 'product1',
  sellerId: 'seller1',
  basePrice: 100,
  durationMinutes: 25,
  region: 'América',
  status: 'active',
  createdAt: new Date(),
  bids: [],
  addBid: function (bid) { this.bids.push(bid); },
  get highestBid() { return this.bids.length ? this.bids.reduce((max, bid) => bid.amount > max.amount ? bid : max, this.bids[0]) : null; },
  get secondHighestBid() { if (this.bids.length < 2) return null; const sorted = [...this.bids].sort((a, b) => b.amount - a.amount); return sorted[1]; }
}); 