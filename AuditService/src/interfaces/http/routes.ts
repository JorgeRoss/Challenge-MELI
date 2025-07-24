import { Router } from 'express';
import { AuditController } from './AuditController';

const router = Router();

router.post('/audit', AuditController.register);
router.get('/audit', AuditController.getAll);

export default router; 