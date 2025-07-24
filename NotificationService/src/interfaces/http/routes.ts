import { Router } from 'express';
import { NotificationController } from './NotificationController';
const router = Router();
router.post('/sns/notify', NotificationController.notify);
export default router; 