import { BidQueueRepository } from '../../domain/repositories/BidQueueRepository';
import { Bid } from '../../domain/entities/Bid';

// Simulación local de SQS (en producción usar AWS SDK)
export class SqsBidQueueRepository implements BidQueueRepository {
  async enqueue(bid: Bid): Promise<void> {
    // Aquí iría la lógica real con AWS SDK:
    // await sqs.sendMessage({ QueueUrl, MessageBody: JSON.stringify(bid) }).promise();
    console.log('[SQS] Bid enqueued:', JSON.stringify(bid));
  }
} 