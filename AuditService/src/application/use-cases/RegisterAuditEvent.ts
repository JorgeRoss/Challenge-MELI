import { AuditEventDTO } from '../dtos/AuditEventDTO';
import { AuditRepository } from '../../domain/repositories/AuditRepository';

export class RegisterAuditEvent {
  constructor(private auditRepo: AuditRepository) {}

  async execute(dto: AuditEventDTO): Promise<void> {
    await this.auditRepo.save({
      id: crypto.randomUUID(),
      service: dto.service,
      type: dto.type,
      payload: dto.payload,
      timestamp: new Date(),
    });
  }
} 