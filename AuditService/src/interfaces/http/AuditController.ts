import { Request, Response } from 'express';
import { RegisterAuditEvent } from '../../application/use-cases/RegisterAuditEvent';
import { InMemoryAuditRepository } from '../../infrastructure/persistence/InMemoryAuditRepository';

const auditRepo = new InMemoryAuditRepository();
const registerAuditEvent = new RegisterAuditEvent(auditRepo);

export class AuditController {
  static async register(req: Request, res: Response) {
    try {
      await registerAuditEvent.execute(req.body);
      res.status(201).json({ success: true });
    } catch (error) {
      console.error('Error en AuditController.register', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const events = await auditRepo.findAll();
      res.json(events);
    } catch (error) {
      console.error('Error en AuditController.getAll', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
} 