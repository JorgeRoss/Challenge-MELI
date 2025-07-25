import { Request, Response } from 'express';
import { SubmitBid } from '../../application/use-cases/SubmitBid';
import { SqsBidQueueRepository } from '../../infrastructure/queue/SqsBidQueueRepository';
import { logger } from '../../infrastructure/logging/logger';

const bidQueueRepo = new SqsBidQueueRepository();
const submitBid = new SubmitBid(bidQueueRepo);

export class BidController {
  static async submit(req: Request, res: Response) {
    try {
      const result = await submitBid.execute(req.body);
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      logger.error('Error en BidController.submit', { error });
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
} 