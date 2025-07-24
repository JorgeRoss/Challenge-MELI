import { Request, Response } from 'express';
import { RegisterAuditEvent } from '../../application/use-cases/RegisterAuditEvent';
import { InMemoryAuditRepository } from '../../infrastructure/persistence/InMemoryAuditRepository';

const auditRepo = new InMemoryAuditRepository();
const registerAuditEvent = new RegisterAuditEvent(auditRepo);

export class AuditController {
  static async register(req: Request, res: Response) {
    await registerAuditEvent.execute(req.body);
    res.status(201).json({ success: true });
  }

  static async getAll(req: Request, res: Response) {
    const events = await auditRepo.findAll();
    res.json(events);
  }
} 