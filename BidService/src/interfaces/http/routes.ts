import { Router } from 'express';
import { BidController } from './BidController';

const router = Router();

router.post('/bid', BidController.submit);

export default router; 