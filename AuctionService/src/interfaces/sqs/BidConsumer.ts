import { InMemoryUnitOfWork } from '../../infrastructure/persistence/InMemoryUnitOfWork';
import { SnsPublisher } from '../../infrastructure/sns/SnsPublisher';
import { PlaceBidCommandHandler } from '../../application/commands/PlaceBidCommandHandler';
import { logger } from '../../infrastructure/logging/logger';

const unitOfWork = new InMemoryUnitOfWork();
const eventPublisher = new SnsPublisher();
const placeBidHandler = new PlaceBidCommandHandler(unitOfWork, eventPublisher);

// Simulación de consumo de SQS
export async function consumeBidMessage(message: any) {
  try {
    const bidDto = typeof message === 'string' ? JSON.parse(message) : message;
    const result = await placeBidHandler.execute(bidDto);
    if (result.success) {
      console.log('[BidConsumer] Result:', result);
    } else {
      logger.warn('BidConsumer business error', { result });
    }
  } catch (error) {
    logger.error('Error en BidConsumer.consumeBidMessage', { error });
  }
}

// Para demo: crear una subasta de ejemplo
unitOfWork.getAuctionRepository().save({
  id: 'auction1',
  productId: 'product1',
  sellerId: 'seller1',
  basePrice: 100,
  durationMinutes: 25,
  region: 'América',
  status: 'active',
  createdAt: new Date(),
  bids: [],
  addBid: function (bid: any) { this.bids.push(bid); },
  get highestBid() { return this.bids.length ? this.bids.reduce((max: any, bid: any) => bid.amount > max.amount ? bid : max, this.bids[0]) : null; },
  get secondHighestBid() { if (this.bids.length < 2) return null; const sorted = [...this.bids].sort((a: any, b: any) => b.amount - a.amount); return sorted[1]; }
}); 