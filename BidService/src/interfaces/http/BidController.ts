import { Request, Response } from 'express';
import { SubmitBid } from '../../application/use-cases/SubmitBid';
import { SqsBidQueueRepository } from '../../infrastructure/queue/SqsBidQueueRepository';

const bidQueueRepo = new SqsBidQueueRepository();
const submitBid = new SubmitBid(bidQueueRepo);

export class BidController {
  static async submit(req: Request, res: Response) {
    const result = await submitBid.execute(req.body);
    res.status(result.success ? 200 : 400).json(result);
  }
} 